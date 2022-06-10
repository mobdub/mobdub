// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
      arguments.callee = arguments.callee.caller;
      console.log( Array.prototype.slice.call(arguments) );
  }
};
// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});

$(document).ready(function() {

    // Convert UTC dates to local time
    $(".date").each(function (i) {
    	if(this.innerHTML)
    	{
    		var lDate = new Date(this.innerHTML);
        	$(this).html(dateFormat(lDate, "m/d/yy h:MM TT"));	
    	}
    });
    $(".dateLong").each(function (i) {
    	if(this.innerHTML)
    	{
        	var lDate = new Date(this.innerHTML);
        	$(this).html(dateFormat(lDate, "dddd mmmm d, yyyy, h:MM:ss TT"));
        }
    });
    $("#search_created_at_greater_than_or_equal_to option").each(function (i) {
        //var lDate = new Date(this.innerHTML);
        var utcDate = $(this).attr("value");
        if (utcDate != "")
        {
             //var lDate = new Date(utcDate); 
             //$(this).attr("value", dateFormat(lDate, "yyyy-mm-d"));
        }
    });

    // Add hover highlighting
    $(".highlight").hover(function () {
        $(this).addClass("rowHover");
    }, function () {
        $(this).removeClass("rowHover");
    });

    //add click highlighting
    $(".highlight").click(function () {
        $(this).addClass("rowHover");
    });

    //hide empty element - prevents pagination css to add borders to empty elements
    $(".moderate").each(function (i) {
        $(this).html(jQuery.trim($(this).html()));  //remove empty space - needed for the empty test to pass
        if ($(this).is(':empty')) {
            $(this).hide();
        }
    });

    //add onclick event to all "moderate" class elements
    $(".moderate").click(function (event) {
        event.stopPropagation();    //prevents links click from loading the item details

        var cmtId = $(this).attr("cmtId");
        var action = $(this).attr("action");
        var posturl = $(this).attr("posturl");

		// Loading message
        $("#cmtStatus" + cmtId).text("");
        $("#cmtStatus" + cmtId).addClass("isLoading");
		
		// Loading message - listing page
		if(parent)
        {
        	parent.$("#cmtStatus" + cmtId).text("");
			parent.$("#cmtStatus" + cmtId).addClass("isLoading");
        }
        
        // Loading message - details page
        if(document.getElementById('itemFrame'))
        {	
        	document.getElementById('itemFrame').contentWindow.$("#cmtStatus" + cmtId).text("");
			document.getElementById('itemFrame').contentWindow.$("#cmtStatus" + cmtId).addClass("isLoading");
        }
           
	               
        $.ajax({
            "type": "POST",
            "url": posturl,
            "data": { "action": action },
            success: function(msg)
            {
                $("#cmtStatus" + cmtId).removeClass("isLoading");
                $("#cmtStatus" + cmtId).html(action);

				// Change status on listing page as well
				if(parent)
                {
                	parent.$("#cmtStatus" + cmtId).text("");
        			parent.$("#cmtStatus" + cmtId).addClass("isLoading");
                	parent.$("#cmtStatus" + cmtId).removeClass("isLoading");
                	parent.$("#cmtStatus" + cmtId).html(action);
                }
                
                // Change status on item details page
                if(document.getElementById('itemFrame'))
                {	
                	document.getElementById('itemFrame').contentWindow.$("#cmtStatus" + cmtId).text("");
        			document.getElementById('itemFrame').contentWindow.$("#cmtStatus" + cmtId).addClass("isLoading");
                	document.getElementById('itemFrame').contentWindow.$("#cmtStatus" + cmtId).removeClass("isLoading");
                	document.getElementById('itemFrame').contentWindow.$("#cmtStatus" + cmtId).html(action);
                }
	                
                if (action == "Approved")
                {
                    $("#approve" + cmtId).hide();
                    $("#reject" + cmtId).html('Reject').fadeIn(500);
                    
                    // Change status on listing page
                    if(parent)
                    {
                    	parent.$("#approve" + cmtId).hide();
                    	parent.$("#reject" + cmtId).html('Reject').fadeIn(500);	
                    }
                    
                    // Change status on item details page
	                if(document.getElementById('itemFrame'))
	                {	
	                	document.getElementById('itemFrame').contentWindow.$("#approve" + cmtId).hide();
                    	document.getElementById('itemFrame').contentWindow.$("#reject" + cmtId).html('Reject').fadeIn(500);	
	                }
                }
                else if (action == "Rejected")
                {
                    $("#reject" + cmtId).hide();
                    $("#approve" + cmtId).html('Approve').fadeIn(500);
                    
                    // Change status on listing page
                    if(parent)
                    {
                    	parent.$("#reject" + cmtId).hide();
                    	parent.$("#approve" + cmtId).html('Approve').fadeIn(500);	
                    }
                    
                    // Change status on item details page
	                if(document.getElementById('itemFrame'))
	                {	
	                	document.getElementById('itemFrame').contentWindow.$("#reject" + cmtId).hide();
                    	document.getElementById('itemFrame').contentWindow.$("#approve" + cmtId).html('Approve').fadeIn(500);	
	                }
                }
                else if (action == "Spammed")
                {
                    $("#reject" + cmtId).hide();
                    $("#approve" + cmtId).hide();
                    $("#spam" + cmtId).hide();
                    $("#notspam" + cmtId).html('Not Spam').fadeIn(500);
                    
                    // Change status on listing page
                    if(parent)
                    {
                    	parent.$("#reject" + cmtId).hide();
	                    parent.$("#approve" + cmtId).hide();
	                    parent.$("#spam" + cmtId).hide();
	                    parent.$("#notspam" + cmtId).html('Not Spam').fadeIn(500);	
                    }
                    
                    // Change status on item details page
                    if(document.getElementById('itemFrame'))
                    {	
                    	document.getElementById('itemFrame').contentWindow.$("#reject" + cmtId).hide();
	                    document.getElementById('itemFrame').contentWindow.$("#approve" + cmtId).hide();
	                    document.getElementById('itemFrame').contentWindow.$("#spam" + cmtId).hide();
	                    document.getElementById('itemFrame').contentWindow.$("#notspam" + cmtId).html('Not Spam').fadeIn(500);	
	                }
                }
                else if (action == "Created")
                {
                	$("#notspam" + cmtId).hide();
                    $("#reject" + cmtId).html('Reject').fadeIn(500);
                    $("#approve" + cmtId).html('Approve').fadeIn(500);
                    $("#spam" + cmtId).html('Spam').fadeIn(500);
   
                    // Change status on listing page
                    if(parent)
                    {
                    	parent.$("#notspam" + cmtId).hide();
                    	parent.$("#reject" + cmtId).html('Reject').fadeIn(500);
                    	parent.$("#approve" + cmtId).html('Approve').fadeIn(500);
                    	//$("#spam" + cmtId).html('Spam').fadeIn(500);
                    }
                    
                    // Change status on item details page
                    if(document.getElementById('itemFrame'))
                    {	
                    	document.getElementById('itemFrame').contentWindow.$("#notspam" + cmtId).hide();
                    	document.getElementById('itemFrame').contentWindow.$("#reject" + cmtId).html('Reject').fadeIn(500);
                    	document.getElementById('itemFrame').contentWindow.$("#approve" + cmtId).html('Approve').fadeIn(500);
                    }
                }
            },
            error: function(msg)
            {
                alert("Whoops! We have encountered an error, please try again.")
            }
        });
    });

    if ($("input[type=checkbox]").attr("value", "1"))
    {
        $("input[type=checkbox]").attr("checked", "true");
    }
    if ($("input[type=checkbox]").attr("value", "0"))
    {
        $("input[type=checkbox]").removeAttr("checked");
    }

	// Add Trailing affect to any element with class 'trailing''
	$(function() {            
    	var offset = $('.trailing').offset();            
    	var topPadding = 5;   
            
    	$(window).scroll(function() 
    	{     
    		if (offset)
    		{
    			if ($(window).scrollTop() > offset.top) 
				{                    
					if( $('#itemFrame').height() >= $(window).height() ) // In case window is smaller than the details pane
					{
						$('.trailing').stop().animate({ marginTop: $(window).scrollTop() - offset.top + topPadding - ( $('#itemFrame').height() - $(window).height() + 8 ) }); 	
					}
					else
					{
						$('.trailing').stop().animate({ marginTop: $(window).scrollTop() - offset.top + topPadding }); 	
					}	
				} 
				else 
				{ 
					$('.trailing').stop().animate({ marginTop: 0 }); 
				}	
    		}           
    	});
    });	
}); //end (document).ready

