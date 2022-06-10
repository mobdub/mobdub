class AddGuestFieldToPartner < ActiveRecord::Migration
  def self.up
    change_table :partners do |t|
      t.boolean :guest_allowed, :null => false, :default => false, :after => 'embed_src'
    end
  end

  def self.down
    change_table :partners do |t|
      t.remove :guest_allowed
    end
  end
end
