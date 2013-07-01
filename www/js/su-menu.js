/*
 * MOBILE MENU START
 */
(function($) {
	$(document).ready(function() {
		$('#su-mobile-menu').menufication({
			childMenuSupport: true,
			childMenuSelector: "su-mobile-menu-sub",
			hideDefaultMenu: true,
			triggerWidth: 683,
			onlyMobile: false,
			menuText: "Swansea University Students' Union"
		});
	})
})(jQuery);
 /*
  * MOBILE MENU END
  */

/*
 * MENU JAVASCRIPT
 */
$(document).ready(function(){
	

	$('#menu li').not('#menu-logo').on('click',function(e){
	
		var linkRel = $(this).children('a').attr('rel');
		if(linkRel != 'page'){
			e.preventDefault();
			$('#menu li').removeClass('menu-link-hover'); 
			var menuLink = $(this).text().toLowerCase();
			if($('.'+menuLink).is(":visible")){
				$('.'+menuLink).hide();
				$.mask.close();
			}else{
				$('#menu li').removeClass('menu-link-hover');
				$(this).addClass('menu-link-hover');
				$('.menu-content').hide();
				$('.'+menuLink).show(); 
				$('#menu').expose();
			}
		}
	});
	
	$('html').click(function() {
		$('#menu li').removeClass('menu-link-hover');
		if($('.menu-content').is(":visible")){
			$('.menu-content').hide();
			$.mask.close();
		}
	});
	 
	$('#menu-right').click(function(event){
		event.stopPropagation();
	});
	
	/*
	// Create the dropdown base
	$("<select />").appendTo("#mobile-nav");

	// Create default option  
	$("<option />", {
	   "selected": "selected",
	   "value"   : "",
	   "text"    : "Click to Browse.."
	}).appendTo("#mobile-nav select");

	// Populate dropdown with menu items
	$("#menu-pages li a").each(function() {
	 var el = $(this);
	 $("<option />", {
		 "value"   : el.attr("href"),
		 "text"    : el.text()
	 }).appendTo("#mobile-nav select");
	});
	*/
});

  
/*
Type Ahead
*/
$(document).ready(function () {
	$(document).keydown(function (e){
		$('.stts').hide();
		$('#ss-input').show();
		$('#ss-input').focus();
	});
	$('#ss-input').focusout(function() {
		if ($.trim($(this).val()).length == 0){
			$('#ss-input').hide();
			$('.stts').show();
		}
	});
	$('#search-box').click(function() {
		$('.stts').hide();
		$('#ss-input').show().focus();
	});
	
	// Grab activities and url map from SU_Data
	var activitiesList = SU_Data.getActivities();
	var societiesList = activitiesList.map(function(d) { return d.Name; });
	var societiesUrl = activitiesList.map(function(d) { return d.Link; });
	
	// Activate TypeAhead with the societies list
	$('#ss-input').typeahead({
		source: societiesList,
		items: 8,
		maxlength: 2
	}).focus();
	
	// On Change Click Event
	var onChangeSoc = function(event) {
		var autoComText = event.target.value; 
		// Find the matching URL
		var listPos = $.inArray(autoComText, societiesList);
		// If position is undefined or if there is no matching URL, stop location change
		if(societiesUrl[listPos] != undefined){window.location.href = societiesUrl[listPos];}
	};
	$('#ss-input').on('change', onChangeSoc);
});
/*
End Type Ahead 
*/

/**
Change the Teaser Image and description in the Menu
**/

$(document).ready(function() {
   $('#menu-items li').each(function() {
	  var $img = $(this).find('img');
	  if($img.attr('src')){
			var link = $img.attr('src').replace("../","http://swansea-union.co.uk/");
		}else{
			var link = '';
		}
	  var description = $(this).find('.msl-imagenav-description').text();
	  //alert(description);
	  $(this).hover(
		function(){
			$('.teaser-image img').attr("src",link);
			$('.teaser-image img').show();
			$('#menu-page-teaser .teaser-text p').text(description);
			$('#menu-page-teaser .teaser-text p').show();
			return false;
		},function(){
			$('.teaser-image img').hide();
			$('#menu-page-teaser .teaser-text p').hide();
		}
		
	  );
   });
});	