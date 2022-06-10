class AddSsoFieldsToPartner < ActiveRecord::Migration
  def self.up
    change_table :partners do |t|
      t.string  :sso_encrypt_iv, :after => 'embed_src'
      t.string  :sso_encrypt_key, :after => 'embed_src'
      t.boolean :sso_enabled, :null => false, :default => false, :after => 'embed_src'
    end
  end

  def self.down
    change_table :partners do |t|
      t.remove :sso_enabled
      t.remove :sso_encrypt_key
      t.remove :sso_encrypt_iv
    end
  end
end
