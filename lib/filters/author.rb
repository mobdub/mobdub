module Filters
  module Author
    def filters_author
      return unless ENABLED
      include InstanceMethods
      before_create { |record| record.process_author }
    end

    module InstanceMethods
      def process_author
        if self.user && self.user.permissions_count > 0
          partner_id = self.video.partner_id if self.video
          troll = self.user.permissions.find_by_partner_role(partner_id, :troll, '=') if partner_id
          update_status(:banned) if troll
        end
        true # resume callbacks
      end
    end
  end
end
