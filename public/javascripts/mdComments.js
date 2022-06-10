if (typeof(mdImgPath) == 'undefined')
{
	var mdImgPath = mdEnv + '/images'
}

var Mobdub = {};
Mobdub.Comments =
{
    options: {},

    loadSettings: function(options)
    {
        if (options)
        {
            this.options = options;
            
            // Set custom text color
            try
            {
	            if(this.getSetting(options['comments_custom_css_text_color'], '') != '')
	            {
	                var text_color = options['comments_custom_css_text_color'];
					Mobdub.Util.insertCssRules([
					  ['#MobdubVideoComments .md-text, #MobdubVideoComments .md-reader-info, #MobdubVideoComments .md-comments-filter', 
					    ['color', text_color, true]
					  ]
					]);		
	            }            	
            } catch (e) {};
            
            // Set custom link color
            try
            {
	            if(this.getSetting(options['comments_custom_css_link_color'], '') != '')
	            {
	                var link_color = options['comments_custom_css_link_color'];
					Mobdub.Util.insertCssRules([
					  ['#MobdubVideoComments .md-text-link, #MobdubVideoComments .md-link-more, #twtCommentBody .md-text-username, #twtCommentBody a, #MobdubVideoComments a.md-text-tab-link:hover, #MobdubVideoComments a.md-text-tab-active, #MobdubVideoComments a.md-text-tab-active:hover, .md-text-link', 
					    ['color', link_color, true]
					  ], 
					  ['#MobdubVideoComments .ui-slider-handle, #MobdubVideoComments .ui-slider-handle a, #MobdubVideoComments .ui-slider-handle a:hover', 
					    [
					      ['border-color', link_color, true],
					      ['color', link_color, true],
					      ['background', 'none repeat scroll 0 0 ' + link_color, true]
					    ]
					  ]
					]);		
	            }            	
            } catch (e) {};
		
            // Override settings when specified via API
            if (md_config.comments_enabled) options['comments_enabled'] = md_config.comments_enabled;
            if (md_config.twitter_enabled) options['twitter_enabled'] = md_config.twitter_enabled;

            // Load custom css if provided - might need to add this to the settings section in case of load/sync
            try
            {
                if (!md_config.custom_css_url)
                {
                    md_config.custom_css_url = this.getSetting(options['comments_custom_css_url'], "");
                    Mobdub.Util.loadScript( this.getSetting(options['comments_custom_css_url'], ""), 'md-custom-css', 'css' );
                }
            }
            catch(e) {}

            this.type = options['comments_type'];
            this.layout = options['comments_layout'];

            // Show/hide comments tab
            if(this.getSetting(options['comments_enabled'], '1') != '0')
            {
                $('#twtc').removeClass('ui-tabs-first');
                $('#mdc').addClass('ui-tabs-first');

                // Switch the tab index if twitter is disabled otherwise don't switch tabs on user as video changes
                if(this.getSetting(options['twitter_enabled'], '1') == '0')
                {
                    this.enableTab({}, {"index":0});
                    $('#mdc').click();
                }

                $('#mdc').show();
            }
            else
            {
                $('#mdc').hide();
                $('#twtc').addClass('ui-tabs-first');   // this removes the | separator
            }

            // Show/hide twitter tab
            if (this.getSetting(options['twitter_enabled'], '1') != '0')
            {
                $('#twtc').show();
                // Enable twitter tab in case comments are disabled and twitter is enabled
                if( (this.getSetting(this.options['comments_enabled'], "1") == "0") )
                {
                    this.enableTab({}, {"index":1});
                    $('#twtc').click();
                }
            }
            else
            {
                $('#twtc').hide();
            }

            // Show/hide writer box
            if(this.getSetting(options['comments_enabled'], "1") == "2")
            {
                this.enableWriterBox(false);
            }

            // Partner settings
            this.loadUrl = options['partner_get_comments_url'];

            // Article Comments settings
            this.settings.comments_page_index = 1;
            this.settings.comments_per_page = this.getSetting(options['comments_per_page'], 15);
            this.custom_css_url = options['comments_custom_css_url'];
            this.ref_id = options['video_id'];

            // Set landing page link
            this.settings.video_link_url = this.getSetting(options['video_link_url'], '');
            this.settings.video_screen_width = this.getSetting(options['video_screen_width'], '');

            // Set FB Link button
            /*var fbIframeUrl = "http://www.facebook.com/plugins/like.php?href=" + this.settings.video_link_url + "&layout=standard&show_faces=false&width=200&action=like&colorscheme=light";
            $('#fbLikeIframe').attr('src', fbIframeUrl);*/

            // Set twitter viewer default text
            this.settings.twitter_reader_default_text = this.getSetting(options['twitter_reader_default_text'], '');

            // Set twitter reply parameters
            this.settings.twitter_user = this.getSetting(options['twitter_user'], '');
            if (this.settings.twitter_user.indexOf('@') != 0 && this.settings.twitter_user != '')
                this.settings.twitter_user = '@' + this.settings.twitter_user;

            var tags = this.getSetting(options['twitter_tags'], '');
            if (tags && tags != '')
            {
                var firstTag = true;
                var hashtagString = '';
                var hashtags = tags.split(' ');
                for (var key in hashtags)
                {
                    hashtags[key] = jQuery.trim(hashtags[key]);

                    if ( hashtags[key].indexOf('#') != 0  )
                    {
                        hashtags[key] = '#' + hashtags[key];
                    }

                    if (firstTag)
                    {
                         hashtagString = hashtagString + hashtags[key];
                         firstTag = false;
                    }
                    else
                    {
                         hashtagString = hashtagString + ' ' + hashtags[key];
                    }
                }

                this.settings.twitter_tags = hashtagString;
            }

            // Search needs the following escape values - unlike the reply to
            if (hashtagString) hashtagString = hashtagString.replace( new RegExp(' ', 'g'), '+');
            if (options['video_title']) options['video_title'] = options['video_title'].replace( new RegExp(' ', 'g'), '+');

            // Search validation and text replacements
            this.settings.twitter_search = this.getSetting(options['twitter_search_url'], '');
            this.settings.twitter_search = this.settings.twitter_search.replace( new RegExp( '%title%', 'g' ),    options['video_title']);
            this.settings.twitter_search = this.settings.twitter_search.replace( new RegExp( '%reply_to%', 'g' ), this.settings.twitter_user.replace('@', ''));
            this.settings.twitter_search = this.settings.twitter_search.replace( new RegExp( '%partner%', 'g' ),  options['partner_name']);
            this.settings.twitter_search = this.settings.twitter_search.replace( new RegExp( '%hashtags%', 'g' ), this.settings.twitter_tags);
			this.settings.twitter_search = this.settings.twitter_search.replace( new RegExp( '%link%', 'g' ), document.location);
            this.settings.twitter_search = this.settings.twitter_search.replace( new RegExp( '#', 'g' ), '%23' );
            this.settings.twitter_search = this.settings.twitter_search + '&rpp=' + this.settings.comments_per_page;

            if ( this.settings.twitter_search_previous != this.settings.twitter_search )
            {
                if (this.mdCurrentTab == 'twitter')
                {
                    this.loadTwtFeed();
                    this.settings.twitter_search_reload = false;
                }
                else
                {
                    this.settings.twitter_search_reload = true;
                }
            }

            this.settings.twitter_search_previous = this.settings.twitter_search;

            // set Terms of Service text
            $('#termOfServceText').html(this.getSetting(options['comments_terms_of_service'], this.settings.comments_terms_of_service));

            //set comments input default text
            var tempflag = $("#commentTextArea")[0].value == this.settings.comments_editor_default_text;
            this.settings.comments_editor_default_text = this.getSetting(options['comments_editor_default_text'], this.settings.comments_editor_default_text);
            if (tempflag)
                $("#commentTextArea")[0].value = this.settings.comments_editor_default_text;

            // set comments box default text
            this.settings.comments_reader_default_text = this.getSetting(options['comments_reader_default_text'], '');

            // set Bit.ly settings
            this.settings.comments_bitlyAPI_key = this.getSetting(options['comments_bitlyAPI_key'], this.settings.comments_bitlyAPI_key);
            this.settings.comments_bitlyAPI_login = this.getSetting(options['comments_bitlyAPI_login'], this.settings.comments_bitlyAPI_login);

            // set comments read settings
            this.settings.comments_reader_read_rate = this.getSetting(options['comments_reader_read_rate'], this.settings.comments_reader_read_rate);
            this.settings.comments_reader_scroll_animation = this.getSetting(options['comments_reader_scroll_animation'], this.settings.comments_reader_scroll_animation);
            this.settings.comments_reader_min_scroll_time = this.getSetting(options['comments_reader_min_scroll_time'], this.settings.comments_reader_min_scroll_time);
			
            // Set SSO settings - Add domain in case links are relative
            try
            {
	            if (!this.options.sso_sign_in_url.indexOf('http://') == 0 && !this.options.sso_sign_in_url.indexOf('https://') == 0)
	            {
	            	this.options.sso_sign_in_url = this.options.partner_url + this.options.sso_sign_in_url;	
	            }
				if (!this.options.sso_sign_up_url.indexOf('http://') == 0 && !this.options.sso_sign_up_url.indexOf('https://') == 0)
	            {
	            	this.options.sso_sign_up_url = this.options.partner_url + this.options.sso_sign_up_url	
	            }
	            if (!this.options.sso_sign_out_url.indexOf('http://') == 0 && !this.options.sso_sign_out_url.indexOf('https://') == 0)
	            {
	            	this.options.sso_sign_out_url = this.options.partner_url + this.options.sso_sign_out_url	
	            }
	            if (!this.options.sso_forgot_password_url.indexOf('http://') == 0 && !this.options.sso_forgot_password_url.indexOf('https://') == 0)
	            {
	            	this.options.sso_forgot_password_url = this.options.partner_url + this.options.sso_forgot_password_url;	
	            }	
            }
            catch (e) {}
                    
            if (this.options.sso_enabled)
            {
                Mobdub.Auth.authenticate();
            }

            // Show/hide entire comments box
            if((this.getSetting(options['comments_enabled'], "1") == "0") && (this.getSetting(options['twitter_enabled'], "1") == "0"))
            {
                $('#MobdubVideoComments').hide();
            }
            else
            {
                $('#MobdubVideoComments').show();
            }
            
            // TODO: Remove after testing
            //Mobdub.Comments.log(this.settings);
        }
    },

    setVideoCommentsUI: function()
    {
        if (md_config.ref_md_type == 'article')
        {
            this.settings.article.css.textComment = 'md-comments-type-text';
            this.settings.article.css.defaultViewerText = 'defaultViewerText-article';
        }

        var twtTab = "<li><a id='twtc' href='#tab-1' class='md-text-link md-text-tab-link' style='display:none;'>Twitter</a></li>";
        var mdTab = "<li><a id='mdc' href='#tab-1' class='ui-tabs-first md-text-link md-text-tab-link md-text-tab-active' style='display:none;'>Comments</a></li>";
        var fbTab = "<li><a id='fbc' href='#tab-1' class='md-text-link md-text-tab-link' style='display:none;'>Facebook</a></li>";
        /*var fbLike = '<iframe id="fbLikeIframe" scrolling="no" frameborder="0" allowTransparency="true" style="border:none; overflow:hidden; width:300px; height:25px; margin-left:26px"></iframe>';*/

        var mdCustomCSS    = "<div id='mdCustomCSS'></div>";

        var writerBoxHtml  = "<div id='vdoCommentMain' class='vdoCommentMain " + this.settings.article.css.textComment + " md-background md-text'>" +
                              "<div id='vdoCommentNew' class='vdoCommentNew md-background'>" +
                              "<form action='' method='get' name='newCommentForm' style='margin-bottom:8px'>" +
                              "<div id='tabs' class='md-background' style='margin-bottom:2px;'>" +
                              "<div id='logintext' class='md-text md-text-login'><a>Sign In</a> or <a>Sign Up</a> for an account.</div>" +
                              "<ul id='md-tabs' style='width:175px'>" + mdTab + twtTab + fbTab + "</ul>" +
                              "<div id='tab-1'>" +
                              "<div id='newCommentDiv' class='ui-corner-re ui-widget-content md-background md-border md-border-inputbox' style='position:relative;background-image:none;margin-top:1px;margin-bottom:1px;border-width:1px;'><div class='md-background-inputbox' style='padding:4px;'>" +   
                              "<div id='submitBox'>" +
                              "  <strong><div id='charCount' class='md-text-charcount' style='display:none'></div></strong>" +
                              "  <div id='btnSubmitComment' " +
                              "    class='btnSubmitComment md-button-submit' " + 
                              "    onclick='Mobdub.Comments.submitComment();' " +
                              "    onmouseup='Mobdub.Comments.submitButtonActive(false);'  " +
                              "    onmousedown='Mobdub.Comments.submitButtonActive(true);' " +
                              "    onmouseover='Mobdub.Comments.submitButtonActive(true);' " +
                              "    onmouseout='Mobdub.Comments.submitButtonActive(false);' >" +
                              "  </div>" +     
                              "</div>" +
                              "  <textarea id='commentTextArea' name='newCommentArea' " +
                              "    class='inputBox md-background md-background-inputbox md-text md-text-inputbox' rows='1' wrap='soft' " +
                              "    onfocus='Mobdub.Comments.inputBoxOnFocus( this );' " +
                              "    onblur='Mobdub.Comments.characterCount(); Mobdub.Comments.inputBoxOnBlur( this );' " +
                              "    onkeyup='Mobdub.Comments.autogrow(this); return Mobdub.Comments.characterCount();'>" + this.settings.comments_editor_default_text + 
                              "  </textarea>" +
                              "</div></div>" +
                              "</div>" +
                              "</div>" +
                              "<div id='mdTxtBottom' class='md-text-tos'>" +
                              "<div id='termOfServceText' class='ui-widget'>" +
                              this.settings.comments_terms_of_service +
                              "</div>" +
                              "</div>" +
                              "</form>" +
                              "</div>";

        var loginBoxHtml = '<div id="loginBox" style="visibility:hidden; z-index:1900">' +
                               '<div class="ui-overlay">' +
                                   '<div id="overlaylayer" style=" z-index:1901; position:absolute; background-color:#E9E9E9; filter:alpha(opacity=0); opacity:0; top:0; left:0; width:100%; height:120%;"></div>' +
                                   '<div id="mdLoginBox" style="width:332px; height:392px; position:absolute; left:153px; top:-320px; z-index:100" class="ui-widget-shadow ui-corner-all"></div>' +
                               '</div>' +
                               '<div id="mdLoginIframeBorder" class="ui-widget ui-widget-content ui-corner-all" style="width:330px; height:390px; position:absolute; left:153px; top:-320px; z-index:1902">' +
                                   '<iframe id="mdLoginFrame" name="mdLoginFrame" width="330" height="390" frameborder="0" marginheight="0" marginwidth="0" scrolling="no"></iframe>' +
                               '</div>' +
                           '</div>';

        var shareBoxHtml = '<div id="shareBox" style="visibility:hidden; z-index:1900">' +
                               '<div class="ui-overlay">' +
                                   '<div id="overlaylayer" style="z-index:1901; position:absolute; background-color:#E9E9E9; filter:alpha(opacity=0); opacity:0; top:0; left:0; width:100%; height:100%;"></div>' +
                                   '<div id="mdShareBox" style="width:332px; height:382px; position:absolute; left:153px; top:-320px; z-index:100" class="ui-widget-shadow ui-corner-all"></div>' +
                               '</div>' +
                               '<div id="mdShareIframeBorder" class="ui-widget ui-widget-content ui-corner-all" style="width:330px; height:380px; position:absolute; left:153px; top:-320px; z-index:1902">' +
                                   '<iframe id="mdShareFrame" name="mdShareFrame" width="330" height="377" frameborder="0" marginheight="0" marginwidth="0" scrolling="no"></iframe>' +
                               '</div>' +
                           '</div>';

        var ajaxIFrame = "<iframe style='width:1px; height:1px; position:absolute; left:-1000px; top:-1000px;' src='" + mdEnv + "/mdPost.html' id='mdPostIframe' name='mdPostIframe' scrolling='no'></iframe>";
                          // TODO: insert partner in the sessions
        var loginFormHtml = '<form id="new_user_session" action="' + mdEnv + '/sessions" id="new_user_session" method="post" name="new_user_session">' +
                            '<input type="hidden" id="login_with_oauth" name="login_with_oauth" value="Sign In with Twitter">' +
                            '</form>';

        // Set up reader box layout
        var readerBoxHTML;
        if (md_config.ref_md_type != 'article')
        {
            readerBoxHTML =   "<div id='vdoCommentSectionMain' onmouseover='Mobdub.Comments.mouseover(true);' onmouseout='Mobdub.Comments.mouseover(false)'  class='vdoCommentSectionMain widget ui-corner-re ui-widget-content ui-widget md-background md-border md-border-reader' style='border-width:1px;background-color:transparent;'>" +
                              "<div id='content-slider' class='ui-corner-rs'></div>" +
                              "<div id='mobdubCommentSection' class='vdoCommentSection md-background' onmouseover='Mobdub.Comments.mouseover(true);' onmouseout='Mobdub.Comments.mouseover(false)'></div>" +
                              "<div id='twtrCommentSection' class='vdoCommentSection md-background' onmouseover='Mobdub.Comments.mouseover(true);' onmouseout='Mobdub.Comments.mouseover(false);'></div>" +
                              "</div>";
        }
        else
        {
            readerBoxHTML ="<div id='vdoCommentSectionMain'  class='vdoCommentSectionMain widget ui-corner-re ui-widget-content ui-widget md-background md-border md-border-reader' style='background-color:transparent;'>" +
                              "<div id='mobdubReaderControls' class='md-text'>" +
                              " <div id='mobdubReaderInfo' class='md-reader-info md-background' style='font-size:1.2em !important;'></div>" +
                              " <div id='mdCommentsFilter' class='md-comments-filter' style='font-size:0.95em !important;'>" +
                                "Sort By " + "<select id='commentsFilterSelect' onchange='Mobdub.Comments.filter_comments(this.value)' style='font-size:0.95em'><option value='descend_by_created_at'>Newest First</option><option value='ascend_by_created_at'>Oldest First</option><option value='descend_by_vote'>Highest Rated</option></select>"  +
                              "</div>" +
                              "</div>" +
                              "<div id='mobdubCommentSection' class='vdoCommentSection md-background'></div>" +
                              "<div id='twtrCommentSection' class='vdoCommentSection md-background'></div>" +
                              "</div>";
        }

		var commentsBoxHtml = mdCustomCSS + writerBoxHtml + readerBoxHTML + loginBoxHtml + shareBoxHtml + ajaxIFrame + loginFormHtml;

        // Hiding the box until settings are applied for a smoother loading experience
        if (md_config.ref_md_type == 'article')
        {
            $("#MobdubVideoComments").html(commentsBoxHtml).hide();
        }
        else
        {
            $("#MobdubVideoComments").html(commentsBoxHtml);
        }

        if (jQuery.browser.msie && document.documentMode < 8) {
            $("#btnSubmitComment").css('margin-top', '1px');
            $("#MobdubVideoComments").css('position','relative');
        }

        this.setupUIControls();
    },

    setupUIControls: function()
    {
    	try
    	{
    		$("#tabs").tabs({ select: Mobdub.Comments.enableTab });	
    	}
    	catch(e){}
        
        // Need this for article comments
        if( (this.getSetting(this.options['comments_enabled'], "1") == "0") && (this.getSetting(this.options['twitter_enabled'], "1") != "0") )
        {
            Mobdub.Comments.enableTab({}, {"index":1});
        }

        if (md_config.comments_layout != 'autogrow')
        {
            $("#content-slider").slider({
                orientation: "vertical",
                animate: true,
                range: false,
                min: 0,
                max: 100,
                value: 100,
                handle: ".ui-slider-handle",
                change: Mobdub.Comments.handleSliderChange,
                slide: Mobdub.Comments.handleSliderSlide
            });
            $(".ui-slider-handle").css('display', 'none');
            $(".ui-slider-handle").css('visibility', 'hidden');
        }

        $("#commentTextArea")[0].value = this.settings.comments_editor_default_text;
    },

    autogrow: function(obj)
    {
        $(obj).css('height', '45px');
        var textareaScrollHeight = eval($(obj).attr('scrollHeight'));
   
        if (textareaScrollHeight > 45)
        {
            $(obj).css('height', ($(obj).attr('scrollHeight')) + 'px');
            $("#submitBox").css('margin-top', ($(obj).attr('scrollHeight') - 45) + 'px');
        }
        else
        {
            $("#submitBox").css('margin-top', '0px');
        }

        this.adjustCommentsBoxHeight();
    },

    adjustCommentsBoxHeight:function ()
    {
        if (md_config.comments_layout != 'autogrow')
        {
            $("#MobdubVideoComments").height($("#vdoCommentMain").height() + 15);
        }
    },

    submitButtonActive: function(isActive)
    {
        if (isActive)
        {
        	if (Mobdub.Comments.inputHasComment())
        	{
        		$('#btnSubmitComment').css('background-image', 'url(' + mdImgPath + '/submitLight.png)');	
        		$('#btnSubmitComment').css('cursor', 'pointer');
        	}            	
        }
        else
        {
            if (!Mobdub.Comments.mdCommentsOverflow)
            {
            	$('#btnSubmitComment').css('background-image', 'url(' + mdImgPath + '/submitDark.png)');	
            	$('#btnSubmitComment').css('cursor', 'default');
            }               
        }
    },

    inputBoxOnFocus: function(obj)
    {
        try
        {
            Mobdub.Comments.stopScrolling();
            Mobdub.Comments.inputBoxClickVideoPos = mdPartnerPlayerPosition();
        } catch (e){}

        if ($("#mdTxtBottom").is(":hidden"))
        {
            $(obj).css('height', '45px');
            $(obj).css('color', '#313131');
            obj.value = "";
            $("#mdTxtBottom").show();
            $(".md-text-tos").height($("#termOfServceText").attr("scrollHeight"));
            Mobdub.Comments.characterCount();
            $("#charCount").show();
        }

        this.adjustCommentsBoxHeight();
    },

    inputBoxOnBlur: function(obj)
    {
        window.setTimeout("Mobdub.Comments.collapseAddComment( true );", 200);
    },

    collapseAddComment: function(checkZeroLength)
    {
        if (( checkZeroLength && jQuery.trim($("#commentTextArea").attr('value')).length == 0 )
                || !checkZeroLength)
        {
            Mobdub.Comments.startScrolling();

            $("#charCount").hide();
            $("#submitBox").css("margin-top", "0px");

            if (jQuery.browser.msie && document.documentMode < 8) {
                $("#btnSubmitComment").css('margin-top', '1px');
            }
            
            $("#mdTxtBottom").hide();
            $("#commentTextArea").css('color', '#999999');
            $("#commentTextArea")[0].value = Mobdub.Comments.settings.comments_editor_default_text;
            $("#commentTextArea").css('height', '16px');

            this.adjustCommentsBoxHeight();
        }
    },

    handleSliderChange: function(e, ui)
    {
        var maxScroll = 0;
        if (Mobdub.Comments.mdCurrentTab == 'mobdub')
        {
            maxScroll = $("#mobdubCommentSection").attr("scrollHeight") - $("#mobdubCommentSection").height();
            if (Mobdub.Comments.animateScrolling)
            {
                $("#mobdubCommentSection").animate({ scrollTop: (100 - ui.value) * (maxScroll / 100) }, Mobdub.Comments.settings.comments_reader_scroll_animation);
            }
            else
            {
                $("#mobdubCommentSection").animate({ scrollTop: (100 - ui.value) * (maxScroll / 100) }, 0);
                Mobdub.Comments.animateScrolling = true;
            }
            $("#content-slider").height($("#mobdubCommentSection").height());
        }
        if (Mobdub.Comments.mdCurrentTab == 'twitter')
        {
            maxScroll = $("#twtrCommentSection").attr("scrollHeight") - $("#twtrCommentSection").height();
            $("#twtrCommentSection").animate({ scrollTop: (100 - ui.value) * (maxScroll / 100) }, 0);
            $("#content-slider").height($("#twtrCommentSection").height());
        }
    },

    handleSliderSlide: function(e, ui)
    {
        var maxScroll = 0;
        if (Mobdub.Comments.mdCurrentTab == 'mobdub')
        {
            maxScroll = $("#mobdubCommentSection").attr("scrollHeight") - $("#mobdubCommentSection").height();
            $("#mobdubCommentSection").scrollTop( (100 - ui.value) * (maxScroll / 100) );
            $("#content-slider").height($("#mobdubCommentSection").height());
        }
        if (Mobdub.Comments.mdCurrentTab == 'twitter')
        {
            maxScroll = $("#twtrCommentSection").attr("scrollHeight") - $("#twtrCommentSection").height();
            $("#twtrCommentSection").scrollTop( (100 - ui.value) * (maxScroll / 100) );
            $("#content-slider").height($("#twtrCommentSection").height());
        }
    },

    enableWriterBox: function (enabled)
    {
        if (!enabled)
        {
            $('#tab-1').hide();
            $('#logintext').hide();
        }
        else
        {
            $('#tab-1').show();
            $('#logintext').show();    
        }
    },

    enableTab: function(e, ui) {
        //Mobdub.Comments.mdVdoComments = [];
        switch (ui.index)
        {
            case 0:
                Mobdub.Comments.mdCurrentTab = 'mobdub';

                // Enable/disable writer box
                if (Mobdub.Comments.options['comments_enabled'] == '2')
                {
                    Mobdub.Comments.enableWriterBox(false);
                }
                else
                {
                    Mobdub.Comments.enableWriterBox(true);
                }

                if (md_config.ref_md_type != 'article')     // TODO: clean up
                {
                    Mobdub.Comments.mdtwtrCommentSlider = $("#content-slider").slider("value");
                }

                $("#mobdubCommentSection").css("display", '');
                $("#twtc").removeClass("md-text-tab-active");
                $("#mdc").addClass("md-text-tab-active");

                if (md_config.ref_md_type != 'article')     // TODO: clean up
                {
                    Mobdub.Comments.animateScrolling = false;
                    $("#content-slider").slider("value", Mobdub.Comments.mdCommentSlider);
                    Mobdub.Comments.animateScrolling = false;
                    if (Mobdub.Comments.mdLastActiveCommentIndex >= 0)
                        Mobdub.Comments.moveSlider(Mobdub.Comments.mdExtractedFeed[Mobdub.Comments.mdLastActiveCommentIndex].commentId, 'mobdubCommentSection');
                    $("#content-slider").height($("#mobdubCommentSection").height());
                }
                else
                {
                    if (Mobdub.Comments.settings.comments_count <= 0)
                    {
                        $('#mobdubReaderControls').hide();
                    }
                    else
                    {
                        $('#mobdubReaderControls').show();
                    }
                }

                $("#twtrCommentSection").css("display", 'none');
                break;
            case 1:
                Mobdub.Comments.mdCurrentTab = 'twitter';

                // Enable/disable writer box
                if (Mobdub.Comments.options['twitter_enabled'] == '2')
                {
                    Mobdub.Comments.enableWriterBox(false);
                }
                else
                {
                    Mobdub.Comments.enableWriterBox(true);
                }

                $("#twtrCommentSection").css("display", '');

                if (md_config.ref_md_type != 'article')     // TODO: clean up
                {
                    Mobdub.Comments.mdCommentSlider = $("#content-slider").slider("value");
                    $("#content-slider").slider("value", Mobdub.Comments.mdtwtrCommentSlider);
                }
                else
                {
                    $('#mobdubReaderControls').hide();
                }

                if (Mobdub.Comments.settings.twitter_search_reload)
                {
                    Mobdub.Comments.loadTwtFeed();
                    Mobdub.Comments.settings.twitter_search_reload = false;
                }

                $("#twtc").addClass("md-text-tab-active");
                $("#mdc").removeClass("md-text-tab-active");

                $("#mobdubCommentSection").css("display", 'none');
                break;
            case 3:
                Mobdub.Comments.mdCurrentTab = 'mobdub';
                Mobdub.Comments.mdVdoComments = Mobdub.Comments.mdExtractedFeed;
                break;
            default:
                break;
        }
        Mobdub.Comments.characterCount();
        Mobdub.Comments.collapseAddComment(true);
    },

    seekPlayer: function(videoPosSec)
    {
        mdPartnerPlayerSeek(videoPosSec);
    },

    createSmilComment: function(commentsText, videoPos, comGUID, guestInfo)
    {	
        var ref_id = Mobdub.Comments.ref_id;
        var args = {
            "smilText[text_style_id]":"3",
            "smilText[body]":commentsText
        };
        
        // Guest comment info
        if (guestInfo) 
        {
        	args["user[name]"] 	= guestInfo.screen_name;
        	args["user[email]"]	= guestInfo.email;
        }
        
        // If video timestamp passed in
        if (videoPos && videoPos >= 0) 
        {
        	args["smilText[begin]"]	= videoPos;
        	args["smilText[end]"] 	= videoPos + 4;
        }
        
        Mobdub.Util.mdPost(mdEnv + "/refs/" + ref_id + "/smilTexts.json", args, function(jsonItem) {
                onMobdubSmilSave(jsonItem, comGUID);
            });
    },

    characterCount: function()
    {
        var totalCharacter = $("#commentTextArea").attr('value').length;
        var maxCharacter = 140;
        if (Mobdub.Comments.mdCurrentTab == 'mobdub')
            maxCharacter = 900;
        if (Mobdub.Comments.mdCurrentTab == 'twitter')
            maxCharacter = 100;

        $("#charCount").removeClass("md-text-charcount-overlimit");
        $('#btnSubmitComment').css('background-image', 'url(' + mdImgPath + '/submitDark.png)');
        Mobdub.Comments.mdCommentsOverflow = false;

        if (totalCharacter > maxCharacter)
        {
            $("#charCount").addClass("md-text-charcount-overlimit");
            $('#btnSubmitComment').css('background-image', 'url(' + mdImgPath + '/submitLight.png)');
            Mobdub.Comments.mdCommentsOverflow = true;
        }

        if (!$("#mdTxtBottom").is(":hidden")) {
            $("#charCount").html(maxCharacter - totalCharacter);
        }

        $("#commentTextArea").scrollTop($("#commentTextArea").attr('scrollHeight') - $("#commentTextArea").height());
    },

    getIndex: function(key)
    {
        var left = 0;
        var commentLength = Mobdub.Comments.mdExtractedFeed.length;
        var right = commentLength - 1;
        var mid = parseInt((left + right + 1 ) / 2);
        while (left <= right)
        {
            mid = parseInt((left + right + 1 ) / 2);
            if (Mobdub.Comments.mdExtractedFeed[mid].timeStamp == key)
            {
                break;
            }
            else if (Mobdub.Comments.mdExtractedFeed[mid].timeStamp < key)
                left = mid + 1;
            else
                right = mid - 1;
        }
        if (commentLength > 0)
        {
            if (Mobdub.Comments.mdExtractedFeed[mid].timeStamp < key)
            {
                while (++mid < Mobdub.Comments.mdExtractedFeed.length && Mobdub.Comments.mdExtractedFeed[mid].timeStamp < key);
            }
            if (Mobdub.Comments.mdExtractedFeed[mid] != null && Mobdub.Comments.mdExtractedFeed[mid].timeStamp >= key)
            {
                while (--mid >= 0 && Mobdub.Comments.mdExtractedFeed[mid].timeStamp >= key);
                mid++;
            }
        }
        return mid;
    },

    generateGUID: function()
    {
        var chars = '0123456789abcdef'.split('');
        var uuid = [], rnd = Math.random, r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4'; // version 4

        for (var i = 0; i < 36; i++)
        {
            if (!uuid[i])
            {
                r = 0 | rnd() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
            }
        }
        return uuid.join('');
    },

	inputHasComment: function()
	{
    	var inputBox = document.getElementById("commentTextArea");
	    if ((jQuery.trim(inputBox.value) == "") || (jQuery.trim(inputBox.value) == jQuery.trim(Mobdub.Comments.settings.comments_editor_default_text)) )
	    {
	    	return false;
	    } 	
	    else
	    {
	    	return true;
	    }
	},
	
    submitComment: function(guest)
    {	
    	// Exit if no comment has been entered
	    if ( !(Mobdub.Comments.inputHasComment()) ) { return; } 
	         
    	var authUser = Mobdub.Auth.getAuthenticatedUser();

        if (authUser || guest)
        {
	    	// If button was clicked then expand the input field - TODO: Rewrite - since the condition is if the default text is the same at the time of click.
	        var tarea = document.getElementById("commentTextArea");
	        if (jQuery.trim(tarea.value) == jQuery.trim(Mobdub.Comments.settings.comments_editor_default_text))
	        {
	            Mobdub.Comments.inputBoxOnFocus(tarea);
	            return;
	        }

	        if (Mobdub.Comments.mdCommentsOverflow) return;

	        var text = document.newCommentForm.newCommentArea.value;

	        if (text && jQuery.trim(text) !== "")
	        {
	            var selected = $('#tabs').tabs().data('selected.tabs');
		        var videoPos = Mobdub.Comments.inputBoxClickVideoPos;

	            if (Mobdub.Comments.mdCurrentTab == 'mobdub')          // Mobdub tab
	            {
	                var comGUID = Mobdub.Comments.postComment(text, videoPos, guest);
	                //var writeTxt = text.replace(/\\/g, "&#92;").replace(/"/g, '\"');
	                var writeTxt = text.replace(/\\/g, "\\\\").replace(/"/g, '\"');
	                Mobdub.Comments.createSmilComment(writeTxt, videoPos, comGUID, guest);
	                $("#commentDefaultText").css("visibility", "hidden");
	                Mobdub.Comments.newCommentActive = true;
	            }
	            else if (Mobdub.Comments.mdCurrentTab == 'twitter')     // Twitter tab
	            {
	                var authUser = Mobdub.Auth.getAuthenticatedUser();

	                if (!authUser.pic_url || authUser.pic_url == "")
	                {
	                    Mobdub.Comments.popOIDLoginBox('twitter');
	                }
	                else
	                {
	                    Mobdub.Comments.postComment(text, videoPos);
	                    Mobdub.Comments.mdTwtCurrComment = text;
	                    //Mobdub.Comments.postTwtComment( text );
                        if (md_config.ref_md_type == 'article')
                        {
                            Mobdub.Util.shortenURL(escape(document.location), 'Mobdub.Comments.postTwtTAComment');
                        }
                        else
                        {
                            var landingPageUrl = Mobdub.Util.getLandingPageUrl() + "&mdStartTime=" + videoPos;
	                        Mobdub.Util.shortenURL(escape(landingPageUrl), 'Mobdub.Comments.postTwtTAComment');
                        }
	                }
	            }
	        }
	        else
	        {
	            //alert("Please provide a valid comment.");
	        }
    	}
        else
        {
        	//obj.blur();
            Mobdub.Auth.authenticate();

            if (Mobdub.Comments.mdCurrentTab == 'twitter')  // Pop Twitter login box
            {
                Mobdub.Comments.popOIDLoginBox('twitter');
            }
            else if (Mobdub.Comments.options.guest_allowed) // Pop Twitter login box
            {
                Mobdub.Auth.showLoginBox(true, "guest");    // Pop MD login box in guest mode
            }
            else
            {
                Mobdub.Auth.showLoginBox(true, "existing");	// Pop MD login box in sign in mode
            }
        }
    },
	
    postComment: function(text, commentTimeStamp, guest)
    {
        var comId = Mobdub.Comments.generateGUID(); // parseInt( Math.random() * 1000 ) + 5000;
        var videoPos = commentTimeStamp;
        var authUser = Mobdub.Auth.getAuthenticatedUser();
        var picUrl = "";
        var userName = "Guest";
        
        if (guest)	// Guest has already set up and is posting
        {
        	userName = guest.screen_name;	
        }
        else if (!authUser && Mobdub.Comments.mdCurrentTab == 'twitter')     // Pop Twitter login box
        {
            window.frames.mdLoginFrame.mdSignInOID('twitter');
        }
        else if (!authUser && Mobdub.Comments.options.guest_allowed)	// If the comment wasn't submitted already as guest
        {
            Mobdub.Auth.showLoginBox(true, "guest");        // Pop MD login box in guest mode
        }
        else if (!authUser)
        {
            Mobdub.Auth.showLoginBox(true, "existing");		// Pop MD login box in sign in mode
        }
        else
        {
            picUrl = authUser.pic_url;
            userName = authUser.screen_name;
            if (authUser.pic_url && authUser.pic_url != "" && Mobdub.Comments.mdCurrentTab == 'twitter')
            {
                userName = authUser.twitter_screen_name.replace("@", "");
            }
        }

        $(".ui-slider-handle").css('display', '');
        $(".ui-slider-handle").css('visibility', 'visible');
        Mobdub.Comments.collapseAddComment(false);
        Mobdub.Comments.mdFilteredComments = [];

        if (Mobdub.Comments.addNewCom == true)
        {
            Mobdub.Comments.addNewCom = false;
            var newComment = new Mobdub.Comments.MDVideoComment(comId,
                    userName, 		// UserId
                    (new Date((new Date()) - ( new Date()).getTimezoneOffset() * -60000).toString() ), //  Local to UTC
                    "0", 			// rating
                    text, 			// body text
                    videoPos, 		// video begin time
                    videoPos + 4, 	// video end time
                    picUrl);  		// avatar

            if (Mobdub.Comments.mdCurrentTab == 'mobdub')
            {
                // Clear default viewer text msg
                $('#commentsDefaultText').html('');

                var positionOfNewComment = 0;
                positionOfNewComment = Mobdub.Comments.getIndex(newComment.timeStamp);
                Mobdub.Comments.mdExtractedFeed.splice(positionOfNewComment, 0, newComment);
                //Mobdub.Comments.mdExtractedFeed = Mobdub.Comments.mdVdoComments ;
                if (positionOfNewComment > 0)
                {
                    $("#" + Mobdub.Comments.mdExtractedFeed[positionOfNewComment - 1].commentId).after(newComment.getCommentUI(false));
                }
                else
                {
                    $("#mobdubCommentSection").prepend(newComment.getCommentUI(false));
                }
                var scrollDurationEnd = newComment.timeStamp + (newComment.text.length * Mobdub.Comments.settings.comments_reader_read_rate) / 1000;
                Mobdub.Comments.mdScrollFlag = false;
                Mobdub.Comments.setActiveComment(newComment.commentId, true);
                Mobdub.Comments.mdLastActiveCommentIndex = positionOfNewComment;
                Mobdub.Comments.mdLastVideoPosition = videoPos;

                //if( jQuery.browser.msie ) $("#commentSection").height(372);
                Mobdub.Comments.setDimension();

                if ($("#mobdubCommentSection").attr("scrollHeight") == $("#mobdubCommentSection").height())
                {
                    $(".ui-slider-handle").css('display', 'none');
                    $(".ui-slider-handle").css('visibility', 'hidden');
                }

                // Calculate the time to highlight this comment
                var highlightTime = (scrollDurationEnd - videoPos) * 1000 < Mobdub.Comments.settings.comments_reader_min_scroll_time ? Mobdub.Comments.settings.comments_reader_min_scroll_time : (scrollDurationEnd - videoPos ) * 1000;

                // Setting a minimum of 4 secs for reading own's own comment
                if (highlightTime < 5000) highlightTime = 5000;
                //window.setTimeout("Mobdub.Comments.enableScrollFlag('" + newComment.commentId + "' , true);", highlightTime);
            }
            else
            {
                if (Mobdub.Comments.mdCurrentTab == 'twitter')
                {
                    Mobdub.Comments.mdTwtTimeLineFeeds.splice(0, 0, newComment);
                    Mobdub.Comments.sortCommentsArray(Mobdub.Comments.mdCurrentSort, Mobdub.Comments.mdTwtTimeLineFeeds);
                }
                if (Mobdub.Comments.mdCurrentTab == 'facebook')
                    Mobdub.Comments.mdFBCommentsFeed = Mobdub.Comments.mdVdoComments;

                Mobdub.Comments.generateTwitterUI(Mobdub.Comments.mdTwtTimeLineFeeds, true);
                if (md_config.ref_md_type != 'article')
                {
                    Mobdub.Comments.moveSlider(newComment.commentId, 'twtrCommentSection');
                }
            }
            Mobdub.Comments.addNewCom = true;
        }
        return comId;
    },

    twtFeedCallback: function(data)
    {
        // TODO: Stop loader icon
        Mobdub.Comments.settings.twitter_search_next_page = data.next_page;
        var results = data.results;

        if (results && Mobdub.Util.isArray(results) && results.length > 0)
        {
            var twtFeed = null;
            var mdFeed = null;
            var newTwitterCommentUI = "";
            var lastId = "";
            var firstId;
            firstId = results[0].id;

            for (var i = 0; i < results.length; i++)
            {
                twtFeed = results[i];
                mdFeed = new Mobdub.Comments.MDVideoComment();
                mdFeed.extractTwtFeedInfo(twtFeed);
                Mobdub.Comments.mdTwtTimeLineFeeds.push(mdFeed);
                lastId = results[i].id;
                newTwitterCommentUI += mdFeed.getTwitterCommentUI(false);
            }

            if (Mobdub.Comments.mdCurrentTab == 'twitter')
            {
                if (eval(data.page) > 1)
                {
                    $("#" + Mobdub.Comments.mdtwtrLastFeedId).after(newTwitterCommentUI);
                    // TODO: encapsulate
                    $('#twtCommentMore').html('Show More Tweets');
                    if (md_config.comments_layout != 'autogrow')
                    {
                        Mobdub.Comments.moveSlider(firstId, 'twtrCommentSection');
                    }
                }
                else
                {
                    Mobdub.Comments.mdVdoComments = Mobdub.Comments.mdTwtTimeLineFeeds;
                    Mobdub.Comments.characterCount();
                    Mobdub.Comments.sort(Mobdub.Comments.mdTwtTimeLineFeeds, "TA");
                    Mobdub.Comments.generateTwitterUI(Mobdub.Comments.mdTwtTimeLineFeeds, false);
                }
            }
            Mobdub.Comments.mdtwtrFirstFeedId = firstId;
            Mobdub.Comments.mdtwtrLastFeedId = lastId;
        }
        else    // Empty results
        {
            Mobdub.Comments.mdTwtTimeLineFeeds = [];
            Mobdub.Comments.generateTwitterUI(Mobdub.Comments.mdTwtTimeLineFeeds, false);
        }
    },

    loadTwtFeed: function()
    {
        $('#twtrCommentSection').html('<div id="loadingMsgData" style="text-align:center"><img src="' + mdImgPath + '/md-loader-big.gif"/></div>');
        try
        {
             setTimeout('$("#loadingMsgData").html("")', 30000);  // Remove the spinner after a certain time - 30 secs
        }
        catch (e) { }
        Mobdub.Comments.mdTwtTimeLineFeeds = [];
        Mobdub.Util.loadScript(Mobdub.Comments.settings.twitter_search + "&callback=Mobdub.Comments.twtFeedCallback", "mdTwtFeed", "javascript");
    },

    loadTwtFeedMore: function()
    {
        $('#twtCommentMore').html('<div id="loadingMsgMore"><img src="' + mdImgPath + '/md-loader-small.gif"/></div>');
        try
        {
             setTimeout('$("#loadingMsgMore").html("")', 30000);  // Remove the spinner after a certain time - 30 secs
        }
        catch (e) { }
        if (Mobdub.Comments.settings.twitter_search_next_page)
            Mobdub.Util.loadScript("http://search.twitter.com/search.json" + Mobdub.Comments.settings.twitter_search_next_page + "&callback=Mobdub.Comments.twtFeedCallback", "mdTwtFeed", "javascript");
    },

    postTwtTAComment: function(bitlyData)
    {
        var text = Mobdub.Comments.mdTwtCurrComment;
        Mobdub.Comments.mdTwtCurrComment = "";
        var first_result;
        // Results are keyed by longUrl, so we need to grab the first one.
        for (var r in bitlyData.results)
        {
            first_result = bitlyData.results[r];
            break;
        }

        if (text && jQuery.trim(text) !== "")
        {
            if (text.length <= 100)
            {
                // Fit text to a total of 140 chars taking into account the meta data, link -> appended content to the tweet.
                var maxTweetLength = 140 - (Mobdub.Comments.settings.twitter_user.length + Mobdub.Comments.settings.twitter_tags.length + first_result["shortUrl"].length);
                if (text.length > (maxTweetLength - 3)) // taking spaces in account
                {
                    text = text.substring(0, (maxTweetLength - 6)) + '...';
                }

                var tweet = Mobdub.Comments.settings.twitter_user + " " + text + " " + Mobdub.Comments.settings.twitter_tags + " " + first_result["shortUrl"];
                var twtStatusUpdateText = encodeURIComponent(tweet);
                Mobdub.Util.mdPost(mdEnv + "/users/current/update_status?service=twitter&status=" + twtStatusUpdateText, {},
                        window.parent.Mobdub.Comments.onPostTwtComment);
            }
        }
        else
        {
            //alert("Please provide a valid status update.");
        }
    },

    onPostTwtComment: function()
    {
        //alert("posted twitter comment");
    },

    popOIDLoginBox: function(serviceName)
    {
        // For now it's only twitter
        window.open("", "oidWin", "width=770,height=394,left=150,top=100,scrollbar=no,resize=no");
        document.new_user_session.target = "oidWin";
        document.new_user_session.submit();
    },

    generateTwitterUI: function(cmtArr, escapeText)
    {
        var commentsUI = '';
        // Clear appended text
        $("#twtCommentMore").remove();
        $("#twtrCommentSection").html('');
        for (var j = 0; j < cmtArr.length; j++)
        {
            commentsUI = commentsUI + cmtArr[j].getTwitterCommentUI(escapeText);
        }

        if (Mobdub.Comments.settings.twitter_search_next_page)
        {
            commentsUI = commentsUI + "<div id='twtCommentMore' class='md-link-more' onclick='Mobdub.Comments.loadTwtFeedMore();'>Show More Tweets</div>";
        }

        // Set default text
        if (commentsUI == '')
            commentsUI = "<div id='twitterDefaultText' class='defaultViewerText " + Mobdub.Comments.settings.article.css.defaultViewerText + "'>" + Mobdub.Comments.settings.twitter_reader_default_text + "</div>";

        $("#twtrCommentSection").html(commentsUI);

        if (md_config.comments_layout != 'autogrow')
        {
            $("#content-slider").slider("value", 100);

            Mobdub.Comments.setDimension();

            if ($("#twtrCommentSection").attr("scrollHeight") == $("#twtrCommentSection").height())
            {
                $(".ui-slider-handle").css('display', 'none');
                $(".ui-slider-handle").css('visibility', 'hidden');
            }
            else
            {
                $(".ui-slider-handle").css('display', '');
                $(".ui-slider-handle").css('visibility', 'visible');
            }
        }
    },

    generateMobdubCommentsUI: function(cmtArr)
    {
        var commentsUI = '';
        $("#mobdubCommentSection").html('');
        for (var j = 0; j < cmtArr.length; j++)
        {
            commentsUI = commentsUI + cmtArr[j].getCommentUI();
        }

        // Set default text
        if (commentsUI == '')
            commentsUI = "<div id='commentsDefaultText' class='defaultViewerText " + Mobdub.Comments.settings.article.css.defaultViewerText + "'>" + Mobdub.Comments.settings.comments_reader_default_text + "</div>";

        $("#mobdubCommentSection").html(commentsUI);
				$("#content-slider").slider("value", 100);

        if (Mobdub.Comments.mdLastActiveCommentIndex >= 0)
        {
            Mobdub.Comments.moveSlider(Mobdub.Comments.mdExtractedFeed[ Mobdub.Comments.mdLastActiveCommentIndex ].commentId, 'mobdubCommentSection');
        }

        Mobdub.Comments.setDimension();
    },

    generateMobdubTextCommentsUI: function(cmtArr)
    {
        var commentsUI = '';
        for (var j = 0; j < cmtArr.length; j++)
        {
            commentsUI = commentsUI + cmtArr[j].getCommentUI();
        }

        // Clear appended text
        $("#textCommentMore").remove();
        $("#commentsDefaultText").remove();
        $("#loadingMsg").remove();

        // Set default text
        if (commentsUI == '' && Mobdub.Comments.settings.comments_page_index == 1)
        {
            commentsUI = "<div id='commentsDefaultText' class='defaultViewerText " + Mobdub.Comments.settings.article.css.defaultViewerText + "'>" + Mobdub.Comments.settings.comments_reader_default_text + "</div>";
        }
        else
        {
            if (Mobdub.Comments.page_type == 'paging')
            {
                commentsUI = commentsUI + "<div id='textCommentMore' class='md-text md-link md-link-more' >" +
                                    "<a href='javascript: Mobdub.Comments.loadTextCommentsMore(0);'>1</a> <a href='javascript: Mobdub.Comments.loadTextCommentsMore(1);'>2</a> <a href='javascript: Mobdub.Comments.loadTextCommentsMore(3);'>3</a></div>";
            }
            else
            {
                if (!(Mobdub.Comments.settings.comments_current_count >= Mobdub.Comments.settings.comments_count))
                {
                    commentsUI = commentsUI + "<div id='textCommentMore' class='md-link-more' onclick='Mobdub.Comments.loadTextCommentsMore();' >" +
                                            "Show More Comments</div>";
                }
            }

        }

        if (Mobdub.Comments.page_type == 'paging' || Mobdub.Comments.reload == 'clean')
        {
            $("#mobdubCommentSection").html(commentsUI);
        }
        else
        {
            $("#mobdubCommentSection").append(commentsUI);
        }
    },

    sortByOptions: function()
    {
        this.DA = 'DA';
        this.DD = 'DD';
        this.TA = 'TA';
        this.TD = 'TD';
    },

    sort: function(arr, type)
    {
        for (var i = 0; i < arr.length; i++)
        {
            for (var j = i; j < arr.length; j++)
            {
                if (arr[i].compare(arr[j], type) > 0)
                {
                    var temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
    },

    sortCommentsArray: function(type, cmtArray)
    {
        if (Mobdub.Comments.mdFilteredComments.length > 0)
        {
            Mobdub.Comments.sort(Mobdub.Comments.mdFilteredComments, type);
        }
        else
        {
            Mobdub.Comments.sort(cmtArray, type);
        }
    },

    mouseover: function(flag)
    {
        Mobdub.Comments.mdIsMouseover = flag;
    },

    setActiveComment: function(commentId, highlightIt)
    {
        if (Mobdub.Comments.mdExtractedFeed.length > 0)
        {
            var mdVdoComment = $("#" + commentId);
            if (mdVdoComment.length > 0)
            {
                if (highlightIt)
                {
                    if (md_config.comments_layout != 'autogrow')
                    {
                        if (Mobdub.Comments.mdIsMouseover === false)
                        {
                            Mobdub.Comments.moveSlider(commentId, 'mobdubCommentSection');
                        }
                    }

                    mdVdoComment.removeClass("ui-widget-content");
                    mdVdoComment.addClass("vdoCommentHighLight");
                }
                else
                {
                    mdVdoComment.removeClass("vdoCommentHighLight");
                    mdVdoComment.addClass("ui-widget-content");
                }
            }
        }
    },

    moveSlider: function(currentDivId, commentDiv) {
        var mdCommentSection = $("#" + commentDiv);
        var mdCommentSectionHeight = mdCommentSection.height();
        mdCommentSection = mdCommentSection[0];
        var currentDiv = $("#" + currentDivId)[0];
        var currentDivTop = currentDiv.offsetTop - mdCommentSection.offsetTop;
        var sliderValue = (100 - (((currentDivTop / (mdCommentSection.scrollHeight - mdCommentSectionHeight)) * 100)));
        if (commentDiv == 'mobdubCommentSection')
        {
            Mobdub.Comments.mdCommentSlider = sliderValue;
            if (Mobdub.Comments.mdCurrentTab == 'mobdub')
                $("#content-slider").slider("value", Mobdub.Comments.mdCommentSlider);
        }
        if (commentDiv == 'twtrCommentSection')
        {
            Mobdub.Comments.mdtwtrCommentSlider = sliderValue;
            if (Mobdub.Comments.mdCurrentTab == 'twitter')
                $("#content-slider").slider("value", Mobdub.Comments.mdtwtrCommentSlider);
        }
    },

    sanitizeText: function(text)
    {
        text = $('<div/>').text(text).html();
        
        return text;
    },

	// Inserts the <wbr> equivalent tag '&#8203;' between string to avoid pushing content out
	// 	due to variable width
	handleWordBreak: function(text, type)
    {
    	var breakLength = 29;
    	var modifiedText = '';
        var textArr = text.split(' ');
            
        for(var i in textArr)
		{
			// If the word lenght is more than breakLength 
		    if (textArr[i].length >= breakLength)
	    	{
	    		// And it is not a link
	    		if ( (!(textArr[i].indexOf('http://') >= 0) && !(textArr[i].indexOf('https://') >= 0) ) || type == 'link')
	    		{
	    			textArr[i] = textArr[i].replace(/(\S{29})/g,"$1&#8203;");	
	    		}    		
	    	}
	    	modifiedText = modifiedText + textArr[i] + ' ';
		}
        return modifiedText;
    },
    
    formatHTMLLink: function(url, linkText)
    {
        return '<a href="' + url + '" class="md-text-link md-text-link-incomment" target="_blank">' + Mobdub.Comments.handleWordBreak(linkText, 'link') + '</a>';
    },

    formatURL: function(text)
    {
        return text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/g, function(url) {
            return Mobdub.Comments.formatHTMLLink(url, url);
        });
    },

    formatTwtUsername: function(text)
    {
        return text.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
            var username = u.replace("@", "");
            return Mobdub.Comments.formatHTMLLink("http://twitter.com/" + username, "@" + username);
        });
    },

    formatTwtHashtag: function(text)
    {
        return text.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
            var tag = t.replace("#", "%23");
            return Mobdub.Comments.formatHTMLLink("http://search.twitter.com/search?q=" + tag, t);
        });
    },

    thumbClicked: function(commentId, isItUp)
    {
        if ($("#thumbsdown" + commentId).attr("src").indexOf("gray") >= 0) return;
        var rating = eval($("#rating" + commentId).html());
        var action = "";
        var ratingClass = "";

        if (isItUp)
        {
            rating++;
            action = 'up';
        }
        else
        {
            rating--;
            action = 'down';
        }

        var thdown = $("#thumbsdown" + commentId);
        var thup = $("#thumbsup" + commentId);
        thdown.attr("src", mdImgPath + "/thumbs_down_gray.gif");
        thup.attr("src", mdImgPath + "/thumbs_up_gray.gif");
        thup.css("cursor", "");
        thdown.css("cursor", "");
        thup.attr("onClick", "");
        thdown.attr("onClick", "");
        $("#rating" + commentId).html(rating <= 0 ? rating : "+" + rating);
        // Color CSS for rating
        ratingClass = rating <= 0 ? "md-text-rating-negative" : "md-text-rating-positive";
        if (rating == 0) ratingClass = "md-text-rating-zero";     
        $("#rating" + commentId).attr('class', ratingClass);
        Mobdub.Comments.mdCommentsVoted += "id=" + commentId + ",";
        Mobdub.Comments.setCommentRating(commentId, rating);
        Mobdub.Util.setCookie("mobdub_comments_vote", Mobdub.Comments.mdCommentsVoted);

        //if( jQuery.browser.msie ) $("#commentSection").height(372);
        Mobdub.Comments.setDimension();

        Mobdub.Comments.updateComment({"property": "vote", "action": action, "id": commentId});
    },

    setCommentRating:function(commentId, ratingValue)
    {
        for (loop = 0,maxloop = Mobdub.Comments.mdExtractedFeed.length; loop < maxloop; loop++)
        {
            if (Mobdub.Comments.mdExtractedFeed[loop].commentId == commentId)
            {
                Mobdub.Comments.mdExtractedFeed[loop].rating = ratingValue;
                break;
            }
        }
    },

    flagComment: function(commentId)
    {
        var flagSpan = $("#flag" + commentId);
        flagSpan.removeAttr("onclick");
        flagSpan.removeAttr("href");
        flagSpan.addClass("md-text-link-disabled");
        flagSpan.removeClass("md-text-link");
        Mobdub.Comments.mdCommentsFlaged += "id=" + commentId + ",";
        Mobdub.Util.setCookie("mobdub_comments_flag", Mobdub.Comments.mdCommentsFlaged);

        //if( jQuery.browser.msie ) $("#commentSection").height(372);
        Mobdub.Comments.setDimension();

        Mobdub.Comments.updateComment({"property": "flag", "id": commentId});
    },

    updateComment: function(comment)
    {
        switch (comment.property)
        {
            case "vote":
                Mobdub.Util.mdPost(mdEnv + "/videos/" + mdPluginObj.videoId + "/smilTexts/" + comment.id + "/vote?type=" + comment.action, {}, window.parent.Mobdub.Comments.onVoteSave);
                break;

            case "flag":
                Mobdub.Util.mdPost(mdEnv + "/videos/" + mdPluginObj.videoId + "/smilTexts/" + comment.id + "/flag", {}, window.parent.Mobdub.Comments.onFlagSave);
                break;

            default:
            //nothing
        }
    },

    onFlagSave: function(responseText)
    {
        //flag posted - response
    },

    onVoteSave: function(responseText)
    {
        //vote posted - response
    },

    loadComments: function(videoObject)
    {
        Mobdub.Comments.loadCookies();
        var smilObjects = videoObject.smilModels;
        var cmtArr = new Array();

        for (var i = 0; i < smilObjects.length; i++)
        {
            if (smilObjects[i].textStyle == 3)
            {
                var smilObject = smilObjects[i];
                var userName = smilObject.user.name == "" ? "Guest" : jQuery.trim(smilObject.user.name);

                var vdoComment = new Mobdub.Comments.MDVideoComment(
                        smilObject.id,
                        userName,
                        Mobdub.Util.convertToJSDate(smilObject.createdAt),
                        smilObject.review.vote,
                        smilObject.body,
                        smilObject.begin,
                        smilObject.end,
                        null);
                cmtArr[ cmtArr.length ] = vdoComment;
            }
        }

        Mobdub.Comments.mdExtractedFeed = cmtArr;
        Mobdub.Comments.mdLastActiveCommentIndex = -1;
        Mobdub.Comments.generateMobdubCommentsUI(Mobdub.Comments.mdExtractedFeed);
        Mobdub.Comments.startScrolling(); //resumes comments scrolling

        if (!Mobdub.Comments.mdScrollCommentFlag)
        {
            Mobdub.Comments.enableScrollFlag();
            Mobdub.Comments.mdScrollCommentFlag = true;
        }
    },

    loadTextComments: function(refObject)
    {
        Mobdub.Comments.loadCookies();
        var smilObjects = refObject.items;
        Mobdub.Comments.settings.comments_count = refObject.count;

        // Reset count if its a sort
        if (Mobdub.Comments.reload == 'clean')
        {
            Mobdub.Comments.settings.comments_current_count = 0;
        }
        // Set the comment counts
        Mobdub.Comments.settings.comments_current_count = Mobdub.Comments.settings.comments_current_count + parseInt(Mobdub.Comments.settings.comments_per_page);

        // show/Hide reader controls
        if (Mobdub.Comments.settings.comments_count <= 0)
        {
            $('#mobdubReaderControls').hide();
        }
        else
        {
            $('#mobdubReaderControls').show();
            $('#commentsDefaultText').hide();
        }

        //
        if (Mobdub.Comments.settings.comments_current_count >= Mobdub.Comments.settings.comments_count)
        {
            Mobdub.Comments.settings.comments_current_count = Mobdub.Comments.settings.comments_count;

            if (Mobdub.Comments.settings.comments_current_count == 1)
            {
                $('#mobdubReaderInfo').html('Showing ' + Mobdub.Comments.settings.comments_count + ' comment');
            }
            else
            {
                $('#mobdubReaderInfo').html('Showing ' + Mobdub.Comments.settings.comments_count + ' comments');
            }

        }
        else
        {
            $('#mobdubReaderInfo').html('Showing ' + Mobdub.Comments.settings.comments_current_count + ' of ' + Mobdub.Comments.settings.comments_count + ' comments');
        }

        var cmtArr = new Array();
        for (var i = 0; i < smilObjects.length; i++)
        {
        	// Create new keys with current names to maintain backward compatibility
	        smilObjects[i].textStyle 	= smilObjects[i].text_style_id;
	        smilObjects[i].createdAt 	= smilObjects[i].created_at;
	        smilObjects[i].user 		= { 'name':smilObjects[i].user_name };
	        smilObjects[i].review 		= { 'vote':smilObjects[i].vote };

            if (smilObjects[i].textStyle == 3)
            {
                var smilObject = smilObjects[i];
                var userName = (smilObject.user.name == "" || smilObject.user.name == null) ? "Guest" : jQuery.trim(smilObject.user.name);

                var vdoComment = new Mobdub.Comments.MDVideoComment(
                        smilObject.id,
                        userName,
                        Mobdub.Util.normalizeDate(smilObject.createdAt),
                        smilObject.review.vote,
                        smilObject.body,
                        smilObject.begin,
                        smilObject.end,
                        null);
                cmtArr[ cmtArr.length ] = vdoComment;
            }
        }

        Mobdub.Comments.mdExtractedFeed = cmtArr;
        Mobdub.Comments.mdLastActiveCommentIndex = -1;
        Mobdub.Comments.generateMobdubTextCommentsUI(Mobdub.Comments.mdExtractedFeed);
    },
    loadTextCommentsMore: function(index)
    {
        $('#textCommentMore').html('<div id="loadingMsgMore"><img src="' + mdImgPath + '/md-loader-small.gif"/></div>');
        try
        {
             setTimeout('$("#loadingMsgMore").html("")', 30000);  // Remove the spinner after a certain time - 30 secs
        }
        catch (e) { }

        if (index)
        {
            Mobdub.Comments.settings.comments_page_index = index;
        }
        Mobdub.Comments.settings.comments_page_index++;
        Mobdub.Comments.reload = 'grow';  //TODO: clean up
        Mobdub.Util.loadScript(Mobdub.Comments.loadUrl + '&callback=Mobdub.Comments.loadTextComments&page=' + Mobdub.Comments.settings.comments_page_index + '&search[order]=' + $('#commentsFilterSelect').attr('value'), 'md-plugin', 'javascript');
    },
    filter_comments: function(sortOrder)
    {
        $('#textCommentMore').html('<div id="loadingMsgMore"><img src="' + mdImgPath + '/md-loader-small.gif"/></div>');
        try
        {
             setTimeout('$("#loadingMsgMore").html("")', 30000);  // Remove the spinner after a certain time - 30 secs
        }
        catch (e) { }

        // Reset counters if its a sort
        Mobdub.Comments.reload = 'clean';
        Mobdub.Comments.settings.comments_current_count = 0;
        Mobdub.Comments.settings.comments_page_index = 1;

        Mobdub.Util.loadScript(Mobdub.Comments.loadUrl + '&callback=Mobdub.Comments.loadTextComments&page=' + Mobdub.Comments.settings.comments_page_index + '&search[order]=' + sortOrder, 'md-plugin', 'javascript');
    },

    startScrolling: function()    //resumes comments scrolling
    {
        Mobdub.Comments.canScrollComments = true;
    },

    stopScrolling: function()    //stops comments scrolling
    {
        Mobdub.Comments.canScrollComments = false;
    },

    scrollComment:function()
    {
        if (Mobdub.Comments.mdIsMouseover === false &&
            Mobdub.Comments.mdScrollFlag &&
            Mobdub.Comments.mdExtractedFeed != null &&
            Mobdub.Comments.mdExtractedFeed.length > 0 &&
            Mobdub.Comments.canScrollComments &&
            Mobdub.Comments.newCommentActive == false &&
            mdPartnerPlayerPosition() > 0
                )
        {
            var videoPos = mdPartnerPlayerPosition();
            if (videoPos < Mobdub.Comments.mdLastVideoPosition)
            {
                Mobdub.Comments.mdLastActiveCommentIndex = -1;
            }

            for (var index = Mobdub.Comments.mdLastActiveCommentIndex + 1, maxindex = Mobdub.Comments.mdExtractedFeed.length; index < maxindex; index++)
            {
                var theComment = Mobdub.Comments.mdExtractedFeed[index];
                var scrollDurationEnd = theComment.timeStamp + (theComment.text.length * Mobdub.Comments.settings.comments_reader_read_rate) / 1000;

                if (
                        ( parseInt(theComment.timeStamp) <= parseInt(videoPos) &&
                          videoPos < scrollDurationEnd &&
                          (scrollDurationEnd - videoPos ) * 1000 > Mobdub.Comments.settings.comments_reader_min_scroll_time ) ||
                        ( parseInt(theComment.timeStamp) == parseInt(videoPos) &&
                          videoPos < scrollDurationEnd  )
                        )
                {
                    Mobdub.Comments.mdScrollFlag = false;
                    //Mobdub.Comments.mdScrollDuration =  Math.ceil( Mobdub.Comments.mdVdoComments[index].text.length * Mobdub.Comments.settings.comments_reader_read_rate );
                    Mobdub.Comments.setActiveComment(Mobdub.Comments.mdExtractedFeed[index].commentId, true);
                    Mobdub.Comments.mdLastActiveCommentIndex = index;
                    Mobdub.Comments.mdLastVideoPosition = videoPos;
                    window.setTimeout(
                            "Mobdub.Comments.enableScrollFlag( '" + theComment.commentId + "' );",
                            (scrollDurationEnd - videoPos ) * 1000 < Mobdub.Comments.settings.comments_reader_min_scroll_time ?
                            Mobdub.Comments.settings.comments_reader_min_scroll_time :
                            (scrollDurationEnd - videoPos ) * 1000);
                    return;
                }
            }
        }
        window.setTimeout("Mobdub.Comments.enableScrollFlag();", Mobdub.Comments.scrollPollTime);
    },

    enableScrollFlag: function(commentId, newcomment)
    {
        if (commentId)
        {
            Mobdub.Comments.setActiveComment(commentId, false);
        }
        if ($("#mobdubCommentSection").attr("scrollHeight") == $("#mobdubCommentSection").height())
        {
            $(".ui-slider-handle").css('display', 'none');
            $(".ui-slider-handle").css('visibility', 'hidden');
        }
        else
        {
            $(".ui-slider-handle").css('display', '');
            $(".ui-slider-handle").css('visibility', 'visible');
        }
        Mobdub.Comments.mdScrollFlag = true;
        if (newcomment == null) Mobdub.Comments.scrollComment();
    },

    setOverlayHeight: function()
    {
        $("#overlaylayer").css("height", + $("#loginBox")[0].offsetTop + "px");
    },

    loadCookies: function()
    {
        var flagCookie = Mobdub.Util.getCookie("mobdub_comments_flag");
        var voteCookie = Mobdub.Util.getCookie("mobdub_comments_vote");
        Mobdub.Comments.mdCommentsFlaged = flagCookie != null ? flagCookie : "";
        Mobdub.Comments.mdCommentsVoted = voteCookie != null ? voteCookie : "";
    },

    clearCommentsPanel: function()
    {
        try
        {
            $("#mobdubCommentSection").html('');
            $(".ui-slider-handle").css('display', 'none');
            $(".ui-slider-handle").css('visibility', 'hidden');
        }
        catch(e) {
             Mobdub.Comments.log('clearCommentsPanel');
        }
    },

    init: function()
    {
        var slider_offset = 18;
        var slider_offset_padding = 24;

        //$("#mobdubCommentSection").css('min-height', "40px");   // Give a min-height to account for the loading gif
        $("#mobdubCommentSection").html('<div id="loadingMsg" style="text-align:center"><img src="' + mdImgPath + '/md-loader-big.gif"/><div>');

        try
        {
             setTimeout('$("#loadingMsg").html("")', 30000);  // Remove the spinner after a certain time - 30 secs
        }
        catch (e) { }

        if (md_config.comments_layout != 'autogrow')
        {

            var MobdubVideoCommentsHeight = eval($("#MobdubVideoComments").css("height").replace("px", ""));
            Mobdub.Comments.MobdubVideoCommentsHeight = eval($("#MobdubVideoComments").css("height").replace("px", ""));
            //$("#loginbar").css("left", ( Mobdub.Comments.MobdubVideoCommentsWidth - 2 - ( $("#loginbar").width() )   ) + "px");
            $("#vdoCommentSectionMain").css("height", ( Mobdub.Comments.MobdubVideoCommentsHeight - 100) + "px");
            var commentSectionParent = $("#mobdubCommentSection").parent();

            var contentSlider = $("#content-slider");
            var contentSliderWidth = parseInt(contentSlider.width()) +
                                 parseInt($("#content-slider").css("border-left-width").replace("px", "")) +
                                 parseInt($("#content-slider").css("border-right-width").replace("px", ""));

            Mobdub.Comments.mdCommentSectionHeight = commentSectionParent.height();
            //Mobdub.Comments.setDimension();
            $("#mobdubCommentSection").css('height', Mobdub.Comments.mdCommentSectionHeight + "px");
            $("#twtrCommentSection").css('height', Mobdub.Comments.mdCommentSectionHeight + "px");
            $("#content-slider").css("height", ( Mobdub.Comments.mdCommentSectionHeight ) + "px");
                	
	        var MobdubVideoCommentsWidth = eval($("#MobdubVideoComments").css("width").replace("px", ""));
	        Mobdub.Comments.MobdubVideoCommentsWidth = MobdubVideoCommentsWidth;
	        Mobdub.Comments.mdCommentSectionWidth = Mobdub.Comments.MobdubVideoCommentsWidth - slider_offset - slider_offset_padding;
	        $("#mobdubCommentSection").width(Mobdub.Comments.mdCommentSectionWidth);
	        $("#twtrCommentSection").width(Mobdub.Comments.mdCommentSectionWidth);     
        }
        else
        {
            // Borderless
            slider_offset = 0;
            slider_offset_padding = 4;
            $("#vdoCommentSectionMain").css('border', "0");
            $("#vdoCommentSectionMain").css('padding', "2px");

            // Borders
            //slider_offset = 0;
            //slider_offset_padding = 24;
        }
        
    },

    setDimension:function()
    {
        if (md_config.comments_layout != 'autogrow')
            $("#mobdubCommentSection").css('height', Mobdub.Comments.mdCommentSectionHeight);

        //$("#mobdubCommentSection").css('width', Mobdub.Comments.mdCommentSectionWidth);
    },

    log: function(desc)
    {
        try
        {
            console.debug(desc);
        }
        catch (e) {}
    },

    settings:
    {
        "video_link_url":"",
        "comments_enabled":"1",
        "comments_reader_read_rate":25,
        "comments_reader_scroll_animation":900,
        "comments_reader_min_scroll_time":2000,
        "comments_editor_default_text": "",
        "comments_reader_default_text": "",
        "comments_terms_of_service":"Terms of Use: We welcome your participation in our community. Notify us of any inappropriate comments by clicking the \"Flag\" link. \u003Cbr /\u003EYou must be at least 13 years of age to post comments. By submitting a comment, you agree to these \u003Cspan\u003E\u003Ca target='blank' href='" + mdEnv + "/termsOfUse.html'\u003ETerms of Service\u003C/a\u003E\u003C/span\u003E.",
        "twitter_user": "@mobmindnews",
        "twitter_tags": "",
        "twitter_search": "",
        "twitter_enabled": "0",
        "comments_bitlyAPI_key": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        "comments_bitlyAPI_login": "XXXXXX",
        "comments_current_count": 0,
        "article":
        {
            "css":
            {
                "textComment":"",
                "defaultViewerText": ""
            }
        }
    },

    // returns a default value in case the passed in (name) value is null
    getSetting: function(name, defaultValue)
    {
        if (name && name != '')
        {
            return name;
        }
        else
        {
            return defaultValue;
        }
    },

    fbUser: null,
    mdCommentsOverflow: false,
    mdExtractedFeed: [],
    scrollPollTime: 500,
    mdScrollCommentFlag :false,
    mdScrollFlag: true,
    mdLastActiveCommentIndex: -1,
    mdLastVideoPosition: 0,
    twtNextPageParams: "",
    mdTwtHashTags: {},
    mdTwtTimeLineFeeds: [],
    mdTwtCurrComment: "",
    mdFilteredComments: [],
    mdFBCommentsFeed: [],
    mdVdoComments: [],
    addNewCom: true,
    mdIsMouseover: false,
    mdCurrentTab: 'mobdub',
    mdCurrentSort: "TA",
    mdtwtrFirstFeedId: "",
    mdtwtrLastFeedId: "",
    mdCommentsVoted: "",
    mdCommentsFlaged: "",
    mdCommentSectionHeight: 0,
    mdCommentSectionWidth: 0,
    MobdubVideoCommentsWidth: 0,
    MobdubVideoCommentsHeight: 0,
    mdCommentSlider: 100,
    mdtwtrCommentSlider: 100,
    animateScrolling: true,
    canScrollComments: true,
    newCommentActive: false,
    inputBoxClickVideoPos: 0,
    type: 'text'
};

