# Settings specified here will take precedence over those in config/environment.rb

require "#{RAILS_ROOT}/config/memcache" # Always load memcached in production
config.cache_store = ActiveSupport::Cache::MemCacheStore.new(MEMCACHE) if defined?(MEMCACHE)

# The production environment is meant for finished, "live" apps.
# Code is not reloaded between requests
config.cache_classes = true

# Use a different logger for distributed setups
# config.logger = SyslogLogger.new

# Full error reports are disabled and caching is turned on
config.action_controller.consider_all_requests_local = false
config.action_controller.perform_caching             = true
config.action_view.cache_template_loading            = true

# Enable serving of images, stylesheets, and javascripts from an asset server
# config.action_controller.asset_host                  = "http://assets.example.com"

# Disable mailer errors and set production host
config.action_mailer.raise_delivery_errors = false
config.action_mailer.default_url_options = { :host => "admin.mobdub.com" }
