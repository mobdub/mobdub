# Use simple observer instead of sweeper to clear
# cache since controller handle is not needed 
class VideoSweeper < ActiveRecord::Observer
  observe Video, Area, SmilText
  
  def after_create(record)
    expire_cache(record, false)
  end
  
  def after_update(record)
    expire_cache(record)
  end
  
  def after_destroy(record)
    expire_cache(record)
  end
  
  def expire_cache(record, existing = true)
    if !record.is_a?(Video) # area or smilText
      Rails.cache.delete(record.video.show_cache_key(:xml))
      Rails.cache.delete(record.comments_cache_key) if record.is_a?(SmilText)
    elsif existing # new videos are not in cache
      Rails.cache.delete(record.show_cache_key(:xml))
      Rails.cache.delete(record.partner.script_cache_key(record.uri))
    end
  end
end