Mobdub.Comments.MDVideoComment = function(commentId, varUserId, creationDateTime, rating, text, timeStamp, endTime, userImage)
{
    this.commentId = commentId;
    this.userId = varUserId;
    this.creationDateTime = creationDateTime;
    this.rating = rating;
    this.text = text;
    this.timeStamp = timeStamp;
    this.endTime = endTime;
    this.userImage = userImage;
    this.scrollDuration = this.text == null ? 0 : Mobdub.Comments.settings.comments_reader_read_rate * this.text.length;
    this.scrollDurationEnd = this.timeStamp + this.scrollDuration / 1000;
};

Mobdub.Comments.MDVideoComment.prototype.getCommentId = function()
{
    return this.commentId;
};
Mobdub.Comments.MDVideoComment.prototype.getCreationDateTime = function()
{
    return ( new Date(this.creationDateTime) ).toLocaleString();
};

Mobdub.Comments.MDVideoComment.prototype.getFormattedCreationDateTime = function(eventType)
{
    var formated = "";
    var CurDate = new Date();
    var creationDate = ( new Date(this.creationDateTime) );
    var OneYearAgo = new Date(CurDate.getFullYear() - 1, CurDate.getMonth(), CurDate.getDate(), CurDate.getHours(), CurDate.getMinutes(), CurDate.getSeconds());
    var millisecondsInSecond = 1000;
    var millisecondsInminute = ( 60 * millisecondsInSecond );
    var millisecondsInAnhour = ( 60 * millisecondsInminute );
    var milliSecInADay = 24 * millisecondsInAnhour;
    var milliSecInWeek = 7 * milliSecInADay;
    var milliSecIn30Days = 30 * milliSecInADay;

    var timeDiff;
    if (md_config.ref_md_type != 'article' && eventType != 'onMobdubSmilSave')          // TODO: apply correct fix instead of this quick patch
    {
        timeDiff = ( new Date() - creationDate ) + ( new Date()).getTimezoneOffset() * 60000;
    }
    else
    {
        timeDiff = ( new Date() - creationDate );
    }


    if (timeDiff < millisecondsInminute)
    {
        formated = Math.round(timeDiff / millisecondsInSecond);
        formated = eval(formated) < 1 ? 1 : formated;
        formated += eval(formated) == 1 ? ' second ago' : ' seconds ago';
    }
    else if (timeDiff < millisecondsInAnhour)
    {
        formated = Math.round(timeDiff / millisecondsInminute);
        formated = eval(formated) < 1 ? 1 : formated;
        formated += eval(formated) == 1 ? ' min ago' : ' mins ago';
    }
    else if (timeDiff < milliSecInADay)
    {
        formated = Math.round(Math.floor(timeDiff / millisecondsInAnhour));
        formated += eval(formated) <= 1 ? ' hour ago' : ' hours ago';
    }
    else if (timeDiff < milliSecInWeek)
    {
        formated = Math.round(Math.ceil(timeDiff / milliSecInADay));
        formated += eval(formated) <= 1 ? ' day ago' : ' days ago';
    }
    else
    {
        var hours = creationDate.getHours();
        var minutes = creationDate.getMinutes();
        var date = creationDate.getDate();
        var year = creationDate.getFullYear();
        var Month = "";
        var AMPM = "";
        if (hours > 11)
            AMPM = "PM";
        else
            AMPM = "AM"
        if (hours == 0)
            hours = "12";
        else if (hours > 12)
        {
            hours = hours - 12;
        }

        switch (creationDate.getMonth())
        {
            case 0:
                Month = "Jan"; break;
            case 1:
                Month = "Feb"; break;
            case 2:
                Month = "Mar"; break;
            case 3:
                Month = "Apr"; break;
            case 4:
                Month = "May"; break;
            case 5:
                Month = "Jun"; break;
            case 6:
                Month = "Jul"; break;
            case 7:
                Month = "Aug"; break;
            case 8:
                Month = "Sep"; break;
            case 9:
                Month = "Oct"; break;
            case 10:
                Month = "Nov"; break;
            case 11:
                Month = "Dec"; break;
        }
        if (creationDate.getFullYear() == CurDate.getFullYear())
        {
            formated = ((hours < 10) ? "" + hours : hours ) + ":"
                    + ((minutes < 10) ? "0" + minutes : minutes)
                    + " " + AMPM + " "
                    + Month + " "
                    + date;
        }
        else
        {
            formated = Month + " " + date + " " + year;
        }
    }
    return formated;
};

