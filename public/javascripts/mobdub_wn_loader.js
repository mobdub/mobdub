// Parse QS params on this include
var qsArray = $('#md_comments_script').attr('src').split('?')[1].split('&');
var qsVars = {};
$.each(qsArray, function(x,y){
    var temp = y.split('=');
    qsVars[temp[0]] = temp[1];
});

// Set defaults
try
{
	if (!qsVars.width) qsVars.width = '628px';
	if (!qsVars.mdCommentsParentDiv) qsVars.mdCommentsParentDiv = 'WNCol2';	
}
catch (e) {}

// If not previous defined
if (typeof( md_config ) == "undefined")
{
    var md_config =
    {
          'custom_css_url': ''  
    };
}

// Set required properties if not defined
try
{
    if (!md_config.content_title)
    {
        if ( $("meta[name='WT.ti']").attr("content") )
        {
            md_config.content_title = $("meta[name='WT.ti']").attr("content");
        }
        else
        {
            md_config.content_title = $('title').text();   
        }
    }
}
catch (e) {}

try
{
    if (wnSiteConfigVideo.social.mdPartnerId)       { md_config.partner_id = wnSiteConfigVideo.social.mdPartnerId; }
    if (wnSiteConfigVideo.social.mdPartnerDomain)   { md_config.domain = wnSiteConfigVideo.social.mdPartnerDomain; }
}
catch (e) { }

// Environment
var mdDebug = false;
try
{
	if (mdGetQSParam('debug') == 'true')						{ mdDebug = true; }	
	if (md_config.domain)										{ var mdEnv = md_config.domain; }
   	if (mdGetQSParam('env') && mdGetQSParam('env') != '')		{ var mdEnv = mdGetQSParam('env'); }
    
    // Set up prod references
    if (!( (mdEnv.indexOf('http://dub.worldnow.com') >= 0) || 
    	   (mdEnv.indexOf('http://dev.mobdub.com') >= 0) || 
    	   (mdEnv.indexOf('http://local.mobdub.com') >= 0) ))
    {
    	md_config['scripts_domain'] = 'http://scripts.mobdub.com';
		md_config['styles_domain'] = 'http://styles.mobdub.com';
		md_config['images_domain'] = 'http://images.mobdub.com';	
    }

	
    if (md_config.scripts_domain){ var mdScriptsPath = md_config.scripts_domain; }
    else 						 { var mdScriptsPath = mdEnv + '/javascripts'; }
    
    if (md_config.styles_domain) { var mdStylesPath = md_config.styles_domain; }
    else 						 { var mdStylesPath = mdEnv + '/stylesheets'; }
    
    if (md_config.images_domain) { var mdImgPath = md_config.images_domain; }
    else 						 { var mdImgPath = mdEnv + '/images'; }  
}
catch (e) { }

try
{
    if (wng_pageInfo.containerType) { md_config.ref_type = wng_pageInfo.containerType; }
    if (wng_pageInfo.containerId)   { md_config.ref_id = wng_pageInfo.containerId;     }
    if (wng_pageInfo.permaLink)     { md_config.ref_source = wng_pageInfo.wng_pageInfo.permaLink; }
}
catch (e) { }

// For admin
var md_ref_id_param = '';
try
{
    if (md_config.ref_md_id)
    {
        md_ref_id_param = '&video_id=' + md_config.ref_md_id
    }
}
catch (e) {}

// Load comments
if ((md_config.ref_type == 'S' || md_config.ref_type == 's') && md_config.ref_id != '8945')
{
 	var md_cache_buster = '02112011';
    md_config.ref_id = 's-' + md_config.ref_id;
    md_config.ref_md_type = 'article';
    md_config.comments_layout = 'autogrow';

    // Append main comments div to the host page div
    $('#' + qsVars.mdCommentsParentDiv).prepend('<div id="MobdubVideoComments" style="width:' + qsVars.width + '; overflow:visible; position:relative; padding-bottom:30px"></div>');

	// Load CSS
	mdLoadScript( mdStylesPath + '/comments_all_min.css?ver=' + md_cache_buster, 'ms-main-css', 'css' );
	if (md_config.custom_css_url)
    {
        mdLoadScript( md_config.custom_css_url, 'custom', 'css' );
    }
    
    // Load JS
    if (mdDebug)
    {
    	mdLoadScript( mdScriptsPath + '/jquery-1.4.2.min.js?ver=' + md_cache_buster, 'md-jq', 'javascript' );
    	mdLoadScript( mdScriptsPath + '/jquery-ui-1.7.2.custom.min.js?ver=' + md_cache_buster, 'md-jqui', 'javascript' );
    	mdLoadScript( mdScriptsPath + '/mdComments.js?ver=' + md_cache_buster, 'md-comments-core', 'javascript' );	
    }
    else 
    {   		
    	mdLoadScript( mdScriptsPath + '/comments_all_min.js?ver=' + md_cache_buster, 'md-comments', 'javascript' );
    }
}
else
{
    md_config.ref_md_type = 'video';
}

function mdLoadScript( url, id, type )
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

function mdGetQSParam(paramName)
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
}

function mdSetUpEnvironmentVars()
{

}
