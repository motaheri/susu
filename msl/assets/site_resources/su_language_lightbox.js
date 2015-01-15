$(document).ready(function()
{
	console.log('welcome to su_language_lightbox!');
	if (($('#language_lightbox_blocker').length < 1) && ((window.location.href.indexOf("/mysociety/french") > -1) || (($('.language_english').length > 0) && ($('.language_welsh').length > 0))))
	{
		var lang = getLanguageCookie();
		console.log('lang: "' + lang + '"');
		$('ul.menu-far-right :nth-child(5)').after('<li>' + 
														'<a href="javascript:void(0)" onclick="switchLanguageAndCookieTo(\'welsh\');">' + 
															'<img src="http://www.swansea-union.co.uk/stylesheet/su/welsh.png" class="lang_image" id="welsh_flag" />' + 
														'</a>' + 
														'<a href="javascript:void(0)" onclick="switchLanguageAndCookieTo(\'english\');">' + 
															'<img src="http://www.swansea-union.co.uk/stylesheet/su/english.png" class="lang_image" id="english_flag" />' + 
														'</a>' + 
													'</li>');
		//line below *should* cover everything, including non-existent cookies, corrupt cookies, edited cookies, etc.
		if ((lang != "english") && (lang != "welsh"))
		{
			//default to english, sorry welsh speakers, it's only for a second!
			console.log('no language cookie detected, defaulting to english');
			switchLanguageAndCookieTo('english');
			showLanguageChoiceLightbox();
		}
		else
		{
			console.log('language cookie detected, value = ' + lang);
			switchLanguageTo(lang);
		}
	}
});

function switchLanguageAndCookieTo(lang)
{
	var date = new Date();
	date.setTime(date.getTime() + (24*60*60*1000*30)); //cookie lasts a month
	document.cookie = "language=" + lang + "; path=/; expires=" + date.toGMTString() + ";";
	$('#language_lightbox_blocker').remove();
	switchLanguageTo(lang);
}

function switchLanguageTo(lang)
{
	if (lang == 'welsh')
	{
		console.log('showing welsh text, showing british flag');
		$('.language_welsh').show();
		$('#welsh_flag').hide();
		$('.language_english').hide();
		$('#english_flag').show();
	}
	else
	{
		if (lang == 'english')
		{
			console.log('showing english text, showing welsh flag');
			$('.language_welsh').hide();
			$('.language_english').show();
			$('#welsh_flag').show();
			$('#english_flag').hide();
		}
		else
		{
			console.log('showing in panic');
			$('.language_welsh').hide();
			$('.language_english').show();
			$('#welsh_flag').show();
			$('#english_flag').hide();
		}
	}
}

function getLanguageCookie()
{
	var cookieArray = document.cookie.split(';');
	for (var i = 0; i < cookieArray.length; i++)
	{
		var cookieParts = cookieArray[i].trim().split("=");
		console.log('cookie #' + i + 1);
		console.log('cookieParts[0]: "' + cookieParts[0] + '"');
		console.log('cookieParts[1]: "' + cookieParts[1] +'"');
		if (cookieParts[0] == 'language')
		{
			return cookieParts[1];
		}
	}
	return "";
}

function showLanguageChoiceLightbox()
{
   if (($('#language_lightbox_blocker').length < 1) && ((window.location.href.indexOf("/mysociety/french") > -1) || (($('.language_english').length > 0) && ($('.language_welsh').length > 0))))
	{
		//one great big string!
		var lightbox = 
		'<div id="language_lightbox_blocker">' +
			'<div id="language_lightbox_content">' + 
				'<p>Please select a language to browse the site in. </p>' +
				'<p>Note that the Welsh section of the site is still under construction, and not all pages will have bilingual content.</p>' +
				'<p>We\'re working on it though!</p>' +
				'<a href="javascript:void(0)" onclick="switchLanguageAndCookieTo(\'english\');">English</a> | <a href="javascript:void(0)" onclick="switchLanguageAndCookieTo(\'welsh\');">Welsh</a>' + 
			'</div>' +	
		'</div>';
		//insert lightbox HTML into page
		$('body').append(lightbox);
	}
}
