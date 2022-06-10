module Moderation
  # default item status is :created
  STATUSES = {  :rejected     => 10, 
                :banned       => 15, 
                :quarantined  => 20, 
                :spammed      => 25, 
                :flagged      => 30, 
                :sanitized    => 40, 
                :created      => 50, 
                :approved     => 60  }
      
  def update_status(status)
    status_id = STATUSES[status.to_sym] if !status.blank?
    self[:status_id] = status_id if status_id
  end
  
  def update_status!(status)
    save(false) if update_status(status)
  end

  def has_status?(status)
    self[:status_id] == STATUSES[status.to_sym]
  end

  def status_value(status)
    STATUSES[status.to_sym]
  end
  
  def update_vote(type)
    type == 'down' ? decrement(:vote) : increment(:vote)
    increment(:vote_count)
  end
  
  def update_vote!(type)
    save(false) if update_vote(type)
  end

  def update_flag(partner)
    increment(:flag_count)
    return true if has_status?(:approved)
    
    limit = partner.max_flag_count if partner
    if limit && (self[:flag_count] >= limit)
      update_status :quarantined
    else
      update_status :flagged
    end
  end

  def update_flag!(partner)
    save(false) if update_flag(partner)
  end
end
