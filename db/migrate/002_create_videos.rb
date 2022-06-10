class CreateVideos < ActiveRecord::Migration
  def self.up
    create_table :videos do |t|
      t.references :partner
      t.string :title,  :limit => 512
      t.string :uri,    :limit => 1024

      t.timestamps
    end
  end

  def self.down
    drop_table :videos
  end
end
