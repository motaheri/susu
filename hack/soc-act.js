$(document).ready(function () {
    $('.susu-member-list h3').each(function (index, value) {
        var title = $(this).html();
        var person = $(this).next().find('li');
        var name = person.find('dl dt a').html();
        var email = person.find('dl dd a').html();
        var img = person.find('.badge_avatar').attr('src');
        var i = 0;
        if (index > 0) {
            i = 2;
        }
        var fname = name.split(' ')[0];
        var lname = name.replace(fname + ' ', '');
        var prefix = email.split('@')[0].toLowerCase();
        var domain = email.split('@')[1].toLowerCase();
        var contact_item = $('.contact-item:eq(' + i + ')');
        contact_item.find('.contact-item-pic').html('<img src="' + img + '" />');
        contact_item.find('.contact-item-title').html(title);
        contact_item.find('.contact-item-details-fname').html(fname + '<br> <span class="contact-item-details-lname">' + lname + '</span>');
        contact_item.find('.contact-item-title').html(title);
        contact_item.find('.contact-item-email a').html(prefix + '<br> <span class="small">@' + domain + '</span>');
        contact_item.find('.contact-item-email a').attr('href', 'mailto:' + email);
        contact_item.find('.contact-item-details a:eq(0)').attr('href', '/union/officers/' + name.replace(' ', '').toLowerCase() + '/');
    });
    $('.ss-member-list h3').each(function (index, value) {
        var title = $(this).html();
        var person = $(this).next().find('li');
        var name = person.find('dl dt a').html();
        var email = person.find('dl dd a').html();
        var img = person.find('.badge_avatar').attr('src');
        var i = 3;
        var fname = name.split(' ')[0];
        var lname = name.replace(fname + ' ', '');
        var prefix = email.split('@')[0].toLowerCase();
        var domain = email.split('@')[1].toLowerCase();
        var contact_item = $('.contact-item:eq(' + i + ')');
        contact_item.find('.contact-item-pic').html('<img src="' + img + '" />');
        contact_item.find('.contact-item-title').html(title);
        contact_item.find('.contact-item-details-fname').html(fname + '<br> <span class="contact-item-details-lname">' + lname + '</span>');
        contact_item.find('.contact-item-title').html(title);
        contact_item.find('.contact-item-email a').html(prefix + '<br> <span class="small">@' + domain + '</span>');
        contact_item.find('.contact-item-email a').attr('href', 'mailto:' + email);
        contact_item.find('.contact-item-details a:eq(0)').attr('href', '#');
    });
    $('.soc-member-list h3').each(function (index, value) {
        var title = $(this).html();
        var person = $(this).next().find('li');
        var name = person.find('dl dt a').html();
        var email = person.find('dl dd a').html();
        var img = person.find('.badge_avatar').attr('src');
        var i = 1;
        var fname = name.split(' ')[0];
        var lname = name.replace(fname + ' ', '');
        var prefix = email.split('@')[0].toLowerCase();
        var domain = email.split('@')[1].toLowerCase();
        var contact_item = $('.contact-item:eq(' + i + ')');
        contact_item.find('.contact-item-pic').html('<img src="' + img + '" />');
        contact_item.find('.contact-item-title').html(title);
        contact_item.find('.contact-item-details-fname').html(fname + '<br> <span class="contact-item-details-lname">' + lname + '</span>');
        contact_item.find('.contact-item-title').html(title);
        contact_item.find('.contact-item-email a').html(prefix + '<br> <span class="small">@' + domain + '</span>');
        contact_item.find('.contact-item-email a').attr('href', 'mailto:' + email);
        contact_item.find('.contact-item-details a:eq(0)').attr('href', '#');
    });
	
});

// ACTIVITIES - SOCIETIES
var activities_cat_society = [];
var activities_cat_sport = [];
var activities_data_society = [];
var activities_data_sport = [];

var activities_logos = {
	'Academic': '/stylesheet/metro/activities-soc-academic.png',
	'Charitable': '/stylesheet/metro/activities-soc-charitable.png',
	'Faith & Cultural': '/stylesheet/metro/activities-soc-faith.png',
	'Hobbies & Interests': '/stylesheet/metro/activities-soc-hobbies.png',
	'Media': '/stylesheet/metro/activities-soc-media.png',
	'Performing Arts': '/stylesheet/metro/activities-soc-performing.png',
	'Subject & Educational': '/stylesheet/metro/activities-soc-subject.png',
	'Political & Campaigning': '/stylesheet/metro/activities-soc-political.png',
	'Ball Based Sports': '/stylesheet/metro/activities-sport-ball.png',
	'Martial Arts': '/stylesheet/metro/activities-sport-martial.png',
	'Other Sports': '/stylesheet/metro/activities-sport-other.png',
	'Water Sports': '/stylesheet/metro/activities-sport-water.png'
};

