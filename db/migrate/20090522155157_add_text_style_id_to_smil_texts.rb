class AddTextStyleIdToSmilTexts < ActiveRecord::Migration
  def self.up
    change_table :smilTexts do |t|
      t.integer :text_style_id, :default => 1, :after => 'video_id' 
      t.remove :textStyle
    end
  end

  def self.down
    change_table :smilTexts do |t|
      t.string :textStyle, :limit => 50
      t.remove :text_style_id
    end
  end
end
