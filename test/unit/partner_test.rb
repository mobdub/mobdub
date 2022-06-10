require File.dirname(__FILE__) + '/../test_helper'

class PartnerTest < ActiveSupport::TestCase

  test "mobdub partner inherits no options" do
    assert_equal 0, partners(:mobdub).inherited_options.length
    
    # validate mobdub_partner options
    assert_equal 3, partners(:mobdub).options.length
    assert_equal 'comments viewer global default', partners(:mobdub).options['comments_viewer_default']
    assert_equal 'comments editor global default', partners(:mobdub).options['comments_editor_default']
    assert_equal false, partners(:mobdub).options['twitter_enabled']
    
    # validate merged options are same as partner options
    assert_equal 3, partners(:mobdub).merged_options.length
    assert_equal 'comments viewer global default', partners(:mobdub).merged_options['comments_viewer_default']
    assert_equal 'comments editor global default', partners(:mobdub).merged_options['comments_editor_default']
    assert_equal false, partners(:mobdub).merged_options['twitter_enabled']
    
    # attempt json conversion for front-end use
    assert_not_nil partners(:mobdub).merged_options.to_json
    puts partners(:mobdub).merged_options.to_json
  end
  
  test "partner overrides mobdub options" do
    # validate partner options
    assert_equal 4, partners(:boston).options.length
    assert_equal 'boston comments editor default', partners(:boston).options['comments_editor_default']
    assert_equal 'boston twitter search default', partners(:boston).options['twitter_search']
    assert_equal 5, partners(:boston).options['comments_read_rate']
    assert_equal true, partners(:boston).options['twitter_enabled']
    
    # validate mobdub inherited options
    assert_equal 3, partners(:boston).inherited_options.length
    assert_equal 'comments viewer global default', partners(:boston).inherited_options['comments_viewer_default']
    assert_equal 'comments editor global default', partners(:boston).inherited_options['comments_editor_default']
    assert_equal false, partners(:boston).inherited_options['twitter_enabled']
    
    # validate partner merged options
    assert_equal 5, partners(:boston).merged_options.length
    assert_equal 'comments viewer global default', partners(:boston).merged_options['comments_viewer_default']
    assert_equal 'boston comments editor default', partners(:boston).merged_options['comments_editor_default']
    assert_equal 'boston twitter search default', partners(:boston).merged_options['twitter_search']
    assert_equal 5, partners(:boston).merged_options['comments_read_rate']
    assert_equal true, partners(:boston).merged_options['twitter_enabled']
    
    # attempt json conversion for front-end use
    assert_not_nil partners(:boston).merged_options.to_json
    puts partners(:boston).merged_options.to_json
  end
  
  test "partner inherits mobdub options" do
    assert_equal 0, partners(:chicago).options.length
    
    # validate mobdub inherited options
    assert_equal 3, partners(:chicago).inherited_options.length
    assert_equal 'comments viewer global default', partners(:chicago).inherited_options['comments_viewer_default']
    assert_equal 'comments editor global default', partners(:chicago).inherited_options['comments_editor_default']
    assert_equal false, partners(:chicago).inherited_options['twitter_enabled']
    
    # validate merged options are same as inherited options
    assert_equal 3, partners(:chicago).merged_options.length
    assert_equal 'comments viewer global default', partners(:chicago).merged_options['comments_viewer_default']
    assert_equal 'comments editor global default', partners(:chicago).merged_options['comments_editor_default']
    assert_equal false, partners(:chicago).merged_options['twitter_enabled']
    
    # attempt json conversion for front-end use
    assert_not_nil partners(:chicago).merged_options.to_json
    puts partners(:chicago).merged_options.to_json
  end
end
