class Notifier < ActionMailer::Base
  
  def contact_message(params)
    subject     'Contact Requested - ' + params[:name] + '/' + params[:email]
    recipients  'support@mobdub.com,info@mobdub.com'
    from        'requests@mobdub.com'
    body        :params => params
    sent_on     Time.now
  end

  def info_message(params)
    subject     'Info Requested - username/email'
    recipients  'support@mobdub.com'
    from        'requests@mobdub.com'
    sent_on     Time.now
  end

  def welcome_new_user_message(params)
    subject     'Welcome New User - username/email'
    recipients  'support@mobdub.com'
    from        'requests@mobdub.com'
    sent_on     Time.now
  end
  
  def status_notice(record, status, emails)
    subject     "#{status.to_s.capitalize} Post on #{record.partner.name}"
    from        '"Mobdub Notifications" <notify@mobdub.com>'
    recipients  emails # comma separated
    body        :record => record, :status => status
    sent_on     Time.now
  end
end
