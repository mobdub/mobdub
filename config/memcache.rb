require 'memcached'

# Initialize memcached clients
MEMCACHE = Memcached::Rails.new([
  'ec2-50-19-114-40.compute-1.amazonaws.com:11211', 
  'ec2-50-19-114-67.compute-1.amazonaws.com:11211', 
  'ec2-50-19-114-148.compute-1.amazonaws.com:11211',
  'ec2-50-19-114-157.compute-1.amazonaws.com:11211',
  'ec2-50-19-114-179.compute-1.amazonaws.com:11211',
  'ec2-50-19-114-183.compute-1.amazonaws.com:11211'])

# Resolve conflict with Passenger spawning 
if defined?(PhusionPassenger)
  PhusionPassenger.on_event(:starting_worker_process) do |forked|
      MEMCACHE.reset if forked
  end
end

# Trap connection and timeout exceptions
class Memcached::Rails
  def get_with_protection(*args)
    return nil if args[0].blank?
    get_without_protection(*args)
  rescue => e
    report_exception(e)
  end
  
  def set_with_protection(*args)
    return nil if args[0].blank?
    set_without_protection(*args)
  rescue => e
    report_exception(e)
  end
  
  def delete_with_protection(*args)
    return nil if args[0].blank?
    delete_without_protection(*args)
  rescue => e
    report_exception(e)
  end
  
  def report_exception(e)
    RAILS_DEFAULT_LOGGER.info "#{e.class}: #{e.message}"
    return nil
  end
  
  alias_method_chain :get, :protection
  alias_method_chain :set, :protection
  alias_method_chain :delete, :protection
end
