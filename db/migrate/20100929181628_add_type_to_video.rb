class AddTypeToVideo < ActiveRecord::Migration
  def self.up
    change_table :videos do |t|
      t.string  :type, :after => 'src'
      t.integer :media_type_id, :default => 1, :after => 'partner_id'
    end
  end

  def self.down
    change_table :videos do |t|
      t.remove :media_type_id
      t.remove :type
    end
  end
end