Mobdub.Comments.MDVideoComment.prototype.getHighlightTime = function()
{
    return ( (this.endTime) - (this.timeStamp) ) * 1000;
};

Mobdub.Comments.MDVideoComment.prototype.getFormatedTime = function()
{
    return this.getFormatedMinutes() + ":" + this.getFormatedSeconds();
};

Mobdub.Comments.MDVideoComment.prototype.getFormatedMinutes = function()
{
    var thisTime = parseInt(this.timeStamp);
    var mins = ( ( thisTime > 0 ) ? (thisTime / 60) | 0 : '00') + "";
    return ( (mins.length == 1) ? "0" + mins : mins );
};

Mobdub.Comments.MDVideoComment.prototype.getFormatedSeconds = function()
{
    var thisTime = parseInt(this.timeStamp);
    var secs = ( thisTime > 0 && thisTime % 60 != 0 ) ? thisTime % 60 + "" : '00';
    return ( (secs.length === 1) ? ("0" + secs) : secs );
};

Mobdub.Comments.MDVideoComment.prototype.compareByTime = function(elem)
{
    var mdTime = (this.timeStamp);
    var elemTime = (elem.timeStamp);
    return ( (mdTime < elemTime) ? -1 : ((mdTime > elemTime) ? 1 : 0) );
};

