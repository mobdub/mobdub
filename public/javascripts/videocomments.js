// If not previous defined
if (typeof( md_config ) == "undefined")
{
    var md_config =
    {
        'ref_md_type': 'video',
        'comments_layout': 'scrolling'
    };
}

var mdCmtDebug = false;
if (mdCmtGetQSParam('debug') == 'true')	{ mdCmtDebug = true; }    

var md_cache_buster = '04109011';

mdCmtLoadScript( mdEnv + '/stylesheets/comments_all_min.css?ver=' + md_cache_buster, 'mobdubCSS', 'css' );
if (md_config.custom_css_url)
{
    mdCmtLoadScript( md_config.custom_css_url, 'customCSS', 'css' );
}

// Load JS
if (mdCmtDebug)
{
	mdCmtLoadScript( mdEnv + '/javascripts/jquery-1.4.2.min.js?ver=' + md_cache_buster, 'md-jq', 'javascript' );
	mdCmtLoadScript( mdEnv + '/javascripts/jquery-ui-1.7.2.custom.min.js?ver=' + md_cache_buster, 'md-jqui', 'javascript' );
	mdCmtLoadScript( mdEnv + '/javascripts/mdComments.js?ver=' + md_cache_buster, 'md-comments-core', 'javascript' );	
}
else 
{   		
	mdCmtLoadScript( mdEnv + '/javascripts/comments_all_min.js?ver=' + md_cache_buster, 'md-comments', 'javascript' );
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