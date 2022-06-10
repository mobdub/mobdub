class Video < ActiveRecord::Base
  belongs_to :partner
  has_many :smilTexts
  has_many :areas
  serialize :options
  set_inheritance_column nil
  before_create :set_media_type
   
  SORT_ORDERS = ['dub_count', 'created_at']
  DUB_COUNT_SQL = '(areas_count + smilTexts_count)'
  
  define_index do
      indexes title
      indexes description

      indexes areas.title, :as => :areas_title
      indexes areas.href, :as => :areas_href  
      
      indexes smilTexts.body, :as => :smilTexts_body
      indexes smilTexts.href, :as => :smilTexts_href
      
      indexes partner.name, :as => :partner      
      has partner_id, created_at
      
      has DUB_COUNT_SQL, :type => :integer, :as => :dub_count
      # set_property :delta => true
  end
  
  def self.list(options = {})
    options[:page] ||= 1
    options[:per_page] ||= 25
    
    if options[:order] && SORT_ORDERS.include?(options[:order])
      order_mode = ['ASC','DESC'].detect { |m| options[:order_mode].upcase == m } if options[:order_mode]
      order = options[:order] + ' ' + (order_mode || 'DESC')
    end
    if !options[:search].blank?
      search options[:search], :with => { :partner_id => options[:partner_id] },
        :page => options[:page], :per_page => options[:per_page], :order => order
    else
      order.sub!( 'dub_count', DUB_COUNT_SQL ) if order
      paginate :page => options[:page], :per_page => options[:per_page], 
        :order => (order || 'created_at DESC')
    end
  end
  
  def self.find_by_uri(uri)
    find(:first, :conditions => { :uri => uri }) unless uri.blank?
  end
  
  def self.find_or_create_by_uri(uri, title, type=nil)
    video = find_by_uri(uri)
    video ||= Video.create(:uri => uri, :title => title, :type => type) unless uri.blank?
  end
  
  def sub_uri(path)
    path.sub('{VIDEO_URI}', self.uri) if (path && self.uri)
  end
  
  def to_xml(options = {})
    options[:indent] ||= 0
    xml = options[:builder] ||= Builder::XmlMarkup.new(:indent => options[:indent])
    xml.instruct! unless options[:skip_instruct]
    xml.video :id => self.id, :title => self.title, :src => self.uri
  end
  
  def self.show_cache_key(id, partner, format = :html)
    "views/videos/#{id}.#{format}?status=#{partner.min_publish_status}"
  end

  def show_cache_key(format = :html)
    self.class.show_cache_key(self.id, self.partner, format)
  end
  
  def inherited_options
    @inherited_options ||= self.partner.merged_options if self.partner
  end
  
  def merged_options
    inherited_options.merge(self.options) if inherited_options
  end
  
  def options
    self[:options] || {}
  end
  
  protected
  def set_media_type
    type_id = Ref.get_media_type_id(self[:type])
    self.media_type_id = type_id if type_id
  end
end
