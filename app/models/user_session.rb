class UserSession < Authlogic::Session::Base
  attr_accessor :screen_name
  before_validation :parse_redirect_params
  cookie_key 'mobdub_user_credentials'
  
  # customize session credentials
  def credentials=(value)
    super
    values = value.is_a?(Array) ? value : [value]
    hash = values.first.is_a?(Hash) ? values.first.with_indifferent_access : nil
    self.screen_name = hash[:screen_name] if !hash.nil? && hash.key?(:screen_name)
  end

  # override authlogic_facebook_connect/session.
  def validate_by_facebook_connect
    logger.debug 'Processing Facebook UserSession'
    super # TODO: extract facebook connect logic here
  rescue
    errors.add :facebook, I18n.t('error_messages.facebook_login_error', 
    :default => 'Could not sign in with Facebook. Please try again.')
  end
  
  # override authlogic_openid/session.
  def validate_by_openid
    logger.debug 'Processing OpenID UserSession'
    return_to = controller.url_for(:for_session => "1", :remember_me => remember_me?, :screen_name => screen_name)
    options = { :return_to => return_to, :optional => [:email, :nickname, :fullname] }
    
    # authlogic plugin makes the openid call here but it should probably be in the controller 
    controller.authenticate_with_open_id(openid_identifier, options) do |result, identifier, profile|
      if result.successful?
        user = User.find_by_openid_identifier(identifier)
        user ||= User.find_or_initialize_by_email(profile['email']) if !profile['email'].blank?
        user ||= User.new # no matching user in database so create one
        
        profile['screen_name'] = screen_name if screen_name
        user.map_openid_registration(profile)        
        user.openid_identifier = identifier
        self.attempted_record = user
      else
        errors.add(:openid_identifier, result.message)
      end
    end
  rescue
    errors.add :openid_identifier, I18n.t('error_messages.openid_login_error', 
    :default => 'Could not sign in with OpenID. Please try again.')
  end
  
  # override authlogic_oauth/session.
  def authenticate_with_oauth
    logger.debug 'Processing Twitter UserSession'
    access_token = generate_access_token
    
    user = current_user_record
    if user # TODO: extract generic method
      if user.oauth_token != access_token.token
        prior_user = search_for_record(find_by_oauth_method, access_token.token)
        if prior_user # TODO: delete prior user if no other identity
          prior_user.oauth_token = nil 
          prior_user.save(false)
        end
        user.oauth_token = access_token.token
        user.oauth_secret = access_token.secret
      end
    else
      user = search_for_record(find_by_oauth_method, access_token.token)
      if !user
        user = User.new(:oauth_token => access_token.token, :oauth_secret => access_token.secret)
        user.reset_persistence_token
      end
    end
    user.map_twitter_info
    self.attempted_record = user
  rescue
    errors.add :twitter, I18n.t('error_messages.twitter_credentials_error', 
    :default => 'Could not get account info from Twitter. Please try again.')
  end
  
  def self.twitter_auth
    # TODO: move key settings to database config
    Twitter::OAuth.new("XXXXXXXXXXXXXXXXX", "XXXXXXXXXXXXXXXXXXXXXXXXXXXX", :sign_in => true)
  end

  def self.oauth_consumer
    # authlogic_oauth requires a static call
    self.twitter_auth.consumer
  end
  
  private
  def current_user_record
    persistence_token, record_id = session_credentials
    if !persistence_token.nil?
      record = record_id.nil? ? search_for_record('find_by_persistence_token', persistence_token) : search_for_record('find_by_id', record_id)
      return record if record && record.persistence_token == persistence_token
    end
    return nil
  end
  
  def parse_redirect_params
    self.screen_name = controller.params[:screen_name] if controller.params.key?(:screen_name)
    self.remember_me = controller.params[:remember_me] == "true" if controller.params.key?(:remember_me)
  end
  
  def logger
    RAILS_DEFAULT_LOGGER
  end
end