# Be sure to restart your server when you modify this file.

# Include or extend app with any custom extensions that are needed.  
# Rails will automatically find namespaced extensions in the root /lib folder.
# For example, Foo::Bar will be loaded if placed inside /lib/foo/bar.rb.

ActiveRecord::Base.extend Caching::Model
ActionController::Base.send(:include, Caching::Controller)

# Include Facebooker functions and set default mobdub application
ActionController::Base.send(:include, Facebooker2::Rails::Controller)
Facebooker2.configuration = { :app_id => 00000000000, :secret => 'XXXXXXXXXXXXXXXXXXXXXXXXXXX', :oauth2 => true }

