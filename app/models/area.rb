class Area < ActiveRecord::Base
  include Moderation
  filters_profanity :title
  belongs_to :video, :counter_cache => true
  attr_protected :status_id, :user_id, :user_name
  
  def to_xml(options = {})
    options[:indent] ||= 0
    xml = options[:builder] ||= Builder::XmlMarkup.new(:indent => options[:indent])
    xml.instruct! unless options[:skip_instruct]
    xml.area :id => self.id, 
			:title => self.title, 
			:href => self.href, 
			:shape => self.shape, 
			:coords => self.coords, 
			:begin => self.begin, 
			:end => self.end
  end
  
  # TODO: refactor schema
  def ref_id
    self.video_id
  end
end