Mobdub.Comments.MDVideoComment.prototype.compareByDate = function(elem)
{
    var mdDate = new Date(this.creationDateTime);
    var elemDate = new Date(elem.creationDateTime);
    return ( (mdDate < elemDate) ? -1 : ((mdDate > elemDate) ? 1 : 0) );
};

Mobdub.Comments.MDVideoComment.prototype.compare = function(elem, type)
{
    var result;
    var mdSortOption = new Mobdub.Comments.sortByOptions();

    if (type == mdSortOption.TA)
    {
        result = this.compareByTime(elem);
        if (result == 0)
        {
            result = this.compareByDate(elem) * -1;
        }
    }
    else if (type == mdSortOption.DD)
        result = this.compareByDate(elem) * -1;
    else if (type == mdSortOption.DA)
        result = this.compareByDate(elem);
    else if (type == mdSortOption.TD)
        result = this.compareByTime(elem) * -1;

    return result;
};

Mobdub.Comments.MDVideoComment.prototype.extractCommentsInfo = function( feed )
{
	if( feed )
	{
		this.commentId = feed.id;
		this.userId = "David_feed";
		this.creationDateTime = feed.created_at;
		this.rating = "+5";
		this.text = feed.body;
		this.timeStamp = feed.begin;
		this.endTime = feed.end;
	}
};

