module Filters
  module Status
    def filters_status
      return unless ENABLED
      include InstanceMethods
      before_save { |record| record.prepare_status_notice }
      after_save  { |record| record.enqueue_status_notice }
    end

    module InstanceMethods
      def prepare_status_notice
        logger.debug "Preparing status notice"
        @notice_status = status_noticeable?
        true # resume callbacks
      end

      def enqueue_status_notice
        status = Moderation::STATUSES.index(self.status_id) if @notice_status
        emails = status_notice_emails(self.partner, status) if status
        self.delay.process_status_notice unless emails.blank?
        true # resume callbacks
      end

      # TODO: fix delayed_job setup and pass params
      # Thinking-Sphinx has conflicting delayed_job
      def process_status_notice
        status = Moderation::STATUSES.index(self.status_id)
        emails = status_notice_emails(self.partner, status) if status
        Notifier.deliver_status_notice(self, status, emails) unless emails.blank?
      end

      def status_noticeable?
        statuses = status_value(:quarantined)..status_value(:created)
        return false unless statuses.include? self.status_id
        status_id_changed? || (new_record? && has_status?(:created))
      end

      def status_notice_emails(partner, status)
        notices = partner.notices if partner
        notices["status_#{status.to_s}"] if notices
      end
    end
  end
end
