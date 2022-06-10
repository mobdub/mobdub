class CreateSmilTexts < ActiveRecord::Migration
  def self.up
    create_table :smilTexts do |t|
      t.references :video
      t.string :title,      :limit => 512
      t.string :body,       :limit => 1024
      t.string :href,       :limit => 1024
      t.string :top,        :limit => 25
      t.string :left,       :limit => 25
      t.string :textStyle,  :limit => 50
      t.decimal :begin,     :precision => 10, :scale => 3
      t.decimal :end,       :precision => 10, :scale => 3
      
      t.timestamps
    end
  end

  def self.down
    drop_table :smilTexts
  end
end