Mobdub.Comments.MDVideoComment.prototype.extractTwtFeedInfo = function( feed )
{
	if( feed )
	{
		var userName = feed.from_user;
		this.commentId = feed.id;
		this.userId = userName;
		
		if (md_config.ref_md_type != 'article')
		{
			this.creationDateTime = Mobdub.Util.getDateTimeLocalToUTC(feed.created_at);	
		}
		else
		{
			this.creationDateTime = feed.created_at;	
		}

		this.rating = "+5";
		this.text = feed.text;
		this.userImage  = feed.profile_image_url;
	}
};

Mobdub.Comments.MDVideoComment.prototype.getCommentUI = function(highlight)
{
    //var text = this.text.replace(/&#92;/g, "\\")
    var text = Mobdub.Comments.sanitizeText(this.text);
    text = Mobdub.Comments.handleWordBreak(text);
    text = Mobdub.Comments.formatURL(text);
    
    var addthisTitle = "";
    var isCommentVoted = false;
    var isCommentFlaged = false;

    if (Mobdub.Comments.mdCommentsVoted.indexOf("id=" + this.commentId + ",") >= 0)  isCommentVoted = true;
    if (Mobdub.Comments.mdCommentsFlaged.indexOf("id=" + this.commentId + ",") >= 0) isCommentFlaged = true;

    // Addthis properties
    if (md_config.ref_md_type != 'article')
    {
    	if (wnClipObj) addthisTitle = wnClipObj.mainHeadline;
    	var addthisURL = Mobdub.Util.getLandingPageUrl() + "&mdStartTime=" + this.timeStamp;
    	var shareParams = "{ url: '" + escape(addthisURL) + "', title: '" + escape(addthisTitle) + "', description:'Sharing this comment from " + escape(this.userId) + ": " + escape(this.text) + "' }";
    }
    else
    {
    	var shareParams = "{ url: '" + escape(document.location) + "', title: '" + escape(document.title) + "', description:'Sharing this comment from " + escape(this.userId) + ": " + escape(this.text) + "' }";
    }
    var addthisshare = '<a class="md-text-link md-text-link-share" href="" onclick="Mobdub.Util.showShareBox( true, ' + shareParams + ', this ); return false;">Share</a>';

    var ratingClass = (eval(this.rating) < 0) ? "md-text-rating-negative" : "md-text-rating-positive";
    if (eval(this.rating) == 0) ratingClass = "md-text-rating-zero";   
    var ratingText = (eval(this.rating) > 0 ) ? "+" + this.rating : "" + this.rating;
    var flagString = "";
    var VoteString = "";

    if (isCommentFlaged)
    {
        flagString = "<a class='md-text-link-disabled' title='Flagged as Inappropriate' id='flag" + this.commentId + "'>Flag</a>";
    }
    else
    {
        flagString = "<a class='md-text-link md-text-link-share' href='' title='Flag as inappropriate' id='flag" + this.commentId + "' " +
                     " onclick=\"return Mobdub.Comments.flagComment('" + this.commentId + "'); return false;\" >Flag</a>";

    }

    if (isCommentVoted)
    {
        VoteString = "<img class='thumbsupdown md-thumbs-up-disabled' title='Like' id='thumbsup" + this.commentId + "' src='" + mdImgPath +
                     "/thumbs_up_gray.gif' alt='up' />" +
                     "<img class='thumbsupdown md-thumbs-downdisabled' title='Dislike' id='thumbsdown" + this.commentId + "' src='" + mdImgPath +
                     "/thumbs_down_gray.gif' alt='down'  />";
    }
    else
    {
        VoteString = "<img class='thumbsupdown md-thumbs-up' title='Like' id='thumbsup" + this.commentId + "' src='" + mdImgPath +
                     "/thumbs_up.gif' alt='up' style='cursor:pointer;' onclick=\"Mobdub.Comments.thumbClicked('" + this.commentId + "',true);\" />" +
                     "<img class='thumbsupdown md-thumbs-down' title='Dislike' id='thumbsdown" + this.commentId + "' src='" + mdImgPath +
                     "/thumbs_down.gif' alt='down'  style='cursor:pointer;' onclick=\"Mobdub.Comments.thumbClicked('" +
                     this.commentId + "',false);\"  />";
    }

    var highlightClass = '';
    if (highlight) highlightClass = 'vdoCommentHighLight';

    var divText = '';
    var timestamp = '';
    if (md_config.ref_md_type != 'article')
    {
        timestamp = "<a class='vdoCommentTimeStamp md-text-link md-text-link-timestamp' href='javascript: Mobdub.Comments.seekPlayer(" + this.timeStamp + ")' title='Jump to " +
               this.getFormatedTime() + "'>" + this.getFormatedTime() + "</a> "
    }

	// TODO: apply proper fix instead of this patch
	var eventType = '';
	if (highlight)
	{
		eventType = 'onMobdubSmilSave';
	}
	
    try
    {
        divText =
            "<div class='vdoComment widget ui-widget-content md-background md-text " + highlightClass + "' id='" + this.getCommentId() + "'  > " +
            "<div id='vdoCommentContainer' class='vdoCommentContainer' style='position:relative' >" +
            "<div id='leftHeader'>" +
            "<span id='userId' class='vdoCommentUserId md-text-username'  title='" + this.userId + "'  >" + ( this.userId.length > 16 ? this.userId.substr(0, 13) + "..." : this.userId ) + "</span><br />" +
            "<span id='commentDate' class='vdoCommentDate'> " + this.getFormattedCreationDateTime(eventType) + "</span>" +
            "</div>" +
            "<div class='commentRating' id='commentRating' > " +
            "<span id='rating" + this.commentId + "' class='" + ratingClass + "'>" +
            ratingText + "</span> " +
            "<span>" + VoteString + "</span>" +
            "<div class='shareflag md-text-link' title='Send to friends'>" +
            addthisshare + " | " + flagString + "</div>" + "</div>" +
            "<div id='commentBody" + this.getCommentId() + "' class='vdoCommentBody' >" +
            timestamp + text +
            "</div>" +
            "</div>" +
            "<div style='clear:both'></div>" +
            "</div>";
    }
    catch(e) {}

    return divText;
};

