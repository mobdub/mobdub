class AddTwitterFieldsToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :twitter_uid, :integer, :limit => 8, :after => 'name'
    add_column :users, :pic_url, :string, :after => 'name'
    
    add_column :users, :current_login_at, :datetime, :after => 'login_count'
    add_column :users, :current_login_ip, :string, :after => 'last_login_at'
  end

  def self.down
    remove_column :users, :twitter_uid
    remove_column :users, :pic_url
    
    remove_column :users, :current_login_at
    remove_column :users, :current_login_ip
  end
end
