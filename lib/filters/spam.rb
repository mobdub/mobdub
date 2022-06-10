module Filters
  module Spam
    def filters_spam(attr_name)
      return unless ENABLED
      include Rakismet::Model
      include InstanceMethods
      rakismet_attrs :content => attr_name
      after_create { |record| record.enqueue_spam_check }
    end
      
    module InstanceMethods
      def enqueue_spam_check
        self.delay.perform_spam_check
        true # delayed_job setup
      end
      
      def perform_spam_check
        update_status!(:spammed) if self.spam?
        log_spam_check(self.akismet_response)
        true # continue callbacks
      end
      
      def log_spam_check(response)
        if response == 'true' || response == 'false'
          logger.debug "Spam check returned: #{response}"
        else
          logger.warn "Spam check failed with: #{response}"
        end
      end
      
      def update_spam!(mark)
        mark == 'true' ? mark_as_spam : mark_as_ham
        true # ignore rakismet errors
      end
      
      def mark_as_spam
        update_status! :spammed
        self.spam! # rakismet
      end
      
      def mark_as_ham
        update_status! :created
        self.ham! # rakismet
      end
    end
  end
end
