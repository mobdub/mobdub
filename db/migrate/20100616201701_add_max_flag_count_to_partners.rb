class AddMaxFlagCountToPartners < ActiveRecord::Migration
  def self.up
    add_column :partners, :max_flag_count, :integer, :limit => 2, :after => 'min_publish_status'
  end

  def self.down
    remove_column :partners, :max_flag_count
  end
end
