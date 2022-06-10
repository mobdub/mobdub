var isMacSafari;
var currentVideoDiv;
var currentShareUrl = "";
var newWindowYTUrl = "";
var defaultClipId = "140";
var rndClipLoaded = false;
var sharedClipPlay = false;
var currentVideo;
var currentVideoTitle;

function mdPluginScriptLoadedSite( pluginObj )
{
	mdSetShareLink( pluginObj.partnerId, pluginObj.videoId, pluginObj.videoUri, pluginObj.videoTitle );
	
	if ( sharedClipPlay )
	{
		var video = new MDVideoClip();
		video.header		= "mobdub";
		video.id			= pluginObj.videoId;
		video.partnerId	  	= pluginObj.partnerId;
		video.title 		= pluginObj.videoTitle;
		video.thumbnailUrl 	= "";
		video.summary 	  	= pluginObj.videoDescription;
		video.duration 	  	= "0";
		video.totalViews   	= "0";
		video.playerUrl    	= pluginObj.videoUri;
		video.dubCount     	= pluginObj.videoDubCount;
		video.dateUpdated  	= ""; //pluginObj.videoCreatedAtDate;
		video.dateCreated  	= ""; //pluginObj.videoCreatedAtDate;
		video.areasCount   	= "";
		
		currentVideo = video;
		applyCurrVideoInfo( video );
		sharedClipPlay = false;
	}
}

function mdInitPage()
{			
	var partnerId = mdGetCurrentQuerystringParam( "partner_id" );
	var videoId = mdGetCurrentQuerystringParam( "video_id" );
	var searchQuery = mdGetCurrentQuerystringParam( "search_query" ); 

    // Hardcoded clip play
    if ( !(videoId > 0) )
	{
        videoId = 241;
    }

	if ( videoId > 0 )
	{
		if ( !partnerId > 0 )
		{
			partnerId = 2;
		}
		
		sharedClipPlay = true;
		mdPlayClip( partnerId, videoId );
		rndClipLoaded = true;
	}
	
	if ( (searchQuery != undefined) && (searchQuery != "") )
	{	
		mdSearchVideos( searchQuery ); //TODO: play random clip or load md logo in player and toggle to search results
	}

    // TEMP: server down
	/*mdSelectLastUserViewSelection();
	mdSetupViewImages();
	mdLoadMobdubFeeds();*/
}

function mdPlayClip( partnerId, videoId, scriptSrc )
{
	if ( scriptSrc == "" || scriptSrc == null)
	{
		scriptSrc = "/partners/" + partnerId + "/script.js?player_div=playerDiv&video_id=" + videoId;
	}

	mdLoadScript( "mobdubScript", scriptSrc );

	try
	{
		pageTracker._trackPageview( "/partners/" + partnerId + "/videos/" + videoId );
	}
	catch( e ) {}
	
	mdSetShareLink( partnerId, videoId , "", "" );
}

function mdLoadVideo( partnerVideoId, title, partnerId, videoId )
{
	if ( (videoId > 0) && (partnerId > 0) )
	{
		mdPlayClip( partnerId, videoId, "" )
	}
	else
	{
		var scriptSrc = "/partners/2/script.js?player_div=playerDiv&uri=" + encodeURIComponent( partnerVideoId ) + "&title=" +  encodeURIComponent( unescape( title ) );
		mdPlayClip( partnerId, videoId, scriptSrc )
	}
}

function mdSetShareLink( partnerId, videoId, videoUri, videoTitle )
{
	if ( partnerId == 2 )
	{
		currentShareUrl = "http://" + document.location.host + document.location.pathname + "?video_id=" + videoId;
		currentVideoTitle = videoTitle;
		newWindowYTUrl = "http://www.youtube.com/watch?v=" + videoUri;
		document.getElementById("newWindowImg").style.visibility = "visible";
	}
	else
	{
		currentShareUrl = "http://" + document.location.host + document.location.pathname + "?partner_id=" + partnerId + "&video_id=" + videoId;
		document.getElementById("newWindowImg").style.visibility = "hidden";
	}
	document.videoLinkForm.txtCurrentVideoLink.value = currentShareUrl;
}

function mdOpenLink ( linkUrl )
{
	window.open( linkUrl, "linkWindow" );
}

function mdLoadScript( scriptName, scriptUrl, onLoadCallback )
{
	var oldScript = $(scriptName);

	if( oldScript != null )
	{
		oldScript.parentNode.removeChild ( oldScript );
		delete oldScript;
	}
	var head = $$( "head" )[0];
	var script = document.createElement( "script" );

	script.id = scriptName;
	script.type = 'text/javascript';
	script.src = scriptUrl; 
	head.appendChild( script );
}

function mdGetQuerystringParam( url, paramName )
{
	var queryString = new Array();
	var parms = url.split( "&" );

	for( var i = 0; i < parms.length; i++ )
	{
	    var parm = parms[ i ].split( "=" );
	    queryString[ parm[0] ] = parm[1];
	}

	return queryString[ paramName ];
}

function mdGetCurrentQuerystringParam( paramName )

{
	return mdGetQuerystringParam( location.search.substr( 1 ), paramName );
}

function mdSetCookie(cookieName, cookieValue, expireDays)
{
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + expireDays);
	document.cookie = cookieName + "=" + escape(cookieValue) +
					  ((expireDays==null) ? "" : ";expires="+ exdate.toGMTString());
}

