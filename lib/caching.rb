module Caching
  module Controller
    def render_with_cache(key, options = nil)
      ttl = default_cache_ttl(key)
      key ||= request.request_uri
      yield if block_given?
      render(options) unless performed?
      Rails.cache.write(key, response.body, :expires_in => ttl)
    end
    
    def default_cache_ttl(key)
      key ? SETTINGS['cache_key_ttl'] : SETTINGS['cache_uri_ttl']
    end
  end
  
  module Model
    def acts_as_cached
      include InstanceMethods
      after_save :expire_cache
      after_destroy :expire_cache
    end

    def model_cache_key(id)
      "models/#{self.model_name.cache_key}/#{id}"
    end
        
    def find_with_cache(id)
      Rails.cache.fetch(self.model_cache_key(id)){ find(id) }
    end
    
    module InstanceMethods
      private
      def expire_cache
        Rails.cache.delete(self.class.model_cache_key(self.id))
      end
    end
  end
end
