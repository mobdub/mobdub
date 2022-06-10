class VideosController < ApplicationController
  authorize :editor => [:index, :new, :edit, :create, :update, :destroy]
  
  def index # GET /videos
    @search = @partner.videos.searchlogic(params[:search]) if @partner
    @search ||= Video.searchlogic(params[:search])
    @videos = @search.paginate(:page => params[:page])
    
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @videos }
      format.json { render :json => @videos, :callback => params[:callback] }
    end
  end
  
  def list # TODO: merge with index using searchlogic for admin site
    @videos = @partner.videos.list(params) if @partner
    @videos ||= Video.list(params)
    
    respond_to do |format|
      format.html # list.html.erb
      format.xml  { render :xml => @videos }
      format.json { render :json => @videos, :callback => params[:callback] }
    end
  end

  def show # GET /videos/1
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render_with_cache @video.show_cache_key(:xml) }
      format.json { render :json => @video.to_json(:include => [:areas, :smilTexts]), :callback => params[:callback] }
    end
  end

  def new # GET /videos/new
    @video = @partner.videos.build

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @video }
    end
  end

  def edit # GET /videos/1/edit
    # @video in load_models
  end

  def create # POST /videos
    @video = @partner.videos.build(params[:video])

    respond_to do |format|
      if @video.save
        flash[:notice] = 'Video was successfully created.'
        format.html { redirect_to(@video) }
        format.xml  { render :xml => @video, :status => :created, :location => @video }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @video.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  def update # PUT /videos/1
    respond_to do |format|
      if @video.update_attributes(params[:video])
        flash[:notice] = 'Video was successfully updated.'
        format.html { redirect_to(@video) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @video.errors, :status => :unprocessable_entity }
      end
    end
  end

  def destroy # DELETE /videos/1
    @video.destroy
    
    respond_to do |format|
      format.html { redirect_to(videos_url) }
      format.xml  { head :ok }
    end
  end
  
  private
  def load_models
    if params[:partner_id]
      @partner = Partner.find(params[:partner_id])
      @video = @partner.videos.find(params[:id]) if params[:id]
    elsif params[:id]
      @video = Video.find(params[:id])
      @partner = @video.partner
    end
  end
end