function mdGetCookie(cookieName)
{
	var value = "";
	if (document.cookie.length > 0)
	 {
	   var start = document.cookie.indexOf(cookieName + "=");
	   var end = "";
	   if (start != -1)
	   { 
			start = start + cookieName.length + 1; 
			end = document.cookie.indexOf(";", start);
			
			if (end == -1)
			{
				end = document.cookie.length;
			}
			value = unescape(document.cookie.substring(start, end));
		} 
	}
	return value;
}

		
var mdMobdubListDiv		= 'videoListB';
var mdMobdubGridDiv  	= 'videoGridB';
var mdYouTubeListDiv   	= 'videoListA';
var mdYouTubeGridDiv   	= 'videoGridA';
//feed vars
var mdYoutubeItemFeedUri= "http://gdata.youtube.com/feeds/api/videos/";	// Used for Single video as well as query url
var mdYouTubeFeedUri   	= "http://gdata.youtube.com/feeds/api/standardfeeds/most_popular";
var mdMobdubFeedUri    	= "http://www.mobdub.com/videos.json";
var mdYoutubeItemFeed 	= new MDVideoFeed( mdYoutubeItemFeedUri );
var mdYoutubeFeed  		= new MDVideoFeed( mdYouTubeFeedUri, "today", 		"mdShowYoutubeVideos", "viewCount" );
var mdYoutubeSearchFeed = new MDVideoFeed( mdYoutubeItemFeedUri, "", 		"mdShowYoutubeVideos" );
var mdMobdubFeed   		= new MDVideoFeed( mdMobdubFeedUri, "this_month", 	"mdShowMobdubVideos", "dub_count" );
var mdMobdubSearchFeed  = new MDVideoFeed( mdMobdubFeedUri, "this_month", 	"mdShowMobdubVideos", "dub_count" );

var mdMobdubInfoLoader = new MDVideoInfoLoader();
var mdDefVideoUrl = "";
var mdMaxRows  = 4;
var mdMaxCols  = 2;
var mdRowIncr  = 4;
var mdThumbsView = false;
var mdSearchView = false;
var mdCurrYouTubeClips = [];		// Current Youtube Clips
var mdCurrMobdubClips =  [];		// Current Mobdub Clips
var mdYTSearchClips = 	 [];		// Current Search Clips
var mdMDSearchClips = 	 [];		// Current Search Clips
var mdThumbsViewCookie = "thumbsView";
var mdSeeMoreVideoClick = false;
var mdCurrVideoDiv = null;
var mdCurrSearchQuery = null;
		
// Video Feed Object Definition
function MDVideoFeed(url, aTimeFrame, videoCallBack)
{
	this.baseUrl = 	url;
	this.timeFrame = aTimeFrame;
	this.alt = "json-in-script";
	this.callback = videoCallBack;
	this.format = 5;
	this.maxResults = 8;
	this.currIndex = 1;
	this.page = 1;
	this.version = 2;
	this.orderBy = "dub_count";
}
MDVideoFeed.prototype.getYouTubeVideoFeedUrl = function( maxResults )
{
	return	this.baseUrl + "?time=" + this.timeFrame +
			"&alt=" + this.alt +
			"&callback=" + this.callback +
			"&format=" + this.format +
			"&max-results=" + maxResults +
			"&start-index=" + this.currIndex +
			//"&orderby=" + this.orderBy +					
			"&v=" + this.version;
}
MDVideoFeed.prototype.getYTQueryFeedUrl = function( maxResults, query )
{
	return	this.baseUrl + "?q=" + query +
			"&alt=" + this.alt +
			"&callback=" + this.callback +
			"&format=" + this.format +
			"&max-results=" + maxResults +
			"&start-index=" + this.currIndex +
			//"&orderby=" + "relevance" + //default is relevance
			"&v=" + this.version;
}
MDVideoFeed.prototype.getMDQueryFeedUrl = function( maxResults, query )
{
return	this.baseUrl + "?page=" + this.page +
			"&callback=" + this.callback +
			"&per_page=" + maxResults +
			"&search=" + query +
			"&order=" + this.orderBy;
}
MDVideoFeed.prototype.getMobdubVideoFeedUrl = function( maxResults )
{
	return	this.baseUrl + "?page=" + this.page +
			"&callback=" + this.callback +
			"&per_page=" + maxResults +
			"&order=" + this.orderBy;
}
MDVideoFeed.prototype.getSingleYTFeedUrl = function(videoId, videoCallbackName)
{
	return	this.baseUrl + videoId + "?" +
		 	"alt=" + this.alt + 
			"&callback=" + videoCallbackName +
			"&format=" + this.format +
			"&version=" + this.version;
}
MDVideoFeed.prototype.moveNext = function(maxResults)
{
	this.currIndex += maxResults;
	this.page++;
}
MDVideoFeed.prototype.movePrev = function(maxResults)
{
	if( this.currIndex >= maxResults )
	{
		this.currIndex -= maxResults;
		this.page--;
	}
}
MDVideoFeed.prototype.resetIndex = function()
{
	this.currIndex = 1;
	this.page = 1;
}

