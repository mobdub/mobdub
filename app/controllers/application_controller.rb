class ApplicationController < ActionController::Base
  before_filter :map_ref, :load_models, :authorize_user
  helper :all # include all methods in helpers folder
  helper_method :cookie_domain, :current_user, :current_user_role?
  filter_parameter_logging :password, :password_confirmation

  # TODO: use verifiable mime types to protect_from_forgery
  def verifiable_request_format?
    request.format.html? || request.format.js?
  end
  
  private
  def cookie_domain
    domain = request.host.slice(/[-a-z0-9]+(\.com?)?\.[a-z]{2,}$/i)
    domain.blank? ? request.host : ".#{domain}"
  end
  
  def partner
    return @partner if defined?(@partner)
    @partner = Partner.find(@partner_id) if defined?(@partner_id)
  end
  
  def current_user_session
    return @current_user_session if defined?(@current_user_session)
    @current_user_session = UserSession.find
  end

  def current_user
    return @current_user if defined?(@current_user)
    @current_user = current_user_session && current_user_session.user
  end
  
  def current_sso_user
    return @current_sso_user if defined?(@current_sso_user)
    @current_sso_user = User.find_or_create_by_sso(partner, cookies) || current_user
  end
  
  def current_guest_user
    return @current_guest_user if defined?(@current_guest_user)
    @current_guest_user = User.find_or_create_as_guest(partner, params) || current_sso_user
  end
  
  def current_user_role?(role)
    current_user.permissions.has_role?(partner, role) if current_user
  end
  
  def authorize_user
    user_action = (params[:action] || 'index').to_sym
    required_role = Permission.required_role(user_action, self.class.authorized_roles)
        
    if required_role && !current_user_role?(required_role)
      flash[:notice] = 'Please use an account with access to this resource.' if current_user
      respond_to do |format|
        format.html { redirect_to admin_user_sessions_path(:reroute => request.request_uri) }
        format.any(:xml, :json) { render :text => "Access denied.\n", :status => :unauthorized }
      end
    end
  end
  
  def self.authorize(roles)
    @authorized_roles = roles
  end
  
  def self.authorized_roles
    @authorized_roles ||= {}
  end
  
  def map_ref
    # openid will fail if params are altered
    params[:video_id] ||= params[:ref_id] if params[:ref_id]
    params[:video] ||= params[:ref] if params[:ref]
  end
  
  def truths(name)
    value = params[name.to_sym]
    value == 'true' ? true : false
  end

  def load_models
    # override as needed
  end
end
