class UserSessionsController < ApplicationController
  before_filter :load_facebook, :only => [:new, :create]
  layout nil # for all actions
  
  def new
    @user = User.new
    @user_session = UserSession.new
  end
  alias :admin :new
  
  def create
    @user_session = UserSession.new(params[:user_session])
    @user_session.save do |result|
      if result
        flash[:notice] = "Successfully logged in."
        redirect_to (params[:reroute] || connect_user_sessions_url(:remember_me => @user_session.remember_me?))
      end
    end
    if !performed? # redirect or render yet
      @user = User.new
      render :action => (params[:reaction] || 'new')
    end
  end
  
  def connect
    if current_user_session && current_user
      cookies[:mobdub_user_info] = { :domain => cookie_domain,
        :expires => current_user_session.remember_me_until,
        :value => current_user.info_to_json }
    end
  end
  
  def destroy
    @user_session = UserSession.find
    @user_session.destroy
    flash[:notice] = "Successfully logged out."
    cookies.delete :mobdub_user_info, :domain => cookie_domain
    params[:reroute] ? redirect_to(admin_user_sessions_path(:reroute => params[:reroute])) : head(:ok)
  end
  
  private
  def load_models
    # set id for lazy loading of partner when needed
    @partner_id = params[:partner_id] if params[:partner_id]
  end

  def load_facebook
    key, secret = [partner.facebook_key, partner.facebook_secret] if partner
    Facebooker2.configuration = {:app_id => key, :secret => secret, :oauth2 => true} if key && secret
  end
end