// Video Clip Object Definition
function MDVideoClip()
{
	this.header 		= '';
	this.id				= 0;
	this.partnerId		= '';
	this.title 			= "";
	this.thumbnailUrl 	= "No Thumb Available";
	this.summary 	 	= "";
	this.duration 	 	= 0;
	this.totalViews		= 0;
	this.playerUrl    	= "";
	this.dubCount    	= "";
	this.dateUpdated	= "";
	this.dateCreated	= "";
	this.areasCount 	= 0;
}
MDVideoClip.prototype.getMinutes = function()
{
	var mins = ( ( this.duration > 0 ) ? (this.duration/60) | 0 : '00') + "";
	return ( (mins.length == 1) ? "0" + mins : mins );
}
MDVideoClip.prototype.getSeconds = function()
{
	var secs = ( this.duration > 0 && this.duration%60 != 0 ) ? this.duration%60 + "" : '00';
	return ( (secs.length === 1) ? ("0" + secs) : secs);
}
MDVideoClip.prototype.setYouTubeVideoClip = function( entry, vdoId )
{
	var mediaGroup = entry.media$group;
	this.header		  = 'youtube';
	this.id			  = entry.id.$t;
	this.videoId	  = (mediaGroup.yt$videoid != undefined)? mediaGroup.yt$videoid.$t : vdoId;
	this.title 		  = entry.title.$t;
	this.thumbnailUrl = mediaGroup.media$thumbnail[0].url;
	this.summary 	  = mediaGroup.media$description.$t;
	this.duration 	  = mediaGroup.yt$duration.seconds;

	this.totalViews   = (entry.yt$statistics)? entry.yt$statistics.viewCount: "1";
	this.playerUrl    = mediaGroup.media$player.url;
	this.playerUrl    = this.playerUrl ? this.playerUrl: mediaGroup.media$player[0].url;
	this.dateUpdated  = entry.updated.$t;
	this.dateCreated  = entry.published.$t;
}
MDVideoClip.prototype.setMissingClipData = function( clip )
{
	this.videoId	  = clip.videoId;
	this.title 		  = clip.title;
	this.thumbnailUrl = clip.thumbnailUrl;
	this.summary 	  = clip.summary;
	this.duration 	  = clip.duration;
	this.totalViews   = clip.totalViews;
	//this.playerUrl    = clip.playerUrl;
	this.dateUpdated  = clip.dateUpdated;
	this.dateCreated  = clip.dateCreated;
}
MDVideoClip.prototype.setMobdubVideoClip = function( entry )
{
	this.header		  = 'mobdub';
	this.id			  = entry.id;
	this.partnerId	  = entry.partner_id;
	this.title 		  = mdGetValOrSpace(entry.title);
	this.thumbnailUrl = mdGetConditionalVal(entry.thumb, "http://i.ytimg.com/vi/liABMxEvPAc/2.jpg");
	this.summary 	  = mdGetValOrSpace(entry.description);
	this.duration 	  = mdGetValOrZero(entry.length);
	this.totalViews   = entry.smilTexts_count;
	this.playerUrl    = entry.uri;
	this.dubCount     = entry.smilTexts_count;
	this.dateUpdated  = entry.updated_at;
	this.dateCreated  = entry.created_at;
	this.areasCount   = entry.areas_count;
	
	if ( entry.thumb == null && this.partnerId == 2 ) 
	{
		if( this.playerUrl != null)
		{
			this.thumbnailUrl = "http://img.youtube.com/vi/" + this.playerUrl + "/2.jpg";
		}
	}
}
MDVideoClip.prototype.getCreationDate = function()
{
	var tmpDate = ( (this.dateCreated == null || this.dateCreated == undefined ) ? "": this.dateCreated );
	var date = "";

	if( tmpDate )
	{
		if( this.isMobdubVideo() )
		{
			var arr = tmpDate.split(' ');
			date = arr[0];
		}
		else
		{
			var arr = tmpDate.split('T');
			date = arr[0];
		}
	}
	return date;
}
MDVideoClip.prototype.getCreationTime = function()
{
	var tmpDate = ( (this.dateCreated == null || this.dateCreated == undefined) ? "": this.dateCreated);
	var time = "";

	if( tmpDate )
	{
		if( this.isMobdubVideo() )
		{
			var arr = tmpDate.split(' ');
			time = arr[1];
		}
		else
		{
			var arr = tmpDate.split('T');
			time = (arr[1].split('.') )[0];
		}
	}
	return time;
}
MDVideoClip.prototype.getCreationDateTime = function()
{
	return this.getCreationDate() + " " + this.getCreationTime();
}
MDVideoClip.prototype.getFormattedCreationDate = function()
{
	var tmpDate = this.getCreationDate();
	var date =  null;

	var formatDate = "";

	if(tmpDate){
		if( this.isMobdubVideo() ){

			var arr = (tmpDate.split('T') )[0].split('/');
			date = new Date( arr[0], arr[1]-1, arr[2]);
			formatDate = date.getMonthName() + " " + date.getDate() + ", " +  date.getFullYear();
		}else{
			var arr = (tmpDate.split('T') )[0].split('-');
			date = new Date( arr[0], arr[1]-1, arr[2]);
			formatDate = date.getMonthName() + " " + date.getDate() + ", " +  date.getFullYear();
		}
	}
	return formatDate;
}
MDVideoClip.prototype.getTitle = function ( maxLen )
{
	return (this.title.length > maxLen) ? this.title.substr(0, maxLen ) + "..." : this.title;
}
MDVideoClip.prototype.getSummary = function( maxLen )
{
	return ( this.summary.length > maxLen ) ? this.summary.substr( 0, maxLen - 1 ) + "..." : this.summary;
}
MDVideoClip.prototype.isMobdubVideo = function()
{
	return this.header == "mobdub";
}
MDVideoClip.prototype.getVideoIndex = function(index)
{
	return this.header + "_" + index;
}
MDVideoClip.prototype.getImageIndex = function(index)
{
	return "img" + this.header + index;
}
MDVideoClip.prototype.getDivIndex = function(index)
{
	return "div" + this.header + index;
}
MDVideoClip.prototype.getDubPlusAreasCount = function()
{
	return mdFormatCommas( this.dubCount + this.areasCount );
}
MDVideoClip.prototype.getFormattedViewCount = function()
{
	return mdFormatCommas(this.totalViews);
}

