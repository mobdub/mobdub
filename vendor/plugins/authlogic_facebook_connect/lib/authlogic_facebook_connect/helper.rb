module AuthlogicFacebookConnect
  module Helper
    def authlogic_facebook_login_button(text, options = {})
      options[:controller] ||= "user_session"
      options[:onlogin] = "connect_to_facebook();"
      
      output = "<form id='connect_to_facebook_form' method='post' action='#{options[:controller]}'>\n"
      output << "<input type='hidden' name='authenticity_token' value='#{form_authenticity_token}'/>\n"
      # TODO: omarkarim edit which should be submitted as a patch
      output << "<input type='hidden' name='login_with_facebook' value='enabled'/>\n"
      output << "</form>\n"
      output << "<script type='text/javascript' charset='utf-8'>\n"
      output << " function connect_to_facebook() {\n"
      output << "   document.getElementById('connect_to_facebook_form').submit();\n"
      output << " }\n"
      output << "</script>\n"
      options.delete(:controller)
      output << content_tag("fb:login-button", text, options)
      output
    end
  end
end
