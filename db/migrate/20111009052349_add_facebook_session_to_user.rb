class AddFacebookSessionToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :facebook_session_key, :string, :after => 'facebook_uid'
  end

  def self.down
    remove_column :users, :facebook_session_key
  end
end