// Start Video Info Loader Definition
function MDVideoInfoLoader()
{
	this.currIndex = -1;
	this.loadingYN = false;
	this.clipArr = null;	
	this.videoDivDataFormatter = null;
	this.videoDataLoader = null;
	this.callbackObjName = null;
};
MDVideoInfoLoader.prototype.startLoading = function( arrayToUse, vdoDivDataFormatter, vdoDataLoader, objName )
{
	if( this.loadingYN !== true )
	{
		this.clipArr = arrayToUse;
		this.videoDivDataFormatter = vdoDivDataFormatter;
		this.loadingYN = true;
		this.videoDataLoader = vdoDataLoader;
		this.callbackObjName = objName;
		this.loadNextVideo();
	}
}
MDVideoInfoLoader.prototype.loadNextVideo = function()
{
	// Start Loading start
	if(this.clipArr !== null && mdIsArray(this.clipArr) ){
		
		this.currIndex++;
		if( this.currIndex < this.clipArr.length){
			
			var clip = null;
			for( var i = this.currIndex; i < this.clipArr.length; i++,	this.currIndex++ ){
				
				if( this.clipArr[i].partnerId == 2){
					clip = this.clipArr[i];
					break;			
				}
			}
			
			if( clip !== null ){
		
				this.loadingYN = false;	// For failed retrieving video info
				this.videoDataLoader(clip.playerUrl, this.callbackObjName + '.videoCallback', this.onLoadVideoScript );	
			}else{
				this.loadingYN = false;	
			}
		}else{
			this.loadingYN = false;	
		}
	}
	
}
MDVideoInfoLoader.prototype.videoCallback = function(data)
{
	var entry = data.entry;
	var clip = new MDVideoClip();
	var oldClip = this.clipArr[this.currIndex];
	
	// Setup Video Clip
	clip.setYouTubeVideoClip(entry, clip.playerUrl);			
	var divName = oldClip.getDivIndex(this.currIndex);	
	// Setup new clip info
	oldClip.setMissingClipData(clip);

	var vidDiv = $(divName);
	if( vidDiv ){
		vidDiv.innerHTML = this.videoDivDataFormatter(oldClip, this.currIndex);	
		this.loadingYN = true;	// For failed retrieving video info
		//this.currIndex++;
		// Load Next Video
		this.loadNextVideo();
	}
}

// Utility Methods
var mdIsArray = function( value ) 
{
	return value &&
		typeof value === 'object' &&
		typeof value.length === 'number' &&
		typeof value.splice === 'function' &&
		!(value.propertyIsEnumerable('length'));
};

var mdGetValOrSpace = function( value )
{
	return mdGetConditionalVal( value, '&nbsp;' );
}

var mdGetValOrZero = function( value )
{
	return mdGetConditionalVal( value, 0 );
}

var mdGetConditionalVal = function( value, defVal )
{
	return value == undefined ? defVal: value;
}

function mdFormatCommas( numString ) 
{
    var re = /(-?\d+)(\d{3})/;
	numString = numString + "" ;
    while (re.test(numString)) 
    {
        numString = numString.replace(re, "$1,$2");
    }
    return numString;
}

Date.prototype.getMonthName = function() 
{   
	return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
			'September', 'October', 'November', 'December'][this.getMonth()];
}

function mdRemoveChildren( node )
{
	if( node )
	{
		while ( node.firstChild )
		{	
			node.removeChild( node.firstChild );
		};
	}		
}

/* Call back for youtube */
function mdShowYoutubeVideos( data )
{
	var clipArr = null;
	
	if( mdSearchView )
	{
		clipArr = mdYTSearchClips;
	}
	else
	{
		clipArr = mdCurrYouTubeClips;
	}
	
	// Load if required
	var clips = mdLoadYouTubeVideos( data, clipArr );
	
	mdRenderYoutubeVideos( clips );	
	mdScrollToVideoFooter();
	// Start dynamic loading of info
	mdMobdubInfoLoader.startLoading( mdCurrMobdubClips, mdGetVideoDivFormatter, mdLoadSingleYTFeed, 'mdMobdubInfoLoader' );
}

/* Call back for Mobdub */
function mdShowMobdubVideos( data )
{	
	var clipArr = null;
	
	if( mdSearchView )
	{
		clipArr = mdMDSearchClips;
	}
	else
	{
		clipArr = mdCurrMobdubClips;
	}
	// Load if required
	var clips = mdLoadMobdubVideos( data, clipArr );
	
	// List view
	mdRenderMobdubVideos( clips );
	
	if( data != null )
	{
		if( mdSearchView )
		{
			mdLoadYTQueryFeeds( mdCurrSearchQuery );	
		}
		else
		{
			mdLoadYoutubeFeeds();	
		}
	    //mdScrollToVideoFooter();			
	}
	
	if ( !rndClipLoaded ) { mdLoadRandomClip() }
}

