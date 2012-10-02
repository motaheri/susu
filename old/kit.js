/**
	@author Toby Hughes, web@swansea-union.co.uk
	@owner Swansea University Students' Union (C) 2012
	@filename kit.js
	@description keep in touch javascript
**/

var Kit = {};
Kit.feed = {};

function kitFacebook(id){
	jQuery.ajax({
  		url: "https://www.facebook.com/feeds/page.php?id=" + id + "&format=json",
  		dataType: "json",
  		type: 'get',
  		success: function(data){
    			console.log( 'success' );
    			console.dir( data );
  		},
  		error: function(){
   			console.log( 'error!' );
 		}
	});
};

function kitTwitter(data){
	var twData = [];
	for (var i = 0; i < data.length; i++) {
		var item = {};
		item['network'] = 'twitter';
		var sn = data[i].user.screen_name;
		var d = getDateFromFormat(data[i].created_at, "EE MMM dd kk:mm:ss +0000 yyyy"); 
		item['date'] = d;
		item['message'] = linkify(data[i].text);
		item['account'] = sn;
		item['id'] = data.id;
		item['accountURL'] = 'http://twitter.com/' + sn;
		twData.push(item);
	}
	
	for (var i = 0; i < twData.length; i++) {
		Kit.feed[twData[i]['date'].toString()] = twData[i];
	}
	
	renderKit();	
};

function kitTwitter2(data){
	var twData = [];
	data = data['results'];
	for (var i = 0; i < data.length; i++) {
		var item = {};
		item['network'] = 'twitter';
		var sn = data[i].from_user;
		var d = getDateFromFormat(data[i].created_at, "E, dd NNN yyyy kk:mm:ss +0000"); 
		item['date'] = d;
		item['message'] = linkify(data[i].text);
		item['account'] = sn;
		item['id'] = data.id;
		item['accountURL'] = 'http://twitter.com/' + sn;
		twData.push(item);
	}
	
	for (var i = 0; i < twData.length; i++) {
		Kit.feed[twData[i]['date'].toString()] = twData[i];
	}	
};


function keys(obj)
{
    var keys = [];

    for(var key in obj)
    {
        if(obj.hasOwnProperty(key))
        {
            keys.push(key);
        }
    }

    return keys;
}

function renderKit(){
	var html = '';
	//sort feed
	var ks = keys(Kit.feed).sort(function(a,b){return b-a});	

	i2 = 1;
	$.each(ks, function(index, item){	
		item = Kit.feed[item];	
		if(i2<5){
			var t = new Date(item.date);
			t = prettyDate(ISODateString(t));
			html = html + '<li class="' + item.network + '"><span class="title"><a href="' + item.accountURL + '">' + item.account + '</a></span> ' + item.message + '<div class="actions">' + t + '<div class="kit-arrow"></div></div></li>';
		}
		i2++;
	});
	$('ul#kit-list').html(html);
};

function ISODateString(d){
 function pad(n){return n<10 ? '0'+n : n}
 return d.getUTCFullYear()+'-'
      + pad(d.getUTCMonth()+1)+'-'
      + pad(d.getUTCDate())+'T'
      + pad(d.getUTCHours())+':'
      + pad(d.getUTCMinutes())+':'
      + pad(d.getUTCSeconds())+'Z'
}

function linkify(inputText) {
    var replaceText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText
}

function prettyDate(time){
	var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);
			
	if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
		return;
			
	return day_diff == 0 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		day_diff == 1 && "Yesterday" ||
		day_diff < 7 && day_diff + " days ago" ||
		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
}
