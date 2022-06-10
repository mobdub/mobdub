xml.instruct!( :xml, :version => '1.0' )
xml.smil( :xmlns => 'http://www.w3.org/ns/SMIL', :version => '3.0' ) {
  xml.head {
    xml.layout {
      xml.region( :id => 'default', :width => '100%', :height => '100%' )
    }
    xml.textStyling {
      xml.textStyle( :id => SmilText::TEXT_STYLES[:caption], :title => :caption, :textColor => 'black', :textBackgroundColor => 'white' )
      xml.textStyle( :id => SmilText::TEXT_STYLES[:subtitle], :title => :subtitle, :textColor => 'white', :textBackgroundColor => 'black' )
      xml.textStyle( :id => SmilText::TEXT_STYLES[:comment], :title => :comment, :textColor => 'gray' )
    }
  }
  xml.body {
    xml.video( :id => @video.id, :title => @video.title, :src => @video.uri, :region => 'default' ) {
      for area in @video.areas.all(:conditions => ["status_id >= ?", @video.partner.min_publish_status], :order => "begin ASC, created_at DESC")
        area.to_xml( :builder => xml, :skip_instruct => true )
      end
      for smilText in @video.smilTexts.all(:conditions => ["status_id >= ?", @video.partner.min_publish_status], :order => "begin ASC, created_at DESC")
        smilText.to_xml( :builder => xml, :skip_instruct => true )
      end
    }
  }
}