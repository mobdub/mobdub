class AddPlanToPartners < ActiveRecord::Migration
  def self.up
    change_table :partners do |t|
      t.integer :plan_id, :null => false, :default => 20, :after => 'id'
    end
  end

  def self.down
    change_table :partners do |t|
      t.remove :plan_id
    end
  end
end
