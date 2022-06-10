class AddNoticesToPartner < ActiveRecord::Migration
  def self.up
    change_table :partners do |t|
      t.text :notices, :after => 'options'
    end
  end

  def self.down
    change_table :partners do |t|
      t.remove :notices
    end
  end
end
