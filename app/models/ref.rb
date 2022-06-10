# TODO: override compute_type and sti_name
# to support STI based on integer column
class Ref < ActiveRecord::Base
  set_table_name "videos"
  set_inheritance_column nil
  
  MEDIA_TYPES = { :video => 1, :image => 2, :article => 3 }
  
  def self.get_media_type_id(media_type)
    return nil if media_type.blank?
    type_name = media_type.to_s.split("/")[0]
    MEDIA_TYPES[type_name.downcase.to_sym] unless type_name.blank?
  end
end