function showDetails(elem, url, type)
{
    $(".rowSelected").removeClass("rowSelected");
    $(elem).addClass("rowSelected");
    $('#itemFrame').attr('src', url);

    if (type)
    {
        $("#itemDetailsNav").html(type + " Details")
    }
}

function formatTwtSearchUrl(url)
{
    if ( /^http:\/\//.test(url) )
    {
        return url;
    }
    else
    {
        return 'http://search.twitter.com/search.json?q=' + url;
    }
}

function sanitizeText(text)
{
    text = $('<div/>').text(text).html();
    return text;
}

function resizeIframe(h)
{
    $('#itemFrame').height(h + 50);
}

// Loading userinfo 
function setTwitterUserInfo(user)
{
	user = user[0];
	var html = '<div style="min-height:50px;">' +  
					'<a href="http://www.twitter.com/' + user.screen_name + '" target="_blank"><img align="left" border="0" width="48" height="48" style="padding-right:8px;" src="' + user.profile_image_url + '" /></a>' +
					'<a href="http://www.twitter.com/' + user.screen_name + '" target="_blank">' + user.screen_name + '</a>';
					
	if (user.description) { html = html + '<p style="padding-bottom:4px" /><span>' + user.description + '</span>'; }
					
	html = html + '</div>';
	$('#twitter_user').html(html);
}
function setFacebookUserInfo(user)
{
	var html = '<div style="min-height:50px;">' +  
					'<a href="' + user.link + '" target="_blank"><img align="left" border="0" width="48" height="48" style="padding-right:8px;" src="http://graph.facebook.com/' + user.id + '/picture" /></a>' +
					'<a href="' + user.link + '" target="_blank">' + user.name + '</a>' +
				'</div>';
	$('#facebook_username').html(html);
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