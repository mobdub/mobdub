class AddOptionsToPartner < ActiveRecord::Migration
  def self.up
    change_table :partners do |t|
      t.text    :options, :after => 'url'
      t.integer :min_publish_status, :limit => 2, :default => 30, :after => 'embed_src'
      t.string  :facebook_secret, :after => 'embed_src'
      t.string  :facebook_key, :after => 'embed_src'
    end
    add_column :videos, :options, :text, :after => 'description'
  end

  def self.down
    change_table :partners do |t|
      t.remove :facebook_key
      t.remove :facebook_secret
      t.remove :min_publish_status
      t.remove :options
    end
    remove_column :videos, :options
  end
end
