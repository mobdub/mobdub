class AddPartnerUidToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :partner_uid, :string, :after => 'pic_url'
    add_index :users, :partner_uid
    add_index :users, :login
    add_index :users, :email
    add_index :users, :facebook_uid
  end

  def self.down
    remove_column :users, :partner_uid
  end
end
