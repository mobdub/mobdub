class OauthCallbackFilter
  def initialize(app)
    @app = app
  end
  
  def call(env)
    # TODO: omarkarim edit which should be submitted as a patch
    oauth_complete = env['QUERY_STRING'].to_s.include?('oauth_complete=1')
    if oauth_complete && !env["rack.session"][:oauth_callback_method].blank?
      env["REQUEST_METHOD"] = env["rack.session"].delete(:oauth_callback_method).to_s.upcase
    end
    @app.call(env)
  end
end