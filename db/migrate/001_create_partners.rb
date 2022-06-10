class CreatePartners < ActiveRecord::Migration
  def self.up
    create_table :partners do |t|
      t.string :name,       :limit => 100
      t.string :url,        :limit => 100
      t.string :script,     :limit => 100
      t.string :pattern,    :limit => 512
      t.string :link_url,   :limit => 1024
      t.string :embed_src,  :limit => 1024

      t.timestamps
    end
  end

  def self.down
    drop_table :partners
  end
end