// Call back for single video load
function mdPlayYTVideo( data )
{
	if( data && data.entry )
	{
		var clip = new MDVideoClip();	
		clip.setYouTubeVideoClip( data.entry );			
		applyCurrVideoInfo( clip );	
		var ytVideoId = getYoutubeVideoId( clip.playerUrl );	
			
		if ( ytVideoId != null )
		{
			mdLoadVideo( ytVideoId, clip.title, "", "" );
		}
		else
		{
			alert( "This video does not exist" );
		}
	}
}

function mdRenderYoutubeVideos( clips )
{
	if( !mdThumbsView )
	{
		mdShowVideos(clips, $(mdYouTubeListDiv) );
	}
	else
	{
		mdShowVideos(clips, $(mdYouTubeGridDiv) );
	}
}

function mdRenderMobdubVideos( clips )
{
	if( !mdThumbsView )
	{
		mdShowVideos(clips, $( mdMobdubListDiv ) );
	}
	else
	{
		mdShowVideos(clips, $( mdMobdubGridDiv ) );
	}	
}

function mdLoadMobdubVideos( data, clipArr )
{
	if( clipArr == null || !mdIsArray(clipArr) )
	{
		clipArr = [];		// Initialize Array				
	}
	
	if( data != null )
	{
		mdLoadMobdubData( data, clipArr );
	}
	return clipArr;
}

function mdLoadYouTubeVideos( data, clipArr )
{
	if(clipArr == null || !mdIsArray(clipArr) )
	{
		clipArr = [];		// Initialize Array				
	}
	
	if( data != null )
	{
		mdLoadYoutubeData(data, clipArr);
	}
	return clipArr;
}

/* Load the detail of the videos from server */
function mdLoadYoutubeData(data, clipArr)
{
	var feed = data.feed;
	var entries = feed.entry || [];
	// if not an empty array
	if( mdIsArray(entries) 	&& entries.length > 0 && clipArr != null)
	{
		for ( var i = 0; i < entries.length; i++ )
		{
			var entry = entries[i];
			var video = new MDVideoClip();
			// Setup Video Clip
			video.setYouTubeVideoClip( entry );			
			clipArr.push( video );
		}
	}
}

/* Load the detail of the videos from server */
function mdLoadMobdubData(data, clipArr)
{
	var entries = data || [];
	// if not an empty array
	if( mdIsArray(entries) 
		&& entries.length > 0 && clipArr != null){
		
		for (var i = 0; i < entries.length; i++)
		{
			var entry = entries[i];
			var video = new MDVideoClip();
			// Setup Video Clip
			video.setMobdubVideoClip(entry);			
			clipArr.push(video);
		}
	}
}		
		
function mdShowVideos( clips, videoDiv )
{
	var html = [''];
	var str = '';
	
	if( clips.length > 0 )
	{
		for( var i = 0; i < clips.length; i++ )
		{			
			if( !mdThumbsView )
			{
				str = str + '<div id="' + clips[i].getDivIndex(i) + '">' + 
					  mdCreateDetailedVideoInfo( clips[i], i ) + "</div>";
			}
			else
			{
				// For Grid Layout
				var index = 0;
				for( var j = 0; j < mdMaxCols; j++ )
				{
					index = ( i * mdMaxCols ) + j;
	
					if( index < clips.length )
					{
						str = str + '<div id="' + clips[index].getDivIndex(index) + '">' + 
							  mdCreateThumbVideoInfo( clips[index], index ) + "</div>";
					}	
				}
			}
		}
	}
	else
	{
		if( mdSearchView )
		{
			str = "<span class='videoTitleMultiple' style='color:#999999; font-size:1.6em; margin-left:142px'>No videos found.</span>";
		}
	}	
	html.push( str );
	html.push( '' );
	videoDiv.innerHTML = html.join( '' );	
}

/* Load a Random Video */
function mdLoadRandomClip()
{
	if(mdCurrMobdubClips != null && mdIsArray(mdCurrMobdubClips) )
	{
		var len = mdCurrMobdubClips.length;
		// Load a random video clip
		if( len > 0 )
		{
			var range = (len > mdMaxRows)? mdMaxRows : len;
			var randomNum = Math.floor(Math.random() * range );
			var video = mdCurrMobdubClips[randomNum];
			var imgDiv = $(video.getImageIndex(randomNum));
			var videoIndex = video.getVideoIndex(randomNum);
			mdDefVideoUrl = video.playerUrl;
			mdOnVideoLinkClicked( imgDiv, video.playerUrl, video.title, video.partnerId, video.id, videoIndex, false );
			rndClipLoaded = true;
		}
	}
}

var mdGetVideoDivFormatter = function( video, index )
{
	var html = "";
	if( !mdThumbsView )
	{
		divText = mdCreateDetailedVideoInfo( video, index );
	}
	else
	{	
		divText = mdCreateThumbVideoInfo( video, index );
	}	
	return divText;
}

