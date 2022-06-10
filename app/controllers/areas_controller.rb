class AreasController < ApplicationController
  authorize :editor => [:index, :show, :new, :moderate], :root => [:edit, :update]
  
  def index # GET /areas
    @search = @partner.areas.searchlogic(params[:search]) if params[:partner_id]
    @search ||= @video.areas.searchlogic(params[:search])
    @areas = @search.paginate(:page => params[:page])
    
    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @areas }
    end
  end

  def show # GET /areas/1
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @area }
    end
  end

  def new # GET /areas/new
    @area = @video.areas.build

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @area }
    end
  end

  def edit # GET /areas/1/edit
    # @area in load_models
  end

  def create # POST /areas
    @area = @video.areas.build(params[:area])

    respond_to do |format|
      if @area.save
        flash[:notice] = 'Area was successfully created.'
        format.html { redirect_to([@video, @area]) }
        format.xml  { render :xml => @area, :status => :ok, :location => [@video, @area] }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @area.errors, :status => :unprocessable_entity }
      end
    end
  end

  def update # PUT /areas/1
    respond_to do |format|
      if @area.update_attributes(params[:area])
        flash[:notice] = 'Area was successfully updated.'
        format.html { redirect_to([@video, @area]) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @area.errors, :status => :unprocessable_entity }
      end
    end
  end

  def moderate # POST /areas/1/moderate
    @area.update_status!(params[:status]) ? head(:ok) : head(:unprocessable_entity)
  end
  
  def destroy # DELETE /areas/1
    @area.destroy
    
    respond_to do |format|
      format.html { redirect_to(video_areas_url(@video)) }
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
      @area = @video.areas.find(params[:id]) if params[:id]
    end
  end
end
