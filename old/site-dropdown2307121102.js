/**
	@author Toby Hughes, web@swansea-union.co.uk
	@owner Swansea University Students' Union (C) 2012
	@filename metro.js
	@description Metro Scroller jQuery Library
**/

var MetroDropdown = {};

MetroDropdown.dropped = false;

MetroDropdown.dropDown = function(){
	MetroDropdown.dropped = true;
	var h = $('#msl-masthead-dropdown').height();
	$('#msl-masthead').animate({height: '+='+h});
	$('#msl-light-gray').animate({top: '+='+h});
	$('#msl-container').animate({top: '+='+h});
};

MetroDropdown.dropDownNoAnimate = function(){
	MetroDropdown.dropped = true;
	var h = $('#msl-masthead-dropdown').height();
	var h2 = $('#msl-masthead').height() + h;
	$('#msl-masthead').height(h2);
	var h2 = $('#msl-light-gray').offset();
	h2.top = h2.top + h;
	$('#msl-light-gray').offset(h2);
	var o = $('#msl-container').offset();
	o.top = o.top + h;
	$('#msl-container').offset(o);
	//$('#msl-container').animate({top: '+='+h});
};

MetroDropdown.closeDropDown = function(){
	MetroDropdown.dropped = false;
	var h = $('#msl-masthead-dropdown').height();
	$('#msl-masthead').animate({height: '-='+h});
	$('#msl-container').animate({top: '-='+h});
	$('#msl-light-gray').animate({top: '-='+h});
};


/** Let's load this up! **/

$(document).ready(function(){
	$('#susu-main-nav .login a').click(function(){
		if(MetroDropdown.dropped==true){
			MetroDropdown.closeDropDown();
		} else {
			MetroDropdown.dropDown();
		}
		
		return false;
	});

	$('div#susu-main-nav li a').append('<div class="line"></div>');

	var d = new Date();
	var curr_date = d.getDate();
	var m_names = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
	var d_names = new Array("Sunday", "Monday", "Tuesday","Wednesday", "Thursday", "Friday", "Saturday");
	var sup = "";
	if (curr_date == 1 || curr_date == 21 || curr_date ==31) {
   		sup = "st";
   	} else if (curr_date == 2 || curr_date == 22) {
   		sup = "nd";
	} else if (curr_date == 3 || curr_date == 23) {
   		sup = "rd";
   	} else {
   		sup = "th";
   	}
	d = d_names[d.getDay()] + " " + curr_date + sup + " " + m_names[d.getMonth()];
	$('span.date').html(d);

	if($('.sidepanel .msl_warning').length>0){
		MetroDropdown.dropDownNoAnimate();
	}

	var x = document.URL.split('/');
	if(x.length>4){
		x = x[3];
		$('body').addClass('section-' + x);
	}
});

/** Let's customise the user nav too (MSL Widget!) **/

$(document).ready(function() {
	if($('.controlpanel').length>0){ $('.login a span.dotted').html('Account'); $('.login a').addClass('loggedin'); }	
	checkLogin = $('.sidepanel.controlpanel');
	if (checkLogin.length) {
		myGreeting = $('.sidepanel.controlpanel p').text();
		pattern = /(\bGood\W)?(\bmorning\W)?(\bafternoon\W)?(\bevening\W)?/g;
		myName = myGreeting.replace(pattern, "").slice(0, -1);
		myName = myName.replace("Happy Birthday", "");
		//$('#susu-main-nav .login a').html(myName);
	}
});
