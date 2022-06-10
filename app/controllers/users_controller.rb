class UsersController < ApplicationController
  authorize :editor => [:index, :show, :permit]
  skip_before_filter :load_models, :except => [:index, :show, :permit]
  layout "application", :only => [:index, :show]
  
  def index # GET /users
    @search = @partner.users.searchlogic(params[:search]) if @partner && !truths(:all)
    @search ||= User.searchlogic(params[:search])

    @search.order ||= :descend_by_created_at
    @users = @search.paginate(:page => params[:page])

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @users }
      format.json { render :json => @users, :callback => params[:callback] }
    end
  end

  def show # GET /users/1
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml  => @user }
      format.json { render :json => @user, :callback => params[:callback] }
    end
  end

  def new
    @user = User.new
  end
  alias :admin :new
  
  def create
    @user = User.new(params[:user])
    @user.save do |result|
      if result
        flash[:notice] = "Registration successful."
        redirect_to (params[:reroute] || connect_user_sessions_url)
      else
        render :action => (params[:reaction] || 'new')
      end
    end
  end
  
  def edit
    @user = current_user
  end
  
  def update
    @user = current_user
    @user.attributes = params[:user]
    @user.save do |result|
      if result
        flash[:notice] = "Successfully updated profile."
        redirect_to (params[:reroute] || edit_user_path(@user))
      else
        render :action => 'edit'
      end
    end
  end
  
  def update_status
    @user = current_user
    @user.twitter_status = params[:status]
    if @user.errors.empty?
      head :ok # empty response indicates success
    else
      render :xml => @user.errors, :status => :unprocessable_entity
    end
  end

  def permit
    auth_user = current_user # get authorized roles
    auth_roles = auth_user.permissions.roles(@partner) if @partner && auth_user

    result = @user.permissions.set_role(@partner, params[:role], auth_roles) if @user && auth_roles
    result ? head(:ok) : head(:unprocessable_entity)
  end

  private
  def load_models
    @partner = Partner.find(params[:partner_id]) if params[:partner_id]
    @user = User.find(params[:id]) if params[:id]
  end
end