/*
 * Initialisation
 */
$(document).ready(function(){
	// load sport categories
	$('#msl-activities-data-sport').find('li.msl-listing-category h3').each(function() {
		if ($(this).text() == 'Not categorised') return;
		activities_cat_sport.push($(this).text());
	});
	// load sports
	$('#msl-activities-data-sport').find('a.msl-listingitem-link').each(function() {
		var activity = new Object();
		activity.type = 'Sport';
		activity.name = $(this).text();
		activity.category = $(this).parent().prevAll('.msl-listing-category').first().find('h3').text();
		if (activity.category == 'Not categorised') return;
		activity.logo = $(this).parent().prev().find('img').attr('src');
		activity.link = $(this).attr('href');
		if ($(this).parent().find('.msl-listingitem-description').length == 1)
			activity.desc = $(this).parent().find('.msl-listingitem-description').text();
		else
			activity.desc = '';
		activities_data_sport.push(activity);
	});
	// load society categories
	$('#msl-activities-data-society').find('li.msl-listing-category h3').each(function() {
		if ($(this).text() == 'Not categorised') return;
		activities_cat_society.push($(this).text());
	});
	// load societies
	$('#msl-activities-data-society').find('a.msl-listingitem-link').each(function() {
		var activity = new Object();
		activity.type = 'Society';
		activity.name = $(this).text();
		activity.category = $(this).parent().prevAll('.msl-listing-category').first().find('h3').text();
		if (activity.category == 'Not categorised') return;
		activity.logo = $(this).parent().prev().find('img').attr('src');
		activity.link = $(this).attr('href');
		if ($(this).parent().find('.msl-listingitem-description').length == 1)
			activity.desc = $(this).parent().find('.msl-listingitem-description').text();
		else
			activity.desc = '';
		activities_data_society.push(activity);
	});
	$('#msl-activities-nav ul li.purple').click(function(e) {
		e.preventDefault();
		$('#msl-activities-content').show();
		$('#startsoc,#startsport').hide();
		activities_ShowSocietyCategories();
		$('#msl-activities-nav ul li.green').removeClass('selected');
		$('#msl-activities-nav ul li.purple').addClass('selected');
		startSoc();
	});
	$('#msl-activities-nav ul li.green').click(function(e) {
		e.preventDefault();
		$('#msl-activities-content').show();
		$('#startsoc,#startsport').hide();
		activities_ShowSportCategories();
		$('#msl-activities-nav ul li.purple').removeClass('selected');
		$('#msl-activities-nav ul li.green').addClass('selected');
		startSport();
	});
	activities_ShowSocietyCategories();
	startSoc();
	startSport();
});


function startSoc(){
	$('#Start-A-Society').click(function(e) {
		e.preventDefault();
		$('#startsoc').show();
		$('#msl-activities-content').hide();
	});
}
function startSport(){
	$('#Start-A-Sport').click(function(e) {
		e.preventDefault();
		$('#startsport').show();
		$('#msl-activities-content').hide();
	});
}


/*
 * Populate content with the society categories
 */
function activities_ShowSocietyCategories() {
	$('#msl-activities-content').html('');
	$.each(activities_cat_society, function(i, v) {
		var logo = 'http://placehold.it/220x161';
		if (activities_logos[v] != null)
			logo = activities_logos[v];
		$('#msl-activities-content').first().append(
			activities_MakeSocietyCategory(v, logo)
		);
	});
	/* Mo add plus sign */
	$('#msl-activities-content').first().append(
		activities_MakeSocietyCategory('Start A Society','http://www.swansea-union.co.uk/stylesheet/metro/add-society.png')
	);
	$('.msl-activities-cat-link').unbind('click');
	$('.msl-activities-cat-link').not('#Start-A-Society, #Start-A-Sport').click(function(e) {
		e.preventDefault();
		activities_ShowSocieties($(this).find('.msl-activities-cat-society').text());
	});
	/*
	$('#Start-A-Society').click(function(e) {
		e.preventDefault();
		if($('#startsoc').length){
			alert('click');
		}else{
			alert('no soc');
		}
		$('#startsoc').show().css('display','block');
	});
	*/
}

/*
 * Populate content with the sport categories
 */
function activities_ShowSportCategories() {
	$('#msl-activities-content').html('');
	$.each(activities_cat_sport, function(i, v) {
		var logo = 'http://placehold.it/220x161';
		if (activities_logos[v] != null)
			logo = activities_logos[v];
		$('#msl-activities-content').first().append(
			activities_MakeSportCategory(v, logo)
		);	
	});
	/* Mo add plus sign */
	$('#msl-activities-content').first().append(
		activities_MakeSportCategory('Start A Sport','http://www.swansea-union.co.uk/stylesheet/metro/add-sport.png')
	);
	
	$('.msl-activities-cat-link').unbind('click');
	$('.msl-activities-cat-link').not('#Start-A-Society, #Start-A-Sport').click(function(e) {
		e.preventDefault();
		activities_ShowSports($(this).find('.msl-activities-cat-sport').text());
	});
	/*
	$('#Start-A-Sport').click(function(e) {
		e.preventDefault();
		if($('#startsoc').length){
			alert('click');
		}else{
			alert('no sport');
		}
		$('#startsoc').show().css('display','block');
	});
	*/
}

