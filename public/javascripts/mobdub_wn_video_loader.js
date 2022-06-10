// If not previous defined
if (typeof( md_config ) == "undefined")
{
    var md_config =
    {
        'ref_md_type': 'video',
        'comments_layout': 'scrolling'
    };
}

// Environment
var mdCmtDebug = false;
try
{
	if (mdCmtGetQSParam('md_debug') == 'true')							{ mdCmtDebug = true; }	
	if (md_config.domain)												{ mdEnv = md_config.domain; }
   	if (mdCmtGetQSParam('md_env') && mdCmtGetQSParam('md_env') != '')	{ mdEnv = mdCmtGetQSParam('md_env'); }
    
    // Set up prod references
    if (!( (mdEnv.indexOf('http://dubs.worldnow.com') >= 0) || 
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

var md_cache_buster = '04109011';

mdCmtLoadScript( mdStylesPath + '/comments-all.min.css?ver=' + md_cache_buster, 'mobdubCSS', 'css' );
if (md_config.custom_css_url)
{
    mdCmtLoadScript( md_config.custom_css_url, 'customCSS', 'css' );
}

// Load JS
if (mdCmtDebug)
{
	mdCmtLoadScript( mdScriptsPath + '/jquery-1.4.2.min.js?ver=' + md_cache_buster, 'md-jq', 'javascript' );
	mdCmtLoadScript( mdScriptsPath + '/jquery-ui-1.7.2.custom.min.js?ver=' + md_cache_buster, 'md-jqui', 'javascript' );
	mdCmtLoadScript( mdScriptsPath + '/mdComments.js?ver=' + md_cache_buster, 'md-comments-core', 'javascript' );	
}
else 
{   		
	mdCmtLoadScript( mdScriptsPath + '/comments-all.min.js?ver=' + md_cache_buster, 'md-comments', 'javascript' );
}

function mdCmtLoadScript( url, id, type )
{
	var oldFile = document.getElementById( id );
	if( oldFile != null )  	{ oldFile.parentNode.removeChild ( oldFile ); delete oldFile; }
	
	var head = document.getElementsByTagName( 'head' )[0];
	
	if( type == 'css' )
	{
		var mdTag = document.createElement( 'link' );
		mdTag.type = 'text/css';
		mdTag.id = 'mobdubCSS';
		mdTag.rel = 'stylesheet';
		mdTag.href = url;
	}
	else
	{
		var mdTag = document.createElement( 'script' );
		mdTag.type = 'text/javascript';
		mdTag.id = 'mobdubScript';
		mdTag.src = url;
	}

	head.appendChild( mdTag );
}

function mdCmtGetQSParam(paramName)
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