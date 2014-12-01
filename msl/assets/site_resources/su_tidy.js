/*
	This little file tidies up the hideous overflowing Facebook links and unused social media boxes on the right of some pages.
	I could have gone rooting through a ton of pre-existing jQuery looking for where the contents of these boxes is set, 
	with no guarantee that I ever would, but life is too short.
	-PH
*/
$(document).ready(function()
{
	$('.varsityLinkIcon a.msl_web').each(function(index) 
	{
		var fbPattern = 	new RegExp(/((https?:\/\/)|(www\.)|(https?:\/\/www\.))?facebook\.[a-z\.]{2,}\/?(([a-z\d]+\/?)*(\.[a-z]{2,})?)(\?\w+\=\w+)*/);
		//var fbPattern = 	new RegExp(/.*facebook.*/); //IDIOT MODE ENGAGED
		var otherPattern = 	new RegExp(/((https?:\/\/)|(www\.)|(https?:\/\/www\.))([a-z\d\.\-]+)+\.[a-z\.]{2,}\/?(([a-z\d]+\/?)*(\.[a-z]{2,})?)(\?\w+\=\w+)*/);
		var hrefAttribute = $(this).attr('href');
		if (fbPattern.test(hrefAttribute))
		{
			console.log('yup');
			$(this).html('Visit our Facebook page');
		}
		else
		{
			if (otherPattern.test(hrefAttribute))
			{
			console.log('yupyup');
				$(this).html('Visit our website');
			}
			else
			{
				/*
					This is the nuclear option, but if someone messes 
					up their URL really badly I'd rather have the box 
					disappear than leave it lying around all malformed. For starters 
					they're more likely to email someone and ask WTF happened.
					
					This code as it stands should grab the varsityLinkIcon div 
					and hide it.
				*/
				console.log('yupyupyup');
				$(this).parent.css('display', 'none');
			}
		}
	});

	$('.varsityEmailIcon a.msl_email').each(function(index) 
	{
		console.log('email');
		var pattern = new RegExp(/mailto.*@swansea-union\.co\.uk/);
		console.log('pattern: ' + pattern);
		var hrefAttribute = $(this).attr('href');
		console.log('hrefAttribute: ' + hrefAttribute);
		if (pattern.test(hrefAttribute))
		{
		console.log('emailemail');
			$(this).html('Email the committee');
		}
		else
		{
			/*
				use our email system or get lost!
				...this probably needs to go, but it's 
				late so I'm not taking out the conditional
			*/
		console.log('emailemailemail');
			$(this).parent.css('display', 'none');
		}
	});

	$('.orgedit').each(function(index) 
	{
		var internalHTML = $(this).html();
		if ((internalHTML).length < 1)
		{
			$(this).css('display', 'none');
		}
		
	});
});