class PartnersController < ApplicationController
  authorize :editor => :show, :admin => [:edit, :update], :root => [:index, :new, :create, :destroy]
    
  def index # GET /partners
    @partners = Partner.find(:all)

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @partners }
    end
  end

  def script # GET /partners/1/script
    @video = @partner.videos.find(params[:video_id]) if params[:video_id]
    @video ||= @partner.videos.find_or_create_by_uri(params[:uri], params[:title], params[:type])
    raise ActiveRecord::RecordNotFound, 'Missing video params' unless @video
    
    respond_to do |format|
      format.js { render_with_cache @partner.script_cache_key(params[:uri]), :action => "scripts/#{@partner.script}" }
    end
  end

  def scripts # GET /partners/scripts
    @partner, video_uri = Partner.find_by_uri(params[:uri])
    @video = @partner.videos.find_or_create_by_uri(video_uri, params[:title])

    respond_to do |format|
      format.js  { render :action => "scripts/#{@partner.script}" }
    end
  end
  
  def plugin # GET /partners/plugin.user.js
    @partners = Partner.find(:all)
    
    respond_to do |format|
      format.js # plugin.js.erb
    end
  end
  
  def show # GET /partners/1
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @partner }
    end
  end

  def new # GET /partners/new
    @partner = Partner.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @partner }
    end
  end

  def edit # GET /partners/1/edit
    # @partner in load_models
    flash[:notice] = ''
  end
  
  def create # POST /partners
    @partner = Partner.new(params[:partner])

    respond_to do |format|
      if @partner.save
        flash[:notice] = 'Partner was successfully created.'
        format.html { redirect_to(@partner) }
        format.xml  { render :xml => @partner, :status => :created, :location => @partner }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @partner.errors, :status => :unprocessable_entity }
      end
    end
  end

  def update # PUT /partners/1
    respond_to do |format|
      if @partner.update_attributes(params[:partner])
        flash[:notice] = 'Settings saved.'
        format.html { render :action => "edit" }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @partner.errors, :status => :unprocessable_entity }
      end
    end
  end

  def destroy # DELETE /partners/1
    @partner.destroy

    respond_to do |format|
      format.html { redirect_to(partners_url) }
      format.xml  { head :ok }
    end
  end
  
  private
  def load_models
    @partner = Partner.find(params[:id]) if params[:id]
  end
end
