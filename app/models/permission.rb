class Permission < ActiveRecord::Base
  belongs_to :user, :counter_cache => true
  belongs_to :partner
    
  # default role is user
  ROLES = { :troll  => 10, 
            :user   => 50,
            :editor => 60, 
            :admin  => 70, 
            :root   => 80 }
  
  def self.find_by_partner_role(partner_id, role, range='>=')
    role_id = ROLES[role] if role
    if role_id && partner_id
      find(:first, :conditions => ["role_id #{range} ? AND partner_id = ?", role_id, partner_id])
    end
  end
  
  def self.has_role?(partner, role)
    permission = find_by_partner_role(partner.id, role) if partner
    permission ||= find_by_partner_role(SETTINGS['mobdub_partner_id'], :root)
  end
  
  def self.role_id(partner, find_root=true)
    permission = find_by_partner_id(partner.id) if partner
    permission ||= find_by_partner_role(SETTINGS['mobdub_partner_id'], :root) if find_root
    permission ? permission.role_id : ROLES[:user]
  end

  def self.roles(partner, find_root=true)
    partner_role_id = role_id(partner, find_root)
    ROLES.reject {|name,id| id > partner_role_id }
  end

  def self.set_role(partner, role, roles=ROLES)
    role_id = roles[role.to_sym] unless role.blank?
    if role_id && partner
      permission = find_or_initialize_by_partner_id(partner.id)
      if role_id == roles[:user]
        permission.destroy unless permission.new_record?
      else
        permission.role_id = role_id
        permission.save
      end
    end
  end

  def self.required_role(user_action, role_actions)
    role_actions ||= {}
    role_actions.each_pair do |role, action|
      if action.is_a?(Array)
        return role if action.include?(user_action)
      else
        return role if action == user_action || action == :all
      end
    end
    return nil
  end
end