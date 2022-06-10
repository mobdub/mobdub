class User < ActiveRecord::Base
  has_many :permissions
  has_many :partners, :through => :permissions
  attr_accessor :screen_name, :current_login_as
  
  acts_as_authentic do |config|
    config.openid_required_fields = [:nickname, :email]
  end

  named_scope :permissions_role_id, lambda { |role_id|
    { :conditions => ["permissions.role_id = ?", role_id] }
  }
  
  def role_id(partner=nil)
    @role_id ||= self[:role_id]
    @role_id ||= permissions.role_id(partner, false) if self.permissions_count > 0
    @role_id ||= Permission::ROLES[:user]
  end
  
  def info_to_json
    to_json(:only => [:id, :pic_url], :methods => :screen_name)
  end
  
  def screen_name
    @screen_name || self.login || self.name || self.partner_uid
  end
  
  def email_prefix
    self.email.split("@")[0] unless self.email.blank?
  end
  
  def has_twitter?
    self.oauth_token && self.twitter_uid
  end

  def twitter_client
    twitter_auth = UserSession.twitter_auth # TODO: move to config
    twitter_auth.authorize_from_access(self.oauth_token, self.oauth_secret)
    Twitter::Base.new(twitter_auth)
  end
  
  def twitter_status=(value)
    twitter_client.update(value) if !value.blank?
  rescue => error
    errors.add :twitter, error.message
  end
  
  def map_twitter_info
    info = twitter_client.verify_credentials
    self.name = '@' + info.screen_name
    self.twitter_uid = info.id
    self.pic_url = info.profile_image_url
  end
  
  def map_facebook_info(facebook_session)
    self.name = "#{facebook_session.first_name} #{facebook_session.last_name}"
  end
  
  def map_openid_registration(registration)
    self.name = registration['screen_name'] if !registration['screen_name'].blank?
  end
  
  def self.map_profile_info(profile, mapping, user_attrs={})
    if profile.is_a?(Hash) && mapping.is_a?(Hash)
      mapping.each do |attr_name, profile_key|
        value = profile[profile_key.to_s]
        user_attrs[attr_name.to_sym] = value unless value.blank?
      end
      return user_attrs # modified or not
    end
  end

  # TODO: use this method for openid registration as well
  def self.find_or_initialize_by_profile(identifier, profile, mapping)
    user_attrs = map_profile_info(profile, mapping)
    if user_attrs && !user_attrs[identifier].blank?
      user = find(:first, :conditions => { identifier => user_attrs[identifier] })
      user ||= find_by_email(user_attrs[:email]) unless user_attrs[:email].blank?
      user ||= new # no existing user so initialize one
      user.attributes = user_attrs
      return user
    end
  end

  def self.find_or_create_by_sso(partner, cookies)
    return nil unless partner && cookies
    if profile = partner.parse_sso_profile(cookies)
      mapping = JSON.parse(partner.sso_mapping) if partner.sso_mapping
      if user = find_or_initialize_by_profile(:partner_uid, profile, mapping)
        user.screen_name = (user.name || user.partner_uid)
        user.current_login_as = "sso/#{user.partner_uid}"
        return user if user.save_with_validation(false)
      end
    end
  rescue => e
    logger.warn "SSO mapping error: #{e.message}"
    return nil
  end
  
  def self.find_or_create_as_guest(partner, params)
    return nil unless partner && params
    if partner.guest_allowed && params[:user]
      profile = params[:user]
      if user = find_or_initialize_by_profile(:email, profile, :email => 'email')
        user.screen_name = profile[:name]
        user.current_login_as = "guest/#{profile[:name]}"
        return user if user.save_with_validation(false)
      end
    end
  rescue => e
    logger.warn "Guest mapping error: #{e.message}"
    return nil
  end
end