/*
 * Populate content with the societies for the given category
 */
function activities_ShowSocieties(catName) {
	$('#msl-activities-content').html('');
	$.each(activities_SocietyList(catName), function(i, item) {
		$('#msl-activities-content').first().append(
			activites_MakeSociety(catName, item.name, activites_Left(item.desc, 70), item.logo, item.link)
		);
	});
}

/*
 * Populate content with the sports for the given category
 */
function activities_ShowSports(catName) {
	$('#msl-activities-content').html('');
	$.each(activities_SportList(catName), function(i, item) {
		$('#msl-activities-content').first().append(
			activites_MakeSport(catName, item.name, activites_Left(item.desc, 70), item.logo, item.link)
		);
	});
}

/*
 * Get the societies data for the given category
 */
function activities_SocietyList(catName) {
	if (activities_data_society == null || activities_data_society.length == 0)
		return [];
	return $.grep(activities_data_society, function(item) {
		return item.category == catName;
	});
}

/*
 * Get the sports data for the given category
 */
function activities_SportList(catName) {
	if (activities_data_sport == null || activities_data_sport.length == 0)
		return [];
	return $.grep(activities_data_sport, function(item) {
		return item.category == catName;
	});
}

function activities_MakeSocietyCategory(catName, catLogo) {
	catID = catName.replace(/ /g,"-");
	var output = '<div class="grid_2 msl-activities-cat">';
	output += '<a href="#" id="' + catID + '" class="msl-activities-cat-link">';
	output += '<img src="' + catLogo + '" />';
	output += '<div class="msl-activities-cat-society">' + catName + '</div>';
	output += '</a></div>';
	return output;
}

function activities_MakeSportCategory(catName, catLogo) {
	catID = catName.replace(/ /g,"-");
	var output = '<div class="grid_2 msl-activities-cat">';
	output += '<a href="#" id="' + catID + '" class="msl-activities-cat-link">';
	output += '<img src="' + catLogo + '" />';
	output += '<div class="msl-activities-cat-sport">' + catName + '</div>';
	output += '</a></div>';
	return output;
}

function activites_MakeSociety(orgType, orgName, orgDesc, orgLogo, orgLink) {
        if (orgLogo.indexOf('default_grouping_logo') !== -1){
           orgLogo = 'http://www.swansea-union.co.uk/stylesheet/metro/su-soc-act-default.jpg';
         }
	var output = '<div class="grid_2 msl-activities-org">';
	output += '<div class="msl-activities-org-type">' + orgType + '</div>';
	output += '<a href="' + orgLink + '">';
	output += '<div class="msl-activities-org-logo" style="background: url(\'' + orgLogo + '\') no-repeat center;"></div>';
	output += '<div class="msl-activities-org-name society">' + orgName + '</div>';
	output += '</a>';
	if (orgDesc != null && orgDesc.length > 0)
		output += '<div class="msl-activities-org-desc">' + orgDesc + '</div>';
	else
		output += '<div class="msl-activities-org-desc" style="background: white;">' + orgDesc + '</div>';
	output += '</div>';
	return output;
}

function activites_MakeSport(orgType, orgName, orgDesc, orgLogo, orgLink) {
        if (orgLogo.indexOf('default_grouping_logo') !== -1){
           orgLogo = 'http://www.swansea-union.co.uk/stylesheet/metro/su-soc-act-default.jpg';
         }
	var output = '<div class="grid_2 msl-activities-org">';
	output += '<div class="msl-activities-org-type">' + orgType + '</div>';
	output += '<a href="' + orgLink + '">';
	output += '<div class="msl-activities-org-logo" style="background: url(\'' + orgLogo + '\') no-repeat center;"></div>';
	output += '<div class="msl-activities-org-name sport">' + orgName + '</div>';
	output += '</a>';
	if (orgDesc != null && orgDesc.length > 0)
		output += '<div class="msl-activities-org-desc">' + orgDesc + '</div>';
	else
		output += '<div class="msl-activities-org-desc" style="background: white;">' + orgDesc + '</div>';
	output += '</div>';
	return output;
}

function activites_Left(str, n){
	if (n <= 0)
	    return "";
	else if (n > String(str).length)
	    return str;
	else
	    return String(str).substring(0, n) + '...';
}