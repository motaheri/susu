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
		console.log('email section started');
		var pattern = new RegExp(/mailto.*@swansea-union\.co\.uk/);
		var hrefAttribute = $(this).attr('href');
		if (pattern.test(hrefAttribute))
		{
			console.log('email: got a hit');
			$(this).html('Email the committee');
		}
		else
		{
			console.log('email: invalid email detected, displaying anyway');
			$(this).html('Email the committee');
		}
	});

	$('.orgedit, .org-box').each(function(index) 
	{
		if ($(this).html().trim().length < 1)
		{
			$(this).css('display', 'none');
		}
	});

	$('.org-box .org-description').each(function(index) 
	{
		if ($(this).html().trim().length < 1)
		{
			$(this).children('.mslwidget').html('A full description will be posted soon!');
		}
	});
	
	/*
	this should NOT have to exist, but I cannot for the life of me find where the space between the 
	product-name and product-price spans is being eaten. Possible lead at su_content.js @ 339-357, su_common.js @280-316
	*/
	$('span.product-price').each(function(index)
	{
		console.log('product price: started');
		console.log('this.html(): ' + $(this).html());
		if ($(this).html().substring(0, 1) == '£')
		{
			console.log('product found without a space in front of it');
			$(this).html('&nbsp;' + $(this).html());
		}
	});
	
	/*
	Hide the fact that the Society "person" is a member of the committee. Not a problem, but it looks bad.
	*/
	$('.orgcommittee .mslwidget .msl-groupedmemberlist ul li:contains("Society")').hide();
});