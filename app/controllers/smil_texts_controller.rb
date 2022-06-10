class SmilTextsController < ApplicationController
  authorize :editor => [:index, :show, :new, :spam, :moderate], :root => [:edit, :update]
  
  def index(cache_key=nil, per_page=nil) # GET /smilTexts
    @search = @partner.smilTexts.searchlogic(params[:search]) if params[:partner_id]
    @search ||= @video.smilTexts.searchlogic(params[:search])
    
    @search.order ||= :descend_by_created_at
    @search = yield(@search) if block_given?
    
    per_page ||= params[:per_page]
    @smilTexts = @search.paginate(:page => params[:page], :per_page => per_page)
    item_count = @smilTexts.total_entries
    
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @smilTexts.to_xml(:root => 'smilTexts') }
      format.json { render_with_cache cache_key, :json => { :items => @smilTexts, :count => item_count }, :callback => params[:callback] }
    end
  end
  
  def comments # GET /smilTexts/comments
    # cache key will default to request uri if not specified
    cache_key = SmilText.comments_cache_key(params[:video_id], partner) if params[:cache_key_partner]
    per_page  = partner.max_per_page if cache_key
    index(cache_key, per_page) { |search| search.published(partner).comments(true) }
  end

  def show # GET /smilTexts/1
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @smilText }
    end
  end

  def new # GET /smilTexts/new
    @smilText = @video.smilTexts.build

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @smilText }
    end
  end

  def edit # GET /smilTexts/1/edit
    # @smilText in load_models
  end

  def create # POST /smilTexts
    @smilText = @video.smilTexts.build(params[:smilText])
    @smilText.set_author(current_guest_user, request)
    
    respond_to do |format|
      if @smilText.save
        flash[:notice] = 'Smil Text was successfully created.'
        format.html { redirect_to(video_smilText_url(@video, @smilText)) }
        format.xml  { render :xml  => @smilText, :status => :ok, :location => video_smilText_url(@video, @smilText) }
        format.json { render :json => @smilText, :status => :ok, :location => video_smilText_url(@video, @smilText) }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml  => @smilText.errors, :status => :unprocessable_entity }
        format.json { render :json => @smilText.errors, :status => :unprocessable_entity }
      end
    end
  end

  def update # PUT /smilTexts/1
    respond_to do |format|
      if @smilText.update_attributes(params[:smilText])
        flash[:notice] = 'Smil Text was successfully updated.'
        format.html { redirect_to(video_smilText_url(@video, @smilText)) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @smilText.errors, :status => :unprocessable_entity }
      end
    end
  end
  
  def vote # POST /smilTexts/1/vote
    @smilText.update_vote!(params[:type]) ? head(:ok) : head(:unprocessable_entity)
  end
  
  def flag # POST /smilTexts/1/flag
    @smilText.update_flag!(partner) ? head(:ok) : head(:unprocessable_entity)
  end
  
  def spam # POST /smilTexts/1/spam
    @smilText.update_spam!(params[:mark]) ? head(:ok) : head(:unprocessable_entity)
  end

  def moderate # POST /smilTexts/1/moderate
    @smilText.update_status!(params[:status]) ? head(:ok) : head(:unprocessable_entity)
  end

  def destroy # DELETE /smilTexts/1
    @smilText.destroy
    
    respond_to do |format|
      format.html { redirect_to(video_smilTexts_url(@video)) }
      format.xml  { head :ok }
    end
  end
  
  private
  def load_models
    if params[:partner_id]
      @partner = Partner.find(params[:partner_id])
    elsif params[:video_id]
      @video = Video.find(params[:video_id])
      @partner_id = @video.partner_id if @video
      @smilText = @video.smilTexts.find(params[:id]) if params[:id]
    end
  end
end
