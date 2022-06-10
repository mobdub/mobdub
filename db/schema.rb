# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20111009052349) do

  create_table "areas", :force => true do |t|
    t.integer  "video_id"
    t.integer  "status_id",                                                    :default => 50
    t.integer  "user_id"
    t.string   "user_name"
    t.string   "title",         :limit => 512
    t.string   "title_history", :limit => 512
    t.string   "href",          :limit => 1024
    t.string   "shape",         :limit => 50
    t.string   "coords",        :limit => 100
    t.decimal  "begin",                         :precision => 10, :scale => 3
    t.decimal  "end",                           :precision => 10, :scale => 3
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "areas", ["video_id", "status_id"], :name => "index_areas_on_video_id_and_status_id", :limit => {"video_id"=>nil, "status_id"=>nil}

  create_table "delayed_jobs", :force => true do |t|
    t.integer  "priority",   :default => 0
    t.integer  "attempts",   :default => 0
    t.text     "handler"
    t.text     "last_error"
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], :name => "delayed_jobs_priority", :limit => {"priority"=>nil, "run_at"=>nil}

  create_table "open_id_authentication_associations", :force => true do |t|
    t.integer "issued"
    t.integer "lifetime"
    t.string  "handle"
    t.string  "assoc_type"
    t.binary  "server_url"
    t.binary  "secret"
  end

  create_table "open_id_authentication_nonces", :force => true do |t|
    t.integer "timestamp",  :null => false
    t.string  "server_url"
    t.string  "salt",       :null => false
  end

  create_table "partners", :force => true do |t|
    t.integer  "plan_id",                            :default => 20,    :null => false
    t.string   "name",               :limit => 100
    t.string   "url",                :limit => 100
    t.text     "options"
    t.text     "notices"
    t.string   "script",             :limit => 100
    t.string   "pattern",            :limit => 512
    t.string   "link_url",           :limit => 1024
    t.string   "embed_src",          :limit => 1024
    t.boolean  "guest_allowed",                      :default => false, :null => false
    t.boolean  "sso_enabled",                        :default => false, :null => false
    t.string   "sso_cookie"
    t.string   "sso_mapping"
    t.string   "sso_encrypt_key"
    t.string   "sso_encrypt_iv"
    t.string   "facebook_key"
    t.string   "facebook_secret"
    t.integer  "min_publish_status", :limit => 2,    :default => 30
    t.integer  "max_flag_count",     :limit => 2
    t.integer  "max_per_page",       :limit => 2,    :default => 15
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "permissions", :force => true do |t|
    t.integer  "user_id"
    t.integer  "partner_id"
    t.integer  "role_id",    :default => 50,    :null => false
    t.boolean  "default",    :default => false, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "permissions", ["partner_id", "user_id", "role_id"], :name => "index_on_partner_and_user_and_role", :limit => {"role_id"=>nil, "user_id"=>nil, "partner_id"=>nil}

  create_table "smilTexts", :force => true do |t|
    t.integer  "video_id"
    t.integer  "status_id",                                                    :default => 50
    t.integer  "text_style_id",                                                :default => 1
    t.integer  "user_id"
    t.string   "user_name"
    t.text     "user_log"
    t.string   "title",         :limit => 512
    t.string   "body",          :limit => 1024
    t.string   "body_history",  :limit => 1024
    t.string   "href",          :limit => 1024
    t.string   "top",           :limit => 25
    t.string   "right",         :limit => 25
    t.string   "bottom",        :limit => 25
    t.string   "left",          :limit => 25
    t.decimal  "begin",                         :precision => 10, :scale => 3
    t.decimal  "end",                           :precision => 10, :scale => 3
    t.integer  "vote",                                                         :default => 0
    t.integer  "vote_count",                                                   :default => 0
    t.integer  "flag_count",                                                   :default => 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "smilTexts", ["video_id", "status_id", "text_style_id"], :name => "index_on_video_and_status_and_style", :limit => {"video_id"=>nil, "text_style_id"=>nil, "status_id"=>nil}

  create_table "users", :force => true do |t|
    t.integer  "partner_id"
    t.integer  "user_type_id",                      :default => 50, :null => false
    t.string   "login"
    t.string   "email"
    t.string   "name"
    t.string   "pic_url"
    t.string   "partner_uid"
    t.integer  "twitter_uid",          :limit => 8
    t.integer  "facebook_uid",         :limit => 8
    t.string   "facebook_session_key"
    t.string   "openid_identifier"
    t.string   "oauth_token"
    t.string   "oauth_secret"
    t.string   "crypted_password"
    t.string   "password_salt"
    t.string   "persistence_token"
    t.integer  "permissions_count",                 :default => 0
    t.integer  "login_count",                       :default => 0,  :null => false
    t.datetime "current_login_at"
    t.datetime "last_login_at"
    t.string   "current_login_ip"
    t.string   "last_login_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["created_at"], :name => "index_users_on_created_at", :limit => {"created_at"=>nil}
  add_index "users", ["email"], :name => "index_users_on_email", :limit => {"email"=>nil}
  add_index "users", ["facebook_uid"], :name => "index_users_on_facebook_uid", :limit => {"facebook_uid"=>nil}
  add_index "users", ["login"], :name => "index_users_on_login", :limit => {"login"=>nil}
  add_index "users", ["name"], :name => "index_users_on_name", :limit => {"name"=>nil}
  add_index "users", ["oauth_token"], :name => "index_users_on_oauth_token", :limit => {"oauth_token"=>nil}
  add_index "users", ["openid_identifier"], :name => "index_users_on_openid_identifier", :limit => {"openid_identifier"=>nil}
  add_index "users", ["partner_uid"], :name => "index_users_on_partner_uid", :limit => {"partner_uid"=>nil}

  create_table "videos", :force => true do |t|
    t.integer  "partner_id"
    t.integer  "media_type_id",                   :default => 1
    t.string   "title",           :limit => 512
    t.string   "uri",             :limit => 1024
    t.string   "src",             :limit => 1024
    t.string   "type"
    t.string   "thumb",           :limit => 1024
    t.string   "description",     :limit => 2048
    t.text     "options"
    t.integer  "areas_count",                     :default => 0
    t.integer  "smilTexts_count",                 :default => 0
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "videos", ["partner_id", "uri"], :name => "index_videos_on_partner_id_and_uri", :limit => {"uri"=>"20", "partner_id"=>nil}

end
