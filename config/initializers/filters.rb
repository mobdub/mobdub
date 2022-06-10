# Register any content filters and associated settings that are needed here
# Filters should define filters_* class methods by convention

# Register spam filter based on Rakismet
# https://github.com/joshfrench/rakismet
Filters::Spam::ENABLED = true
Rakismet::KEY  = 'XXXXXXXXXXX'
Rakismet::URL  = 'http://www.mobdub.com'
Rakismet::HOST = 'rest.akismet.com'
ActiveRecord::Base.extend Filters::Spam

# Register profanity filter based on fu-fu
# https://github.com/adambair/fu-fu
Filters::Profanity::ENABLED = true
ProfanityFilter::Base.replacement_text = '****'
ActiveRecord::Base.extend Filters::Profanity

# Register simple blacklist filter
Filters::Author::ENABLED = true
ActiveRecord::Base.extend Filters::Author

# Register status notification filter
Filters::Status::ENABLED = true
ActiveRecord::Base.extend Filters::Status
