class CreateAreas < ActiveRecord::Migration
  def self.up
    create_table :areas do |t|
      t.references :video
      t.string :title,    :limit => 512
      t.string :href,     :limit => 1024
      t.string :shape,    :limit => 50
      t.string :coords,   :limit => 100
      t.decimal :begin,   :precision => 10, :scale => 3
      t.decimal :end,     :precision => 10, :scale => 3

      t.timestamps
    end
  end

  def self.down
    drop_table :areas
  end
end
