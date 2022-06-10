class AddOauthFieldsToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :oauth_secret, :string, :after => 'openid_identifier'
    add_column :users, :oauth_token, :string, :after => 'openid_identifier'
    add_index :users, :oauth_token
  end

  def self.down
    remove_column :users, :oauth_token
    remove_column :users, :oauth_secret
  end
end
