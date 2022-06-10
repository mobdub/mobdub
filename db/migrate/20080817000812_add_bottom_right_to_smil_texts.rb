class AddBottomRightToSmilTexts < ActiveRecord::Migration
  def self.up
    add_column :smilTexts, :bottom, :string, :limit => 25, :after => 'top'
    add_column :smilTexts, :right, :string, :limit => 25, :after => 'top'
  end

  def self.down
    remove_column :smilTexts, :right
    remove_column :smilTexts, :bottom
  end
end
