class SmilText < ActiveRecord::Base
  include Authorship, Moderation
  set_table_name "smilTexts"
  before_save :populate_fields
  filters_author
  filters_status
  filters_spam :body
  filters_profanity :title, :body, :user_name
  belongs_to :video, :counter_cache => :smilTexts_count
  attr_protected :status_id, :user_id, :user_name, :vote, :flag_count
  
  TEXT_STYLES = { :caption => 1, :subtitle => 2, :comment => 3 }
    
  named_scope :comments, :conditions => { :text_style_id => TEXT_STYLES[:comment] }
  named_scope :ref_uri, lambda { |uri| { :conditions => ["#{Ref.table_name}.uri = ?", uri] } }
  named_scope :published, lambda { |p| { :conditions => ["status_id >= ?", p.min_publish_status] } }
  
  def as_json(options = {})
    options[:methods] = :ref_id
    options[:only] ||= [:id, #:ref_id, 
      :user_id, :user_name, :text_style_id, 
      :body, :begin, :end, :vote, :created_at]
    super(options)
  end
  
  def to_xml(options = {})
    options[:indent] ||= 0
    xml = options[:builder] ||= Builder::XmlMarkup.new(:indent => options[:indent])
    xml.instruct! unless options[:skip_instruct]
    xml.smilText( :id => self.id, 
      :user => self.user_id,
      :userName => self.user_name,
      :textStyle => self.text_style_id,
      :title => self.title,
      :top => self.top,
      :right => self.right,
      :bottom => self.bottom,
      :left => self.left,
      :begin => self.begin, 
      :end => self.end,
      :vote => self.vote,
      :createdAt => self.created_at.iso8601 ){
      if !self.href.blank?
        xml.a(self.body, :href => self.href)
      else
        xml.text!(self.body)
      end
    }
  end
  
  def self.comments_cache_key(ref_id, partner, format = :json)
    "#{partner.publish_cache_key}/refs/#{ref_id}/smilTexts/comments.#{format}" if ref_id && partner
  end

  def comments_cache_key(format = :json)
    self.class.comments_cache_key(self.ref_id, self.partner, format)
  end
  
  # TODO: refactor schema
  def ref_id
    self.video_id
  end
  
  def partner
    self.video.partner
  end
  
  protected
  def populate_fields
    self.body  ||= ''
    self.title ||= self.body[0,50]
  end
end
