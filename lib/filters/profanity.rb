module Filters
  module Profanity
    def filters_profanity(*attr_names)
      return unless ENABLED
      include InstanceMethods
      options = attr_names.last.is_a?(Hash) ? attr_names.pop : {}
      attr_names.each { |attr_name| setup_sanitize_for(attr_name, options[:mode]) }
    end
     
    def setup_sanitize_for(attr_name, mode)
      before_validation { |record| record.sanitize_attribute(attr_name, mode) }
    end
    
    module InstanceMethods
      def sanitize_attribute(attr_name, mode)
        original_value = self[attr_name] # TODO: escape illegal chars
        self[attr_name] = ProfanityFilter::Base.clean(original_value, mode)
        update_history(attr_name, original_value) if self[attr_name] != original_value
      end
      
      def update_history(attr_name, last_value)
        attr_history = "#{attr_name}_history"
        self[attr_history] = last_value if respond_to?(attr_history)
        update_status :sanitized
      end
    end
  end
end
