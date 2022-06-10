class AddUserRatingToSmilTexts < ActiveRecord::Migration
  def self.up
    change_table :smilTexts do |t|
      t.integer :status_id, :default => 50, :after => 'video_id'
      t.string :user_name, :after => 'text_style_id'
      t.integer :user_id, :after => 'text_style_id'
      
      t.integer :flag_count, :default => 0, :after => 'end'
      t.integer :vote_count, :default => 0, :after => 'end'
      t.integer :vote, :default => 0, :after => 'end'
    end
  end

  def self.down
    change_table :smilTexts do |t|
      t.remove :status_id
      t.remove :user_name
      t.remove :user_id
      t.remove :flag_count
      t.remove :vote_count
      t.remove :vote
    end
  end
end
