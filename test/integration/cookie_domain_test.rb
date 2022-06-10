require 'test_helper'

class CookieDomainTest < ActionController::IntegrationTest
  test "accessing site at example.org" do
    host! 'example.org'
    assert_equal_domain '.example.org'
  end
  
  test "accessing site at example.com" do
    host! 'example.com'
    assert_equal_domain '.example.com'
  end
  
  test "accessing site at www.example.com" do
    host! 'www.example.com'
    assert_equal_domain '.example.com'
  end

  test "accessing site at dub.example.com" do
    host! 'dub.example.com'
    assert_equal_domain '.example.com'
  end
  
  test "accessing site at example.com:3000" do
    host! 'example.com:3000'
    assert_equal_domain '.example.com'
  end
  
  test "accessing site at dub.Got-Milk.com" do
    host! 'dub.Got-Milk.com'
    assert_equal_domain '.Got-Milk.com'
  end
  
  test "accessing site at domain.tv.com" do
    host! 'domain.tv.com'
    assert_equal_domain '.tv.com'
  end
  
  test "accessing site at domain.com.tv" do
    host! 'domain.com.tv'
    assert_equal_domain '.domain.com.tv'
  end
  
  test "accessing site at domain.tv" do
    host! 'domain.tv'
    assert_equal_domain '.domain.tv'
  end
  
  test "accessing site at www.example.com.pk" do
    host! 'www.example.com.pk'
    assert_equal_domain '.example.com.pk'
  end
  
  test "accessing site at secure.email.website.co.uk" do
    host! 'secure.email.website.co.uk'
    assert_equal_domain '.website.co.uk'
  end
  
  test "accessing site at user:pass@this.is.the.worst.subdomain.thisIsMyMainWebsite.com.cl:3000" do
    host! 'user:pass@this.is.a.worst.shortly.subdomain.thisIsMyMainWebsite.com.cl:3000'
    assert_equal_domain '.thisIsMyMainWebsite.com.cl'
  end

  test "accessing site at www.invalid.x" do
    host! 'www.invalid.x'
    assert_equal_domain 'www.invalid.x'
  end
  
  test "accessing site at localhost" do
    host! 'localhost'
    assert_equal_domain 'localhost'
  end
  
  test "accessing site at 127.0.0.1" do
    host! '127.0.0.1'
    assert_equal_domain '127.0.0.1'
  end
  
  def assert_equal_domain(domain)
    visit connect_user_sessions_url
    controller = @integration_session.controller
    def controller.cookie_domain_public
      cookie_domain # proxy private method
    end
    assert_equal domain, controller.cookie_domain_public
  end
end
