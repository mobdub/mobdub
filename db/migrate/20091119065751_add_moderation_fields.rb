class AddModerationFields < ActiveRecord::Migration
  def self.up
    change_table :smilTexts do |t|
      t.string :body_history, :limit => 1024, :after => 'body'
    end
    
    change_table :areas do |t|
      t.string :user_name, :after => 'video_id'
      t.integer :user_id, :after => 'video_id'
      t.integer :status_id, :default => 50, :after => 'video_id'
      t.string :title_history, :limit => 512, :after => 'title'
    end
  end

  def self.down
    change_table :smilTexts do |t|
      t.remove :body_history
    end
    
    change_table :areas do |t|
      t.remove :title_history
      t.remove :status_id
      t.remove :user_id
      t.remove :user_name
    end
  end
end
