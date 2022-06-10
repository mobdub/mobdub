class AddUserLogToSmilTexts < ActiveRecord::Migration
  def self.up
    add_column :smilTexts, :user_log, :text, :after => 'user_name'
  end

  def self.down
    remove_column :smilTexts, :user_log
  end
end
