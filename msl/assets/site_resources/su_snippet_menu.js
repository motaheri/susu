/*
 * MOBILE MENU START
 */
$(document).ready(function() {
	if (typeof $('#su-mobile-menu').menufication == 'function') { 
		// Run only on Pages that Need it (don't run on API page)
		$(document).bind('menufication-done', function(e) {
			SU_Data.basket.updateBasketQty();
		});
		$(document).bind('menufication-reset', function(e) {
			SU_Data.basket.updateBasketQty();
		});
		$(document).bind('menufication-reapply', function(e) {
			SU_Data.basket.updateBasketQty();
		});
		$('#su-mobile-menu').menufication({
			childMenuSupport: true,
			childMenuSelector: "su-mobile-menu-sub",
			hideDefaultMenu: true,
			triggerWidth: 683,
			onlyMobile: false,
			enableSwipe: false, // conflicts with sliders
			menuText: "Swansea University Students' Union"
		});
	}
});
/*
 * MOBILE MENU END
 */

/*
 * MENU JAVASCRIPT
 */
$(document).ready(function(){
	

	$('#menu li').not('#menu-logo').not('.menu-content').on('click',function(e){
	
		var menuLink = $(this).children('a').attr('rel');
		if(menuLink != 'page'){
			e.preventDefault();
			$('#menu li').removeClass('menu-link-hover'); 
			if($('.menu-content.'+menuLink).is(":visible")){
				$('.menu-content.'+menuLink).hide();
				$.mask.close();
			}else{
				$('#menu li').removeClass('menu-link-hover');
				$(this).addClass('menu-link-hover');
				$('.menu-content').hide();
				$('.menu-content.'+menuLink).show(); 
				$('#menu').expose();
			}
		}
	});
	
	$('body').not('.menu-content').click(function() {
 
		$('#menu li').removeClass('menu-link-hover');
		if($('.menu-content').is(":visible")){
			$('.menu-content').hide();
			$.mask.close();
		}
	});
	 
	$('#menu,.menu-content,.menu-content a').click(function(event){
		event.stopPropagation();
	});
});

  
/*
Type Ahead
*/
$(document).ready(function () {
    var ctrlDown = false;
    var ctrlKey = 17, vKey = 86, cKey = 67;
	$(document).keydown(function (e){
		var anyInputFocus = $('input, textarea').is(':focus');
		if(!anyInputFocus){
			$(document).keydown(function(e){
				if (e.keyCode == ctrlKey){ctrlDown = true;}
			}).keyup(function(e){
				if (e.keyCode ==wctrlKey){ctrlDown = false;}
			});

			var copyPaste = new Boolean(ctrlDown && (e.keyCode == vKey || e.keyCode == cKey));
			console.log('copyPaste ' + copyPaste);
			if(!copyPaste){ // Not interested in Copy and Paste
				if(e.keyCode > 17 || e.keyCode < 16){ // Not interested in Ctrl or Shift
					if(e.keyCode > 40 || e.keyCode < 37){ // Not interested in the navigational arrow keys 
						$('.stts').hide();
						$('#ss-input').show();
						$('#ss-input').focus();
					}
				}
			}
		}
	}).keyup(function(e){
        if (e.keyCode == ctrlKey){ctrlDown = false;}
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
   var defaultImg = $('.teaser-image img').attr('src');
   var defaultTxt = $('#menu-page-teaser .teaser-text p').html();
   $('#menu-items li').each(function() {
	  var $img = $(this).find('img');
	  if($img.attr('src')){
			var link = $img.attr('src').replace("../","/");
		}else{
			var link = '';
		}
	  var description = $(this).find('.msl-imagenav-description').text().replace(/\|/g,"</br>");
	  //alert(description);
	  $(this).hover(
		function(){
			$('.teaser-image img').attr("src",link);
			$('.teaser-image img').show();
			if ($.trim(description).length){
				$('#menu-page-teaser .teaser-text p').html(description);
				}else{
				$('#menu-page-teaser .teaser-text p').html(defaultTxt);
				}
			$('#menu-page-teaser .teaser-text p').show();
			return false;
		},function(){
			$('.teaser-image img').attr("src",defaultImg);
			$('.teaser-image img').show();
			$('#menu-page-teaser .teaser-text p').html(defaultTxt);
			$('#menu-page-teaser .teaser-text p').show();
		}
		
	  );
   });
   
   
   
   
   
	function reloadLogin(){
		/*
		currentAddress = document.location.href;
		window.location.href = currentAddress + "#login";
		*/
	}
			

	$('#login-container .login-button-group .login-button').not('.login-as').on('click',function(e){
			e.preventDefault();
			//$('#login-container .login-button-group li').removeClass('menu-link-hover'); 
			var menuLink = $(this).text().toLowerCase().replace(/ /g,"-");
			if($('.'+menuLink).is(":visible")){
				//$('.'+menuLink).hide();
				//$.mask.close();
			}else{
				//$('#login-container .login-button-group li').removeClass('menu-link-hover');
				//$(this).addClass('menu-link-hover');
				$('.login-content').hide();
				$('.'+menuLink).show();
				/*$('#menu').expose();*/
			}
	});
	
});	

/**
	Some Basket Functions
**/
/* Moved to SU_Data
	function updateBasketQty(){
		var qtyTotal = 0;
		$(".menu-content.basket .qty").each(function() {
			qtyTotal += parseInt($(this).text().replace( /^\D+/g, ''));
			if(qtyTotal > 0){
				$('.basket-count').text(qtyTotal);
				$('.menu-item-basket a').addClass('gold-underline');
			}else{
				$('.basket-count').text('');
				$('.menu-item-basket a').removeClass('gold-underline');
			}
		});
	}
$(document).ready(function() {
	updateBasketQty();
});	
*/