Mobdub.Comments.MDVideoComment.prototype.getTwitterCommentUI = function(escape)
{
    var text = this.text;

    if (escape)
        text = Mobdub.Comments.sanitizeText(this.text);

    text = Mobdub.Comments.formatURL(text);
    text = Mobdub.Comments.formatTwtUsername(text);     // @mobmindnews @username
    text = Mobdub.Comments.formatTwtHashtag(text);      // #sports #news

    var divText = "<div id=" + this.getCommentId() + " class='vdoComment widget ui-widget-content md-background md-text'>" +
                  "<div id='vdoCommentContainer' class='twitterComment md-text'>" +
                  "<div id='leftHeader' style='width:57px'> " +
                  "<a href='http://www.twitter.com/" + this.userId + "'  title='" + this.userId + "' target='_blank'>" +
                  "<img id='userImg' class='mdTwitterImg' src='" + this.userImage + "'/>" +
                  "</a>" +
                  " </div> " +
                  "<div class='twtCommentBody md-text' id='twtCommentBody'> " +
                  "<a href='http://www.twitter.com/" + this.userId + "'  style='color:#0099B9' title='" + this.userId + "' target='_blank'>" +
                  "<span id='userId' class='vdoCommentUserId md-text-username'>" + ( this.userId.lenght > 16 ? this.userId.substr(0, 13) + "..." : this.userId ) + "</span>" +
                  "</a>" +
                  "<span id='commentBody' class='md-text md-text-twt-comment'> " + text + "</span>" +
                  "<div><span id='commentDate' class='vdoCommentDate'>" + this.getFormattedCreationDateTime() + "</span></div>" +
                  "</div>" +
                  "</div> " +
                  "<div style='clear: both;'></div>" +
                  "</div>";

    return divText;
};

