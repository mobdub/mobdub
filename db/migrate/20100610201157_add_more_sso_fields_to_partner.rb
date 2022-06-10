class AddMoreSsoFieldsToPartner < ActiveRecord::Migration
  def self.up
    change_table :partners do |t|
      t.string  :sso_mapping, :after => 'sso_enabled'
      t.string  :sso_cookie, :after => 'sso_enabled'
    end
  end

  def self.down
    change_table :partners do |t|
      t.remove :sso_mapping
      t.remove :sso_cookie
    end
  end
end
