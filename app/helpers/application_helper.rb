# Methods added to this helper will be available to all templates in the application.
module ApplicationHelper

  def partner_player_div
    # TODO: Load value from database
    params[:player_div] ? params[:player_div] : 'watch-player'
  end

  def partner_movie_id
    # TODO: Load value from database
    params[:movie_id] ? params[:movie_id] : 'movie_player'
  end

  def partner_video_embed_src(partner, video)
    video.sub_uri( partner.abs_path(:embed_src) ) if (video && partner)
  end

  def partner_video_link_url(partner, video)
    video.sub_uri( partner.abs_path(:link_url) ) if (video && partner)
  end

  def base_url
    request.protocol + request.host_with_port
  end

  def moderation_status_list
    status_list = Moderation::STATUSES.inject({}) do |options, (key, value)|
      options[key.to_s.humanize] = value
      options
    end

    status_list.sort {|a, b| a[1]<=>b[1]}
  end

  def moderation_flag_count_list
    flag_count_list = {
            "Once" => 1,
            "Twice" => 2,
            "Thrice" => 3,
            "4 times" => 4,
            "5 times" => 5,
            "6 times" => 6,
            "7 times" => 7,
            "8 times" => 8,
            "9 times" => 9,
            "10 times" => 10
    }

    flag_count_list.sort {|a, b| a[1]<=>b[1]}
  end

  def search_media_source_filter_list
    {
      "Professional" => 1,
      "Amateur" => 2,
    }
  end

  def search_media_type_filter_list
    media_list = Ref::MEDIA_TYPES.inject({}) do |options, (key, value)|
      options[key.to_s.capitalize()] = value
      options
    end
  end

  def search_text_type_filter_list
    text_list = SmilText::TEXT_STYLES.inject({}) do |options, (key, value)|
      options[key.to_s.capitalize()] = value
      options
    end

    #TODO: add hotspot option - which should take search to the areas/index
  end

  def search_date_filter_list
    {
	  "All" => "",
      "Last 7 Days" => 1.week.ago.to_date,
      "Today" => 0.days.ago.to_date,
      "Last 30 Days" => 1.month.ago.to_date
    }
  end
 
  def user_search_date_filter_list
    {
    "All" => "",
      "Last 7 Days" => 1.week.ago.to_date,
      "Today" => 0.days.ago.to_date,
      "Last 30 Days" => 1.month.ago.to_date
    }
  end
  
  def user_role_filter_list
    user_type_list = current_user.permissions.roles(@partner).inject({}) do |options, (key, value)|
      options[key.to_s.capitalize()] = value unless value == 80     # Filter root user
      options
    end
    
    user_type_list.sort {|a, b| b[1]<=>a[1]}
  end
  
  def search_user_role_filter_list
    user_type_list = current_user.permissions.roles(@partner).inject({}) do |options, (key, value)|
      options[key.to_s.capitalize()] = value unless (value == 80 || value == 50)    # Filter root and user
      options
    end
    
    user_type_list.merge!({"All Users" => ""})
  end
  
  def is_root
    @is_root ||= current_user_role?(:root)
  end

  def is_admin
    @is_admin ||= current_user_role?(:admin)
  end

  def is_editor
    @is_editor ||= current_user_role?(:editor)
  end
  
  def partner_plan_list
    text_list = Partner::PLANS.inject({}) do |options, (key, value)|
      options[key.to_s.capitalize()] = value
      options
    end
  end
  
  def allow_comments
    if (@partner.plan_id == Partner::PLANS[:standard] || @partner.plan_id == Partner::PLANS[:enterprise])
      return true
    end
  end
 
  def allow_twitter
    if (@partner.plan_id == Partner::PLANS[:enterprise])
      return true
    end
  end
   
  def allow_facebook
    if (@partner.plan_id == Partner::PLANS[:facebook] || @partner.plan_id == Partner::PLANS[:enterprise])
      return true
    end
  end
  
  def allow_annotations
    if (@partner.plan_id == Partner::PLANS[:enterprise])
      return true
    end
  end
end
