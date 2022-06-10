class AddPermissionsLookup < ActiveRecord::Migration
  def self.up
    add_column :users, :permissions_count, :integer, :default => 0, :after => 'persistence_token'
    add_index :permissions, [:partner_id, :role_id, :user_id], :name => 'index_on_partner_and_role_and_user'
  end

  def self.down
    remove_column :users, :permissions_count
    remove_index :permissions, :name => 'index_on_partner_and_role_and_user'
  end
end
