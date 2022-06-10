class CreatePermissions < ActiveRecord::Migration
  def self.up
    create_table :permissions do |t|
      t.integer :user_id
      t.integer :partner_id
      t.integer :role_id, :null => false, :default => 50
      t.boolean :default, :null => false, :default => false

      t.timestamps
    end
  end

  def self.down
    drop_table :permissions
  end
end