function onMobdubSmilSave(smilObject, tempItemGUID)
{
    // Maintain backward compatibility with Flash calling this func - it attaches the tempItemGUID to the smilObject
    if (tempItemGUID) smilObject.guid = tempItemGUID;

    smilObject.textStyle 	= smilObject.text_style_id;
    smilObject.createdAt 	= smilObject.created_at;
    smilObject.user 		= { 'name':smilObject.user_name };
    smilObject.review 		= { 'vote':smilObject.vote };

    for (i = 0, max = Mobdub.Comments.mdExtractedFeed.length; i < max; i++)
    {
        if (Mobdub.Comments.mdExtractedFeed[i].commentId == smilObject.guid)
        {
            Mobdub.Comments.mdExtractedFeed[i].commentId = smilObject.id;
			//Mobdub.Comments.mdExtractedFeed[i].creationDateTime = Mobdub.Util.normalizeDate(smilObject.createdAt);
           	    
	    	$("#" + smilObject.guid).replaceWith(Mobdub.Comments.mdExtractedFeed[i].getCommentUI(true));

            // Clear highlight and resume scrolling in 4 secs
			window.setTimeout("Mobdub.Comments.newCommentActive = false;", 4000);
            window.setTimeout("Mobdub.Comments.enableScrollFlag('" + smilObject.id + "' , true);", 4000);

            break;
        }
    }
}

Mobdub.Util =
{
    getQSParam: function(paramName)
    {
        var url = location.search.substr(1)
        var queryString = new Array();
        var parms = url.split("&");

        for (var i = 0; i < parms.length; i++)
        {
            var parm = parms[ i ].split("=");
            queryString[ parm[0] ] = parm[1];
        }

        return queryString[ paramName ];
    },

    loadScript: function( url, id, type )
    {
        if ( url )
        {
            var oldFile = document.getElementById( id );
            if( oldFile != null )  	{ oldFile.parentNode.removeChild ( oldFile ); delete oldFile; }

            var head = document.getElementsByTagName( 'head' )[0];

            if( type == 'css' )
            {
                var mdTag = document.createElement( 'link' );
                mdTag.type = 'text/css';
                mdTag.id = id;
                mdTag.rel = 'stylesheet';
                mdTag.href = url;
            }
            else
            {
                var mdTag = document.createElement( 'script' );
                mdTag.type = 'text/javascript';
                mdTag.id = id;
                mdTag.src = url;
            }

            head.appendChild( mdTag );
        }
    },

    convertToJSDate: function(strDateTime)
    {
        var dateTimeParts = strDateTime.split("T");
        var dateParts = dateTimeParts[0].split("-");
        var timeParts = dateTimeParts[1].replace("Z", "").split(":");
        var theDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]);

        return theDate.toString();
    },
    
    normalizeDate: function(strDateTime)
    {
        // Fri Oct 08 2010 18:10:22 GMT-0400 (Eastern Daylight Time)
        var localDate = new Date(strDateTime);
        localDate = dateFormat(localDate, "ddd mmm d yyyy HH:MM:ss");

        return localDate.toString();
    },

    getDateTimeLocalToUTC: function(localDateTime)
    {
        return new Date(new Date(localDateTime) - ( new Date()).getTimezoneOffset() * -60000).toString();//  Local to UTC
    },

    isArray: function(arr)
    {
        return arr &&
               typeof arr === 'object' &&
               typeof arr.length === 'number' &&
               typeof arr.splice === 'function' &&
               !( arr.propertyIsEnumerable('length') );
    },

    setCookie: function(keyName, keyValue)
    {
        document.cookie = keyName + "=" + ( keyValue  ) + ";domain=" + Mobdub.Util.getDomain();
    },

    getDomain: function()
    {
        var baseDomainName = "";
        var fullDomainName = "" + mdEnv.replace("http://", "");
        baseDomainName = fullDomainName.substring(fullDomainName.lastIndexOf(".", fullDomainName.lastIndexOf(".") - 1) + 1);
        return baseDomainName;
    },

    getCookie: function(name)
    {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++)
        {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },

    getJSONCookie: function(name)
    {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++)
        {
            try
            {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0)
                {
                    var cookie =  c.substring(nameEQ.length, c.length);
                    cookie = unescape(cookie);
                    cookie = jQuery.parseJSON(cookie);

                    return cookie;
                }
            }
            catch (e)
            {
                Mobdub.Comments.log('getJSONCookie')
            }

        }
        return null;
    },

    mdPost: function(url, args, callbackFunc)
    {
        window.frames["mdPostIframe"].mdPostAjax(url, args, callbackFunc);
    },

    shareBoxloaded:function()
    {
        $("#mdShareFrame").contents().find("a").unbind("click");
        $("#mdShareFrame").contents().find("a").bind("click", function() {
            parent.Mobdub.Util.showShareBox(false);
        });
    },

    showShareBox: function(show, params, elem)
    {
        var qs = "";
        if (params)
        {
            qs = "mdTitle=" + encodeURIComponent(unescape(params.title)) +
                 "&mdUrl=" + encodeURIComponent(unescape(params.url)) +
                 "&mdContent=" + encodeURIComponent(unescape(params.description));
        }

        if (show)
        {
            $("#mdShareFrame").attr("src", mdEnv + "/mdShare.html?" + qs);

            // Adjust position for video canvas sizes
            var coords = Mobdub.Util.getPopUpPosition('share', elem);

            $("#mdShareBox").offset({ 'top': coords.top, 'left': coords.left });
            $("#mdShareIframeBorder").offset({ 'top':coords.top+5, 'left':coords.left+5 });

            $("#shareBox").css("visibility", "visible");
        }
        else
        {
            $("#shareBox").css("visibility", "hidden");

            if (jQuery.browser.msie) document.getElementById('mdShareFrame').contentWindow.document.body.innerHTML = " ";
            else $('#mdShareFrame').contents().find("#content").html(" ");
        }

        try {
            window.frames["mdShareFrame"].mdShowOpenIdInput(false);
        }
        catch(e) {
            Mobdub.Comments.log('showShareBox:window.frames["mdShareFrame"].mdShowOpenIdInput(false)');
        }
    },

    getPopUpPosition: function(type, elem)
    {
        var top, left;

        if (type == 'share')
        {
            var curElemPos = $(elem).offset();
            top =  curElemPos.top - 185;
            left = curElemPos.left - 340;

            return { 'top':top, 'left':left };
        }
        else
        {
            var screenPos, offsetTop;
            var screenWidth = 120;
            if (md_config.ref_md_type != 'article')
            {
                offsetTop = 160;
                screenPos = $('#mdPlayerPlaceDiv').offset();
            }
            else
            {
                screenWidth = 636;
                offsetTop = -195;
                screenPos = $('#vdoCommentMain').offset();
            }

            if (Mobdub.Comments.settings.video_screen_width != '')
                screenWidth = Mobdub.Comments.settings.video_screen_width;

            top = screenPos.top + offsetTop;
            left = screenPos.left + (screenWidth - 336)/2;

            return { 'top':top, 'left':left };
        }
    },
    
	 /**
	 * Add a stylesheet rule to the document (may be better practice, however,
	 *  to dynamically change classes, so style information can be kept in
	 *  genuine styesheets (and avoid adding extra elements to the DOM))
	 * Note that an array is needed for declarations and rules since ECMAScript does
	 * not afford a predictable object iteration order and since CSS is 
	 * order-dependent (i.e., it is cascading); those without need of
	 * cascading rules could build a more accessor-friendly object-based API.
	 * @param {Array} decls Accepts an array of JSON-encoded declarations
	 * @example
	addStylesheetRules([
	  ['h2', // Also accepts a second argument as an array of arrays instead
	    ['color', 'red'],
	    ['background-color', 'green', true] // 'true' for !important rules 
	  ], 
	  ['.myClass', 
	    ['background-color', 'yellow']
	  ]
	]);
	 */
	insertCssRules: function(decls) 
	{
	    var style = document.createElement('style');
	    document.getElementsByTagName('head')[0].appendChild(style);
	    
	    if (!window.createPopup) 
	    { /* For Safari */
	       style.appendChild(document.createTextNode(''));
	    }
	    var s = document.styleSheets[document.styleSheets.length - 1];
	    
	    for (var i=0, dl = decls.length; i < dl; i++) 
	    {
	        var j = 1, decl = decls[i], selector = decl[0], rulesStr = '';
	        if (Object.prototype.toString.call(decl[1][0]) === '[object Array]') {
	            decl = decl[1];
	            j = 0;
	        }
	        for (var rl=decl.length; j < rl; j++) 
	        {
	            var rule = decl[j];
	            rulesStr += rule[0] + ':' + rule[1] + (rule[2] ? ' !important' : '') + ';\n';
	        }
	
	        if (s.insertRule) 
	        {
	            s.insertRule(selector + '{' + rulesStr + '}', s.cssRules.length);
	        }
	        else 
	        { /* IE */
	            s.addRule(selector, rulesStr, -1);
	        }
	    }
	},

    getLandingPageUrl: function()
    {
        return Mobdub.Comments.settings.video_link_url;

        /*
        if (wnClipObj)
        {
            var wnVideoId = wnClipObj.id;
            var addthisURLparams = "clipId=" + wnVideoId;

            //check to see if there is a valid clip id - otherwise it is assumed to be a MRSS item
            if (wnVideoId == null || wnVideoId == "null" || wnVideoId == undefined || wnVideoId == "")
            {
                wnVideoId = wnClipObj.thirdpartyid;
                addthisURLparams = "mdPartnerVideoUri=" + wnVideoId;
            }

            //check to see if there is a valid clip id - otherwise it is assumed to be a MRSS item
            if (wnVideoId == null || wnVideoId == "null" || wnVideoId == undefined || wnVideoId == "")
            {
                wnVideoId = wnClipObj.flvUri;
                addthisURLparams = "mdPartnerVideoUrl=" + wnVideoId;
            }

            var url = document.location.href.split("?");
            //url[0] = url[0].replace( new RegExp( '#', 'g' ), '%23' ); 	//# breaks bit.ly
            addthisURL = url[0] + "?" + addthisURLparams; //wnClipObj.landingPageURL != "" ? wnClipObj.landingPageURL :

            return addthisURL;
        } */
    },

    shortenURL: function(escapedURL, callback)
    {
        bitlyURL = "http://api.bit.ly/shorten?version=" + Mobdub.Util.bitlyAPI_Version + "&longUrl=" + escapedURL + "&login=" + Mobdub.Comments.settings.comments_bitlyAPI_login + "&apiKey=" + Mobdub.Comments.settings.comments_bitlyAPI_key + "&format=" + Mobdub.Util.bitlyAPI_ResponseFormat;
        Mobdub.Util.loadScript(bitlyURL + "&callback=" + callback, "bitly");
    },

    stateVar : "state",
    bitlyAPI_ResponseFormat: "json",
    bitlyAPI_Version: "2.0.1"
};

