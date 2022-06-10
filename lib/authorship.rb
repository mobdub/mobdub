module Authorship
  def self.included(base)
    base.send :attr_accessor, :user
    base.send :serialize, :user_log
  end

  def set_author(user, request)
    map_user_info user
    map_request_info request
  end

  def map_user_info(user)
    return unless user
    self.user = user
    self.user_id = user.id
    self.user_name = user.screen_name
    self.user_log['email'] = user.email
    self.user_log['login_as'] = user.current_login_as
  end

  def map_request_info(request)
    log = self.user_log
    log['user_ip']    = request.remote_ip
    log['user_agent'] = request.env['HTTP_USER_AGENT']
    log['referrer']   = request.env['HTTP_REFERER']
  end
  
  def author
    self.user_name
  end
  
  def author_email
    self.user_log['email']
  end

  def user_ip
    self.user_log['user_ip']
  end

  def user_agent
    self.user_log['user_agent']
  end

  def referrer
    self.user_log['referrer']
  end
  
  def user_log
    self[:user_log] ||= {}
  end
end