var mdCreateThumbVideoInfo = function( video, index )
{
	var videoIndex = video.getVideoIndex(index);
	var imgIndex = video.getImageIndex(index);
	
	var divText = '<div class="videoThumbImage" onmouseover="mdOnMouseOverVideo(this);" onmouseout="mdOnMouseOutVideo(this);" id="' + imgIndex + '" ' +
			'onclick = "mdOnVideoLinkClicked(\'' + imgIndex + '\',\'' + video.videoId + '\',\'' + escape( video.title ) + '\',\'' + video.partnerId + '\',\'' + video.id + '\',\'' + videoIndex + '\', true)" >' +
			'<img width=128 height=96 src="' + video.thumbnailUrl + '" /> </div>' +
			'<div class="videoThumbDetailDiv"><div class="videoTitleMultiple" onclick="mdOnVideoLinkClicked(\'' + imgIndex + '\',\'' + video.videoId + '\',\'' + escape( video.title ) + '\',\'' + video.partnerId + '\',\'' + video.id + '\',\'' + videoIndex + '\', true)" >' + 
			'<span>' + video.getTitle( 35 ) + '</span></div>';
	
	if( Prototype.Browser.IE )
	{
		divText += '<div class="videoThumbStatsIE">';
	}
	else
	{
		divText += '<div class="videoThumbStats">';
	}
	
	if( video.playerUrl != null )
	{
		if( video.isMobdubVideo() ) 
		{		 
			divText += '<span class="videoLength">Dubs:&nbsp;</span>' + video.getDubPlusAreasCount();
		}
		else
		{
			divText += '<span class="videoLength">Length:&nbsp;</span>' + video.getMinutes() + ':' + video.getSeconds() + '<br/>';
			divText += '<span class="videoLength">Views:&nbsp;</span>' + video.getFormattedViewCount();
		}
	}
	divText += '</div></div></div>';
	
	if( (index % mdMaxCols) == 0 ) 
	{
		divText = '<div class="videoThumbBoxLeft"> ' + divText;	
	}
	else if( (index % mdMaxCols) == 1 )
	{
		divText = '<div class="videoThumbBoxRight"> ' + divText + '<div style="clear:both;height:8px"></div>';
	}
	return divText;
}

function mdCreateDetailedVideoInfo( video, index )
{
	var videoIndex = video.header + '_' + index;
	var imgIndex = video.getImageIndex( index );
	
	var divText = '<div style="height:105px;">' +
				'<div class="videoDetailDiv"> ' +
				'<div style="margin:8px;"><div class="videoThumbImage" id="' + imgIndex + '" onmouseover="mdOnMouseOverVideo(this);" onmouseout="mdOnMouseOutVideo(this);" ' +
				' onclick="mdOnVideoLinkClicked(\'' + imgIndex + '\',\'' + video.videoId + '\',\'' + escape( video.title ) + '\',\'' + video.partnerId + '\',\'' + video.id + '\',\'' + videoIndex + '\', true)" >' +
				'<img width=128 height=96 src = "' + video.thumbnailUrl + '"/> </div>' +
				'<div class="videoDetailSection" onclick="mdOnVideoLinkClicked(\'' + imgIndex + '\',\'' + video.videoId + '\',\'' + escape( video.title ) + '\',\'' + video.partnerId + '\',\'' + video.id + '\',\'' + videoIndex + '\', true)"><span class="videoTitleSingle"> ' + video.getTitle( 42 ) + '</span><br/>' +
				'<div class="videoSummary">' + video.getSummary( 103 ) + '</div>	<div style="height:24px"> ';
				
	//YT title for japanese text - "2009.01.06 Kkotboda Namja [꽃보다 남자] Ep.2 - 1/7"
	
	if( video.playerUrl != null )
	{
		if( video.isMobdubVideo() ) 
		{		 
			divText += '<br/><span class="videoLength">Dubs:&nbsp;</span>' + video.getDubPlusAreasCount();
		}
		else
		{
			divText += '<span class="videoLength">Length:&nbsp;</span>' + video.getMinutes() + ':' + video.getSeconds() +  '<br/>';
			divText += '<span class="videoLength">Views:&nbsp;</span>' + video.getFormattedViewCount();
		}		
	}
	divText += '</div></div></div></div></div>';			
	
	return divText;

}

function mdOnVideoLinkClicked( videoImgId, partnerVideoId, title, partnerId, videoId, feedVideoIndex, scrollToVideo )
{
	var videoImgDiv = $(videoImgId);

	if( mdCurrVideoDiv != null )
	{
		mdClearElem( mdCurrVideoDiv );	
	}
	mdUpdateCurrVideoInfo( feedVideoIndex );
	mdLoadVideo( partnerVideoId, title, partnerId, videoId );
	
	if( scrollToVideo != undefined && scrollToVideo){
		new Effect.ScrollTo($('playerMainSection'), {duration: 0.0});
	}
	
	mdHighlightElem( videoImgDiv );	
	mdCurrVideoId = feedVideoIndex;
	mdCurrVideoDiv = videoImgDiv;
}

function mdUpdateCurrVideoInfo( videoId )
{
	var arr = null;
	
	if( videoId != null )
	{
		arr = videoId.split('_');
		var type  = arr[0];

		var index = arr[1];
		var clip  = null;
			
		if( type == 'youtube' )
		{
			if( mdSearchView )
			{
				clip = mdYTSearchClips[index];	
			}
			else
			{
				clip = mdCurrYouTubeClips[index];	
			}
		}
		else if( type = 'mobdub' )
		{
			if( mdSearchView )
			{
				clip = mdMDSearchClips[index];	
			}
			else
			{
				clip = mdCurrMobdubClips[index];
			}
		}
		applyCurrVideoInfo( clip );			
	}		
}

