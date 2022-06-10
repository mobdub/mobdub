class AddThumbDescriptionToVideo < ActiveRecord::Migration
  def self.up
    add_column :videos, :description, :string, :limit => 2048, :after => 'src'
    add_column :videos, :thumb, :string, :limit => 1024, :after => 'src'
  end

  def self.down
    remove_column :videos, :description
    remove_column :videos, :thumb
  end
end
