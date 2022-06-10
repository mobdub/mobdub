class Partner < ActiveRecord::Base
  acts_as_cached
  has_many :videos
  has_many :areas, :through => :videos
  has_many :smilTexts, :through => :videos
  has_many :permissions
  has_many :users, :through => :permissions,
           :select => "users.*, permissions.role_id"
  serialize :options # to text column
  serialize :notices # for email alerts
  
  # default plan is standard
  PLANS = { :standard   => 20,
            :facebook   => 40,
            :enterprise => 80 }
  
  def self.find_by_uri(uri)
    # TODO always save blank pattern as null
    find(:all, :conditions => "pattern !='' AND pattern IS NOT NULL").each do |partner|
      abs_pattern = partner.abs_path(:pattern)
      match = uri.match(abs_pattern) if (uri && !abs_pattern.blank?)
      if match
        video_uri = match[1]
        return partner, video_uri
      end
    end
    raise ActiveRecord::RecordNotFound, "Couldn't find partner for uri #{uri}"
  end
  
  def abs_path(param)
    path = self[param]
    if path && path.starts_with?('/')
      path = (self.url + path) if self.url
    end
  end
  
  def publish_cache_key
    "partners/#{self.id}-#{self.min_publish_status}-#{self.max_per_page}"
  end
  
  def script_cache_key(video_uri)
    "views/#{self.cache_key}/script.js?uri=#{video_uri}" unless video_uri.blank?
  end
  
  def parse_sso_profile(cookies)
    return nil unless self.sso_enabled
    cookie_data = cookies[self.sso_cookie] unless self.sso_cookie.blank?
    cookie_json = Encryption.decrypt(cookie_data, self.sso_encrypt_key, self.sso_encrypt_iv) if cookie_data
    return JSON.parse(cookie_json) unless cookie_json.blank?
  rescue => e
    logger.warn "SSO parsing error: #{e.message}"
    return nil
  end
  
  def inherited_options
    return @inherited_options if defined?(@inherited_options)
    parent_id = SETTINGS['mobdub_partner_id']
    parent = self.class.find(parent_id) if self.id != parent_id
    @inherited_options = parent ? parent.options : {}
  end
  
  def merged_options
    inherited_options.merge(self.options) if inherited_options
  end
  
  def options
    self[:options] || {}
  end

  def notices
    self[:notices] || {}
  end
end