function applyCurrVideoInfo ( clip )
{
	if( clip != null )
	{	
		if( clip.dateCreated == "" )
		{
			metaData = "";
		}
		else
		{
			metaData  = '<b>Created:</b> ' + clip.getFormattedCreationDate() + '&nbsp;&nbsp;|&nbsp;&nbsp;';
		}
		
		if( clip.playerUrl != null )
		{
			if(clip.isMobdubVideo())
			{ 
			   metaData += '<b>Dubs:</b> ' + clip.getDubPlusAreasCount();
			}else{
			   metaData += '<b>Views:</b> ' +  clip.getFormattedViewCount();
			}
		}
		$('topVideoTitle').innerHTML    = clip.getTitle( 106 ); //YT's max is 105
		$('topVideoMetaData').innerHTML = metaData;
		$('topVideoSummary').innerHTML  = clip.getSummary( 300 );
	}
}

function mdOnSeeMoreVideos()
{
	var maxResults = mdGetMaxVideoResultsCount();
	mdYoutubeFeed.moveNext(maxResults);
	mdMobdubFeed.moveNext(maxResults);
	mdYoutubeSearchFeed.moveNext(maxResults);
	mdMobdubSearchFeed.moveNext(maxResults);
	
	mdMaxRows += mdRowIncr;
	
	if( mdSearchView )
	{
		mdLoadMDQueryFeeds(mdCurrSearchQuery);	
	}else
	{
		mdLoadMobdubFeeds();
	}
	mdSeeMoreVideoClick = true;		
}

function mdOnPrevYoutubeFeeds()
{
	mdYoutubeFeed.movePrev();
	mdLoadYoutubeFeeds();
}

function mdLoadYTQueryFeeds( escapedQuery )
{
	var scriptName = "videoYTSearchScript";
	var scriptSrc = mdYoutubeSearchFeed.getYTQueryFeedUrl( mdGetMaxVideoResultsCount(), escapedQuery );
	mdLoadScript( scriptName, scriptSrc );
}

function mdLoadMDQueryFeeds( escapedQuery )
{
	var scriptName = "videoMDSearchScript";
	var scriptSrc = mdMobdubSearchFeed.getMDQueryFeedUrl( mdGetMaxVideoResultsCount(), escapedQuery );
	mdLoadScript( scriptName, scriptSrc );
}

function mdLoadYoutubeFeeds()
{
	var scriptName = "videoYTScript";
	var scriptSrc =  mdYoutubeFeed.getYouTubeVideoFeedUrl( mdGetMaxVideoResultsCount() );
	mdLoadScript( scriptName, scriptSrc );
}

function mdLoadMobdubFeeds()
{
	var scriptName = "videoMDScript";
	var scriptSrc = mdMobdubFeed.getMobdubVideoFeedUrl( mdGetMaxVideoResultsCount() );
	mdLoadScript( scriptName,  scriptSrc );
}

var mdLoadSingleYTFeed = function( videoId, videoCallbackName, onLoadCallback )
{
	var scriptName = "videoScript";
	var scriptSrc = mdYoutubeItemFeed.getSingleYTFeedUrl( videoId, videoCallbackName );
	mdLoadScript( scriptName, scriptSrc );
}

function mdOnMouseOverVideo(videoDiv)
{
	if( mdCurrVideoDiv !== videoDiv){
	
		mdHighlightElem(videoDiv);
	}
}

function mdOnMouseOutVideo(videoDiv)
{
	if( mdCurrVideoDiv !== videoDiv){
		mdClearElem(videoDiv);
	}
}		

function mdOnMouseOverListImg(img)
{
	if( mdThumbsView )
	{
		img.style.cursor = 'pointer'; 
	}
	else
	{
		img.style.cursor = 'auto'; 
	}
}

function mdOnMouseOutListImg( img )
{
	img.style.cursor = 'auto'; 
}

function mdOnMouseOverThumbImg( img )
{ 
	if( !mdThumbsView )
	{
		img.style.cursor = 'pointer'; 
	}
	else
	{
		img.style.cursor = 'auto'; 
	}
}

function mdOnMouseOutThumbImg( img )
{
	img.style.cursor = 'auto'; 
}

function mdHighlightElem( elem )
{
	elem.style.border = "4px solid #FF9933";		
}

function mdClearElem( elem )
{
	elem.style.border = "4px solid #FFFFFF";
}

function mdShowThumbnailView( img )
{
	if( !mdThumbsView )
	{
		mdThumbsView = true;
		mdSetupViewImages();				
			
		//mdHideVideoLibrary();				
		mdShowMobdubVideos(null);
		mdShowYoutubeVideos(null);		
		mdStoreUserViewSelection();		

		mdRemoveChildren($(mdMobdubListDiv));
		mdRemoveChildren($(mdYouTubeListDiv));
	}
}

function mdShowListView( img )
{
	if( mdThumbsView )
	{
		mdThumbsView = false;
		mdSetupViewImages();									
		
		//mdHideVideoLibrary();				
		mdShowMobdubVideos(null);
		mdShowYoutubeVideos(null);
		mdStoreUserViewSelection();		

		mdRemoveChildren($(mdMobdubGridDiv));
		mdRemoveChildren($(mdYouTubeGridDiv));
	}
}

