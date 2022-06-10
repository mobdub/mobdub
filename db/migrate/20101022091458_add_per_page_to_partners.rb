class AddPerPageToPartners < ActiveRecord::Migration
  def self.up
    add_column :partners, :max_per_page, :integer, :limit => 2, :default => 15, :after => 'max_flag_count'
  end

  def self.down
    remove_column :partners, :max_per_page
  end
end
