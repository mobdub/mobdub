class NotifierController < ApplicationController
  def create
    # Create support for multiple notifications
    case params[:type]
      when 'contact'
        Notifier.deliver_contact_message(params)
        redirect_to '/contact_submit.html'
      when 'info'
        #Notifier.deliver_info_message(params)
      when 'welcome_new_user'
        #Notifier.deliver_welcome_new_user_message(params)
    end
  end

end
