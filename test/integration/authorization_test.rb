require 'test_helper'

class AuthorizationTest < ActionController::IntegrationTest
  
  # GET /partners should only be allowed for mobdub roots
  test("get partners sans user") { must_deny partners_path }
  test("get partners with boston_admin") { must_deny partners_path, 'boston_admin' }
  test("get partners with mobdub_admin") { must_deny partners_path, 'mobdub_admin' }
  test("get partners with mobdub_root") { must_allow partners_path, 'mobdub_root' }
  test("get partners.xml with mobdub_root") { must_allow partners_path(:format => 'xml'), 'mobdub_root' }

  # GET /partners/2 should only be allowed for boston editors+ and mobdub roots
  test("get partner with mobdub_root") { must_allow partner_path(partners(:boston)), 'mobdub_root' }
  test("get partner with boston_editor") { must_allow partner_path(partners(:boston)), 'boston_editor' }
  test("get partner with boston_admin") { must_allow partner_path(partners(:boston)), 'boston_admin' }
  test("get partner with boston_chicago_manager") { must_allow partner_path(partners(:boston)), 'boston_chicago_manager' }
  test("get partner with boston_writer") { must_deny partner_path(partners(:boston)), 'boston_writer' }
  test("get partner with mobdub_admin") { must_deny partner_path(partners(:boston)), 'mobdub_admin' }
  test("get partner with chicago_admin") { must_deny partner_path(partners(:boston)), 'chicago_admin' }
  test("get partner sans user") { must_deny partner_path(partners(:boston)) }
    
  # POST /partners should only be allowed for mobdub roots
  test("post partners with mobdub_admin") { must_deny partners_path, 'mobdub_admin', :post, :partner => { :name => 'dynamic'} }
  test("post partners with boston_admin") { must_deny partners_path, 'boston_admin', :post, :partner => { :name => 'dynamic'} }
  test("post partners with chicago_admin") { must_deny partners_path, 'chicago_admin', :post, :partner => { :name => 'dynamic'} }
  test("post partners sans user") { must_deny partners_path, nil, :post, :partner => { :name => 'dynamic'} }
  
  # GET /partners/1/script should be public
  test("get partner script sans user") { must_allow script_partner_path(partners(:mobdub), :video_id => videos(:one).id, :format => 'js') }  
  
  # GET /partners.xml should be denied for boston admins
  test "get partners using xml with boston_admin" do
    create_session('boston_admin')
    visit_path(partners_path(:format => 'xml'))
    assert_response :unauthorized
  end
  
  def must_allow(path, login = nil, method = :get, params = {})
    create_session(login) if login
    visit_path(path, method, params)
    assert_response :success
  end
  
  def must_deny(path, login = nil, method = :get, params = {})
    create_session(login) if login
    visit_path(path, method, params)
    assert_response :redirect
    assert_redirected_to admin_user_sessions_path(:reroute => path)
  end
  
  def visit_path(path, method = :get, params = {})
    case method
      when :get then get path, params
      when :post then post path, params
      when :put then put path, params
      when :delete then delete path, params
    end
  end
  
  def create_session(login)
    # See authlogic/test_case for more info on setting up sessions
    # UserSession.create(users(:mobdub_root)) - Only works in functional tests
    post user_sessions_path, :user_session => {:login => login, :password => 'pass'}
  end
end