// Authentication pkg
Mobdub.Auth =
{
    authenticate: function()
    {
        var authUser = Mobdub.Auth.getAuthenticatedUser();
        var loginHtml = "";

        if (!authUser)
        {
            loginHtml = "<a class='md-text-link' href='' onclick='Mobdub.Auth.signIn(); return false;' id='signInLink'>Sign In</a> or " +
                        "<a class='md-text-link' href='' onclick='Mobdub.Auth.signUp(); return false;' id='signUpLink'>Sign Up</a> for an account.";
        }
        else
        {
            loginHtml = "Signed in as <b>" + authUser.screen_name + "</b>. &nbsp;<a class='md-text-link' href='' status='false' onclick='Mobdub.Auth.signOut(); return false;' id='signOutLink'>Sign Out</a>";
        }
        $("#logintext").html(loginHtml);

        // If partner SSO is enabled
        try
        {
            if (Mobdub.Comments.options.sso_enabled)
            {
                var run = eval(Mobdub.Comments.options.sso_authenticate_function);
            }
        }
        catch (e) {}
    },

    signIn: function()
    {
        Mobdub.Auth.showLoginBox( true, 'existing');
    },

    signUp: function()
    {
        if (Mobdub.Comments.options.sso_enabled)
        {
            var u = eval(Mobdub.Comments.options.sso_sign_up_function);
        }
        else
        {
            Mobdub.Auth.showLoginBox(true, 'new');
        }
    },

    signOut: function()
    {
        var user = Mobdub.Auth.getAuthenticatedUser();

        if (user)
        {
            if (user.is_md_user)
            {
                Mobdub.Util.mdPost(mdEnv + "/sessions/current", { _method: "delete" }, function() {
                    window.parent.Mobdub.Auth.onSignOut();
                });
            }

            if (user.is_sso_user)
            {
/*                $.post(Mobdub.Comments.options.sso_sign_out_url, {}, function(data) {
                    if(data.indexOf("top.location.href='http://dub.worldnow.com/test/sso.html';") >= 0)
                    {
                        Mobdub.Auth.onSignOut()
                    }
                    else
                    {
                        Mobdub.Comments.log('Mobdub.Auth.signOut');
                    }
                 });  */
                var u = setTimeout(Mobdub.Comments.options.sso_sign_out_function, 1000);   // TODO: current hack - allowing for md logout post to go through
            }
        }
    },

    onSignOut: function()
    {
        Mobdub.Auth.authenticate();
    },

    getAuthenticatedUser: function()
    {
        var md_user = Mobdub.Util.getJSONCookie("mobdub_user_info");

        if (Mobdub.Comments.options.sso_enabled)
        {
            var sso_encrypted_cookie = Mobdub.Util.getCookie(Mobdub.Comments.options.sso_cookie);
            var sso_plaintext_cookie = Mobdub.Util.getJSONCookie(Mobdub.Comments.options.sso_cookie_plaintext);
            var sso_screen_names     = jQuery.parseJSON(Mobdub.Comments.options.sso_cookie_screen_name);

            // TODO: remove this temp Safari bug fix once wn code is pushed out
            var sso_secondary_cookie = Mobdub.Util.getCookie('EmailAddress');


			// Checking both sso cookies to ensure authentication
            if (sso_encrypted_cookie)
            {
                var screen_name;

                if (sso_plaintext_cookie)
                {
                    try
                    {
                        screen_name = sso_plaintext_cookie[sso_screen_names.primary];
                        if (!screen_name || screen_name == '')
                        {
                            screen_name = sso_plaintext_cookie[sso_screen_names.secondary];
                            if (!screen_name || screen_name == '')
                            {
                                screen_name = 'Guest';
                            }
                        }
                    }
                    catch(e)
                    {
                        screen_name = "Guest";
                    }
                }
                else if (sso_secondary_cookie)  // TODO: remove this temp Safari bug fix once wn code is pushed out
                {
                    try
                    {
                        screen_name = Mobdub.Util.getCookie('FirstName');
                        if (!screen_name)
                        {
                            screen_name = sso_secondary_cookie;  // In cases where First Name is not specified in sso's login info
                            if (screen_name)
                            {
                                // Use only the email prefix as screen name
                                if (screen_name.indexOf("@") >= 0)
                                {
                                    var screen_name_arr = screen_name.split("@");
                                    screen_name = screen_name_arr[0];
                                }
                            }
                        }
                    }
                    catch(e)
                    {
                        screen_name = "Guest";
                    }
                }

                var sso_user = {};
                if (md_user)
                {
                    sso_user.is_md_user = true;
                    sso_user.pic_url = md_user.pic_url;
                    sso_user.twitter_screen_name = md_user.screen_name;    // Need to maintain the twitter username
                }
                sso_user.screen_name = screen_name;
                sso_user.is_sso_user = true;
                return sso_user;
            }
            else if (md_user)
            {
                md_user.screen_name = md_user.screen_name.replace(/\+/g, " ");
                md_user.twitter_screen_name = md_user.screen_name;          // Need to maintain the twitter username
                md_user.is_md_user = true;
                return md_user;
            }
        }
        else
        {
            if (md_user)
            {
                md_user.screen_name = md_user.screen_name.replace(/\+/g, " ");
                md_user.twitter_screen_name = md_user.screen_name;         // Need to maintain the twitter username
                md_user.is_md_user = true;
            }
            return md_user;
        }
    },

    postPartnerLoginForm: function(username, password)
    {
        //var url = 'http://wndemo2.worldnow.com/global/PM/Login.aspx?L=104054&function=manageprofile&mode=login&referrer=http%3a%2f%2fdub.worldnow.com%2ftest%2fsso.html&referrerDomain=dub.worldnow.com';
        var url = Mobdub.Comments.options.sso_sign_in_url;
        var args = {
                        submittype: 'login',
                        subsequentSubmit: 'login',
                        referrer: 'http://dub.worldnow.com',
                        mode: 'login',
                        chkVisible: '0',
                        LoginEmailAddress: username,
                        LoginPassword: password
                    };

        $.post(url, args, function(data){
            if(data.indexOf("top.location.href='http://dub.worldnow.com';") >= 0)
            {
                Mobdub.Auth.showLoginBox( false );
                Mobdub.Auth.authenticate();
                Mobdub.Comments.submitComment();
            }
            else
            {
                // Show error on login pop up window
                var errorObj =
                {
                    "userName": '<div class="errorText">Email Address and Password do not match.</div>',
                    "password": '<div/>'
                };
                window.frames.mdLoginFrame.mdDisplaySSOError(errorObj);
            }

         });
    },

    showLoginBox: function(show, state)
    {
        if (show)
        {
            if (state == "new") $("#mdLoginFrame").attr("src", mdEnv + "/partners/" + Mobdub.Comments.options.partner_id + "/users/new");
            else if (state == "existing") $("#mdLoginFrame").attr("src", mdEnv + "/partners/" + Mobdub.Comments.options.partner_id + "/sessions/new");
			else if (state == "guest") $("#mdLoginFrame").attr("src", mdEnv + "/partners/" + Mobdub.Comments.options.partner_id + "/sessions/new?mode=guest");
			
            var frameHeight = 390;
            if (jQuery.browser.msie && jQuery.browser.version == "7.0")
                frameHeight += 10;

            $("#mdLoginFrame").css("height", frameHeight + "px");
            $("#mdLoginIframeBorder").css("height", frameHeight + "px");
            $("#mdLoginBox").css("height", (frameHeight + 2) + "px");

            // Adjust position for video canvas sizes
            var coords = Mobdub.Util.getPopUpPosition('login', this);

            $("#mdLoginBox").offset({ 'top': coords.top, 'left': coords.left });
            $("#mdLoginIframeBorder").offset({ 'top':coords.top+5, 'left':coords.left+5 });

            $("#loginBox").css("visibility", "visible");

            window.setTimeout("Mobdub.Comments.setOverlayHeight();", 5000);
        }
        else
        {
            $("#loginBox").css("visibility", "hidden");
            if (jQuery.browser.msie)
            {
                document.getElementById('mdLoginFrame').contentWindow.document.body.innerHTML = " ";
            }
            else
            {
                $('#mdLoginFrame').contents().find("#content").html(" ");
            }
        }
    }
};

// On DOM ready - might not work in the case since DOM ready even could have fired earlier on for the host page
$(document.body).ready(function ()
{
    var mdVideoPos = Mobdub.Util.getQSParam("mdStartTime");
    if (mdVideoPos && mdVideoPos != "")
    {
        //mdPartnerPlayerPlay();
        //alert("Seeking to " + mdVideoPos)
        //Mobdub.Comments.seekPlayer(	mdVideoPos );
    }
});

var mdDomain = document.domain;
document.domain = mdDomain.substring( mdDomain.lastIndexOf( ".", mdDomain.lastIndexOf( "." ) - 1 ) + 1 );
// Set up loading gfx
$("#MobdubVideoComments").html('<div id="loadingMsgMain" style="text-align:center"><img style="padding-top:35px" src="' + mdImgPath + '/md-loader-big.gif"/><div>');
try
{
     setTimeout('$("#loadingMsgMain").html("")', 30000);  // Remove the spinner after a certain time - 30 secs
}
catch (e) { }

Mobdub.Comments.setVideoCommentsUI();
Mobdub.Auth.authenticate();
Mobdub.Comments.init();

try
{
    if(mdVideoSettingsObject)
    {
        Mobdub.Comments.loadSettings(mdVideoSettingsObject);
    }
}
catch (e) {
    Mobdub.Comments.log('loadSync:loadSettings - Not an Error -> typeof=' + typeof(mdVideoSettingsObject));
    Mobdub.Comments.log('Mobdub.Comments.loadSettings=' + typeof(Mobdub.Comments.loadSettings));
}

// In case there was a load sync issue
try
{
    if(mdVideoCommentsObject)
    {
        Mobdub.Comments.loadComments(mdVideoCommentsObject);
    }
}
catch (e) { Mobdub.Comments.log('loadSync:loadComments - Not an Error'); }

try
{
    onMobdubCommentsReady();
}
catch (e) { Mobdub.Comments.log('onMobdubCommentsReady - Not an Error'); }

// Article
if (md_config.ref_md_type == 'article')
{
    try
    {
        // Load Data
        if (md_config.is_admin)
        {
            Mobdub.Util.loadScript( mdEnv + '/partners/' + md_config.partner_id + '/script.js?title=' + encodeURIComponent(md_config.content_title) + '&type=' + md_config.ref_md_type + md_ref_id_param, 'md-comments-loader', 'javascript' );
        }
        else
        {
            Mobdub.Util.loadScript( mdEnv + '/partners/' + md_config.partner_id + '/script.js?uri=' + md_config.ref_id + '&title=' + encodeURIComponent(md_config.content_title) + '&type=' + md_config.ref_md_type + md_ref_id_param, 'md-comments-loader', 'javascript' );
        }
    }
    catch(e)
    {
        //
    }
}

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) val = "0" + val;
                return val;
            };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d:    d,
                    dd:   pad(d),
                    ddd:  dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m:    m + 1,
                    mm:   pad(m + 1),
                    mmm:  dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy:   String(y).slice(2),
                    yyyy: y,
                    h:    H % 12 || 12,
                    hh:   pad(H % 12 || 12),
                    H:    H,
                    HH:   pad(H),
                    M:    M,
                    MM:   pad(M),
                    s:    s,
                    ss:   pad(s),
                    l:    pad(L, 3),
                    L:    pad(L > 99 ? Math.round(L / 10) : L),
                    t:    H < 12 ? "a" : "p",
                    tt:   H < 12 ? "am" : "pm",
                    T:    H < 12 ? "A" : "P",
                    TT:   H < 12 ? "AM" : "PM",
                    Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};
