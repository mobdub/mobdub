class AddCounterCaches < ActiveRecord::Migration
  def self.up
    add_column :videos, :smilTexts_count, :integer, :default => 0, :after => 'uri'
    add_column :videos, :areas_count, :integer, :default => 0, :after => 'uri'
    add_column :videos, :src, :string, :limit => 1024, :after => 'uri'
    
    # Load and populate counters
    Video.reset_column_information
    
    Video.find(:all).each do |v|
      Video.update_counters v.id, :smilTexts_count => v.smilTexts.count, :areas_count => v.areas.count
    end
  end

  def self.down
    remove_column :videos, :smilTexts_count
    remove_column :videos, :areas_count
    remove_column :videos, :src
  end
end
