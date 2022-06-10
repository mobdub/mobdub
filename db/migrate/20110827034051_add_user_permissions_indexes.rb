class AddUserPermissionsIndexes < ActiveRecord::Migration
  def self.up
    add_index :users, :name
    add_index :users, :created_at
    
    remove_index :permissions, :name => 'index_on_partner_and_role_and_user' # remove old index
    add_index :permissions, [:partner_id, :user_id, :role_id], :name => 'index_on_partner_and_user_and_role'
  end

  def self.down
    remove_index :users, :name
    remove_index :users, :created_at
    
    remove_index :permissions, :name => 'index_on_partner_and_user_and_role' # remove new index
    add_index :permissions, [:partner_id, :role_id, :user_id], :name => 'index_on_partner_and_role_and_user'
  end
end
