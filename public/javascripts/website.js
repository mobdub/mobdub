/* Author: 

*/
var _lets_scroll_status = true;
function on_mouseover_status(is_over)
{
	_lets_scroll_status = !is_over;
}
function update_status()
{
	load_script('http://api.twitter.com/1/statuses/user_timeline.json?screen_name=mobdub&count=30&include_rts=1&callback=set_status');
}
function set_status(data)
{
	//var source = $('#handlebar-status-template').html();
    //var template = Handlebars.compile(source);
    //var result = template(data);
    
    //result = formatURL(result);
    //result = formatTwtUsername(result);     // @mobmindnews @username
   	//result = formatTwtHashtag(result);      // #sports #news

	// Clear div
	document.getElementById('status-results').innerHTML = ' ';
	$('#status-results').stop().animate({ marginTop: 0 });
	
	var tweet_text, profile_name, profile_image_url, tweet_div = "";
	jQuery.each(data, function(key, value) {
		if (value.text)
		{
			if (value.retweeted_status)
			{
				tweet_text = value.retweeted_status.text;
				profile_name = value.retweeted_status.user.screen_name;
				profile_image_url = value.retweeted_status.user.profile_image_url;
			}
			else 
			{
				tweet_text = value.text;
				profile_name = value.user.screen_name;
				profile_image_url = value.user.profile_image_url;
			}
			
			if (profile_name == 'omarkarim')
			{
				profile_name = 'mobdub';
			}
			
			tweet_text = formatURL(tweet_text);
    		tweet_text = formatTwtUsername(tweet_text);     // @mobmindnews @username
   			tweet_text = formatTwtHashtag(tweet_text);      // #sports #news
			tweet_div = tweet_div + '<div style="height:90px; font-size:1em">' +  
						'<a href="http://www.twitter.com/' + profile_name + '" target="_blank"><img align="left" border="0" width="48" height="48" style="padding-right:8px;" src="' + profile_image_url + '" /></a>' +
						'<a href="http://www.twitter.com/' + profile_name + '" target="_blank">' + profile_name + '</a>&nbsp;' + tweet_text +
						'</div>';		
		}
    });
	
    $('#status-results').html(tweet_div);	
    scrollIntervalId = setInterval('scroll_status(' + data.length + ')', 10000)
}
var scrollIntervalId;
var revs_done = 1;
function scroll_status(revs)
{
	if (_lets_scroll_status)
	{
		if (revs_done < revs)
		{
			var top = parseInt($('#status-results').css("margin-top"));
			top = top - 90;
			$('#status-results').stop().animate({ marginTop: top }); // could just get the child height instead of -90		
			
			revs_done++;					
		}	
		else
		{
			// reset scrolling
			clearInterval(scrollIntervalId);
			/*
			revs_done = 1;
			update_status();
			*/
		}
	}
}

function formatURL(text)
{
    return text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/g, function(url) {
        return formatHTMLLink(url, url);
    });
}

function formatHTMLLink(url, linkText)
{
    return '<a href="' + url + '" target="_blank">' + linkText + '</a>';
}

function formatTwtUsername(text)
{
    return text.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
        var username = u.replace("@", "");
        return formatHTMLLink("http://twitter.com/" + username, "@" + username);
    });
}

function formatTwtHashtag(text)
{
    return text.replace(/[#]+[A-Za-z0-9-_]+/g, function(t) {
        var tag = t.replace("#", "%23");
        return formatHTMLLink("http://search.twitter.com/search?q=" + tag, t);
    });
}
    
function load_script( url, id, type )
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
}























