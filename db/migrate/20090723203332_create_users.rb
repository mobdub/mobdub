class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.references :partner
      t.integer :user_type_id,    :null => false, :default => 50
      t.string :login,            :null => true, :default => nil
      t.string :email
      t.string :crypted_password, :null => true, :default => nil
      t.string :password_salt,    :null => true, :default => nil
      t.string :persistence_token
      t.integer :login_count,     :null => false, :default => 0
      t.datetime :last_login_at
      t.string :last_login_ip
      t.timestamps
    end
  end
  
  def self.down
    drop_table :users
  end
end