function mdSearchResultsView( isSearchResultsView )
{
	if ( isSearchResultsView )
	{
		$("libraryAHeaderImg").src = "/images/hdrBlueYTSearchResults.gif";
		$("libraryBHeaderImg").src = "/images/hdrBlueMDSearchResults.gif";
		$("returnToTopVideosImgTop").style.display = "inline";
		$("returnToTopVideosImgBottom").style.display = "inline";
	}
	else
	{	
		$("libraryAHeaderImg").src = "/images/hdrBlueMostPopular.gif";
		$("libraryBHeaderImg").src = "/images/hdrBlueMostDubbed.gif";
		$("returnToTopVideosImgTop").style.display = "none";
		$("returnToTopVideosImgBottom").style.display = "none";
	}
}

function mdToggleYTView()
{
	mdSearchView = !mdSearchView;
	mdShowMobdubVideos(null);
	mdShowYoutubeVideos(null);
	mdSearchResultsView( false );
}

function mdSetupViewImages()
{
	var thumbImg = "";
	var listImg = "";
	
	if( !mdThumbsView )
	{
		thumbImg = "/images/ToggleThumbOFF.gif";
		listImg  = "/images/ToggleListON.gif";			
	}else
	{
		thumbImg = "/images/ToggleThumbON.gif";
		listImg  = "/images/ToggleListOFF.gif";
	}
	$("imgToggleThumb").src = thumbImg;
	$("imgToggleList").src  = listImg;
}
	
function mdHideVideoLibrary()
{
	if( !mdThumbsView){					
		mdFadeOutElem(mdMobdubGridDiv, mdMobdubListDiv, mdScrollToVideoLibrary );
		mdFadeOutElem(mdYouTubeGridDiv, mdYouTubeListDiv, function(){;} );
	}else{
		mdFadeOutElem(mdMobdubListDiv, mdMobdubGridDiv, mdScrollToVideoLibrary );
		mdFadeOutElem(mdYouTubeListDiv, mdYouTubeGridDiv, function(){;} );				
	}
}		

function mdShowVideoLibrary()
{
	if( !mdThumbsView){
		mdGrowElem(mdMobdubListDiv);
		mdGrowElem(mdYouTubeListDiv);		
	}else{
		mdGrowElem(mdMobdubGridDiv);
		mdGrowElem(mdYouTubeGridDiv);
	}
}		
	
var mdScrollToVideoFooter = function()
{	
	if( mdSeeMoreVideoClick )
	{
		new Effect.ScrollTo($('videoFooter'));
		mdSeeMoreVideoClick = false;
	}
}

var mdScrollToVideoLibrary = function()
{				
	//new Effect.ScrollTo( 'playerLibraryDivider', {duration: 0.40} );			
}

function mdFadeOutElem( elemId, growElemId, callbackScroll )
{
	new Effect.Fade(elemId, {beforeFinish: 
							function(){
								 mdGrowElem(growElemId, callbackScroll);
							}, queue: 'end', duration:0.05});
}	

function mdGrowElem(elemId, callbackScroll)
{	
	new Effect.Grow(elemId, {queue: 'end', duration:0.05, beforeFinish: callbackScroll} );
}	

function mdSelectLastUserViewSelection(){

	var cookieVal = mdGetCookie( mdThumbsViewCookie );
	
	if( cookieVal )
	{
		if( cookieVal == "true" )
		{
			mdThumbsView = true;
		}
		else
		{
			mdThumbsView = false;
		}
	}
	else
	{
		mdThumbsView = false;
	}			
}

function mdStoreUserViewSelection()
{		
	var cookieVal = "";
	
	if( mdThumbsView == true){
		cookieVal = 'true';
	}else{
		cookieVal = 'false';
	}
	// Setup cookie for 15 days
	mdSetCookie(mdThumbsViewCookie, cookieVal, 15);
}

function installExtension (aEvent)
{
	var params = {
		"Mobdub": { URL: aEvent.href,
		IconURL: aEvent.getAttribute("iconURL"),
		Hash: aEvent.getAttribute("hash"),
		toString: function () { return this.URL; }
		}
	};
	try
	{
		InstallTrigger.install(params);
	}
	catch ( e ) {}
	
	return false;
}

function mdGetMaxVideoResultsCount()
{
	return ( mdThumbsView ) ? 8 : 8;
}

function mdSearchVideos( query ) 
{
	mdCurrSearchQuery = query; 
	var ytVideoId = getYoutubeVideoId( mdCurrSearchQuery );

	if( ytVideoId != null )
	{
		mdLoadSingleYTFeed( ytVideoId, "mdPlayYTVideo" );
	}
	else
	{
		$(mdYouTubeGridDiv).innerHTML = "";
		$(mdYouTubeListDiv).innerHTML = "";		
		mdYTSearchClips = [];		// Reset feeds
		mdMDSearchClips = [];
		mdYoutubeSearchFeed.resetIndex();
		mdMobdubSearchFeed.resetIndex();		
		mdSearchView = true;
		mdCurrSearchQuery = escape( mdCurrSearchQuery );
		mdLoadMDQueryFeeds( mdCurrSearchQuery );
		mdSearchResultsView( true ); 
		new Effect.ScrollTo( $('returnToTopVideosAnchor'), { duration: 1.0 } );
	}	
	return false;
}

function getYoutubeVideoId( query )
{
	var videoId = null;
	query = query + ""; //convert to string
	
	if ( query.indexOf( "http://www.youtube.com/" ) == 0 || query.indexOf( "http://youtube.com/" ) == 0 )
	{
  	    var regex = new RegExp("[\\?&]v=([^&#]*)");
 	    var qs = regex.exec(query);
		videoId = (qs != null)? qs[1]: null;	
	}
	
	return videoId;
}
