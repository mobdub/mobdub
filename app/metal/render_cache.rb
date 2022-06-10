# Allow the metal piece to run in isolation
require(File.dirname(__FILE__) + "/../../config/environment") unless defined?(Rails)

class RenderCache
  def self.call(env)
    response = respond_with_cache(env)
    response ? response : [404, {"Content-Type" => "text/html"}, ["Not Found"]]
  end
  
  def self.respond_with_cache(env)
    case env["PATH_INFO"].to_s
    when /^\/partners\/(\d+)\/script\.js/
      request = Rack::Request.new(env)
      partner = Partner.find_with_cache($1)
      cache_key = partner.script_cache_key(request.params['uri'])
      render_from_cache(cache_key, 'text/javascript')
    when /^\/partners\/(\d+)\/videos\/(\d+)\.xml/
      partner = Partner.find_with_cache($1)
      cache_key = Video.show_cache_key($2, partner, :xml)
      render_from_cache(cache_key, 'application/xml')
    when /^\/(partners|refs)\/(\d+)\/smilTexts\/comments\.json/
      ref_request = Rack::Request.new(env) if ($1 == 'refs')
      partner_id = ref_request.params['cache_key_partner'] if ref_request
      partner = Partner.find_with_cache(partner_id) if partner_id
      cache_key = SmilText.comments_cache_key($2, partner) if partner
      cache_key ||= env['REQUEST_URI'].to_s # default to uri
      render_from_cache(cache_key, 'application/json')
    end
  end
  
  def self.render_from_cache(cache_key, content_type)
    if cache_response = Rails.cache.read(cache_key)
      Rails.logger.debug("Cache render: #{cache_key}")
      [200, {"Content-Type" => "#{content_type}; charset=utf-8"}, [cache_response]]
    end
  end
end
