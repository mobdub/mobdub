class AddReadIndexes < ActiveRecord::Migration
  def self.up
    # index prefix support was added in rails 2.3.6
    # using mysql_index_length plugin in the meantime
    add_index :videos, [:partner_id, :uri], :limit => { :uri => 20 }
    
    add_index :smilTexts, [:video_id, :status_id, :text_style_id], :name => 'index_on_video_and_status_and_style'
    add_index :areas, [:video_id, :status_id]
  end

  def self.down
    remove_index :videos, :column => [:partner_id, :uri]
    remove_index :areas, :column => [:video_id, :status_id]
    remove_index :smilTexts, :name => 'index_on_video_and_status_and_style'
  end
end
