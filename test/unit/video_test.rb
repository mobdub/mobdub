require File.dirname(__FILE__) + '/../test_helper'

class VideoTest < ActiveSupport::TestCase
    
  test "mobdub video overrides global options" do
    # validate video specific options
    assert_equal 3, videos(:one).options.length
    assert_nil videos(:one).options['comments_custom_nil']
    assert_equal 420, videos(:one).options['comments_custom_number']
    assert_equal '{comments <viewer/> \ndefault for video}', videos(:one).options['comments_viewer_default']

    # validate mobdub_partner inherited options
    assert_equal 3, videos(:one).inherited_options.length
    assert_equal 'comments viewer global default', videos(:one).inherited_options['comments_viewer_default']
    assert_equal 'comments editor global default', videos(:one).inherited_options['comments_editor_default']
    assert_equal false, videos(:one).inherited_options['twitter_enabled']

    # validate mobdub_partner/video merged options
    assert_equal 5, videos(:one).merged_options.length
    assert_nil videos(:one).merged_options['comments_custom_empty']
    assert_equal 420, videos(:one).merged_options['comments_custom_number']
    assert_equal '{comments <viewer/> \ndefault for video}', videos(:one).merged_options['comments_viewer_default']
    assert_equal 'comments editor global default', videos(:one).merged_options['comments_editor_default']
    assert_equal false, videos(:one).merged_options['twitter_enabled']
    
    # attempt json conversion for front-end use
    assert_not_nil videos(:one).merged_options.to_json
    puts videos(:one).merged_options.to_json
  end
  
  test "partner video overrides options" do
    # validate video specific options
    assert_equal 3, videos(:two).options.length
    assert_equal '', videos(:two).options['comments_custom_empty']
    assert_equal '?q=twitter&search&amp;for%23video', videos(:two).options['twitter_search']
    assert_equal '#videotwo', videos(:two).options['twitter_tags']
    
    # validate partner inherited options
    assert_equal 5, videos(:two).inherited_options.length
    assert_equal 'comments viewer global default', videos(:two).inherited_options['comments_viewer_default']
    assert_equal 'boston comments editor default', videos(:two).inherited_options['comments_editor_default']
    assert_equal 'boston twitter search default', videos(:two).inherited_options['twitter_search']
    assert_equal 5, videos(:two).inherited_options['comments_read_rate']
    assert_equal true, videos(:two).inherited_options['twitter_enabled']
    
    # validate partner/video merged options
    assert_equal 7, videos(:two).merged_options.length
    assert_equal '', videos(:two).merged_options['comments_custom_empty']
    assert_equal 'comments viewer global default', videos(:two).merged_options['comments_viewer_default']
    assert_equal 'boston comments editor default', videos(:two).merged_options['comments_editor_default']
    assert_equal '?q=twitter&search&amp;for%23video', videos(:two).merged_options['twitter_search']
    assert_equal '#videotwo', videos(:two).merged_options['twitter_tags']    
    assert_equal 5, videos(:two).merged_options['comments_read_rate']
    assert_equal true, videos(:two).merged_options['twitter_enabled']
    
    # attempt json conversion for front-end use
    assert_not_nil videos(:two).merged_options.to_json
    puts videos(:two).merged_options.to_json
  end
  
  test "partner video inherits options" do
    # validate video has no options
    assert_equal 0, videos(:three).options.length
    
    # validate partner inherited options
    assert_equal 5, videos(:three).inherited_options.length
    assert_equal 'comments viewer global default', videos(:three).inherited_options['comments_viewer_default']
    assert_equal 'boston comments editor default', videos(:three).inherited_options['comments_editor_default']
    assert_equal 'boston twitter search default', videos(:three).inherited_options['twitter_search']
    assert_equal 5, videos(:three).inherited_options['comments_read_rate']
    assert_equal true, videos(:three).inherited_options['twitter_enabled']
    
    # validate merged options are same as inherited options
    assert_equal 5, videos(:three).merged_options.length
    assert_equal 'comments viewer global default', videos(:three).merged_options['comments_viewer_default']
    assert_equal 'boston comments editor default', videos(:three).merged_options['comments_editor_default']
    assert_equal 'boston twitter search default', videos(:three).merged_options['twitter_search']
    assert_equal 5, videos(:three).merged_options['comments_read_rate']
    assert_equal true, videos(:three).merged_options['twitter_enabled']
    
    # attempt json conversion for front-end use
    assert_not_nil videos(:three).merged_options.to_json
    puts videos(:three).merged_options.to_json
  end
  
  test "partner and video both inherit options" do
    # validate video has no options
    assert_equal 0, videos(:four).options.length
    
    # validate partner has no options
    assert_equal 0, partners(:chicago).options.length
    
    # validate mobdub_partner inherited options
    assert_equal 3, videos(:four).inherited_options.length
    assert_equal 'comments viewer global default', videos(:four).inherited_options['comments_viewer_default']
    assert_equal 'comments editor global default', videos(:four).inherited_options['comments_editor_default']
    assert_equal false, videos(:four).inherited_options['twitter_enabled']
    
    # validate merged options are same as inherited options
    assert_equal 3, videos(:four).merged_options.length
    assert_equal 'comments viewer global default', videos(:four).merged_options['comments_viewer_default']
    assert_equal 'comments editor global default', videos(:four).merged_options['comments_editor_default']
    assert_equal false, videos(:four).merged_options['twitter_enabled']
    
    # attempt json conversion for front-end use
    assert_not_nil videos(:four).merged_options.to_json
    puts videos(:four).merged_options.to_json
  end
end
