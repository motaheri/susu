/**
	@author Toby Hughes, web@swansea-union.co.uk
	@owner Swansea University Students' Union (C) 2012
	@filename footer.js
	@description Site footer actions javascript
**/

$(document).ready(function(){

	$('.map-link').hover(function(){
		var map = $(this).attr('data-map');
		var address = $(this).attr('data-address');
		var tel = $(this).attr('data-tel');
		var fax = $(this).attr('data-fax');
		var email = $(this).attr('data-email');

		if(map){
			$('#footer-map').attr('src', map);
		}
		if(address){
			$('#footer-address').html(address.replace(/-n/gi, '<br />'));
		}
		if(tel){
			$('#footer-tel').html(tel);
		}
		if(fax){
			$('#footer-fax').html(fax);
		}
		if(email){
			$('#footer-email').html(email);
		}
	}, function(){
		$('#footer-map').attr('src', $('#footer-map').attr('data-map-default'));
		var address = $('.map-default').attr('data-');
		if(address){
			$('#footer-address').html(address).replace(/-n/gi, '<br />');
		}
		$('#footer-tel').html($('.map-default').attr('data-tel'));
		$('#footer-fax').html($('.map-default').attr('data-fax'));
		$('#footer-email').html($('.map-default').attr('data-email'));
	});

	$('.contact-us-button a').click(function(){
		$('#fadeout').width($('#msl-container').width()+'px');
		$('#fadeout').height($('#msl-container-inner').height() + 91 + 360);
		$('#fadeout').fadeIn(400);
		$('#msl-lightbox').fadeIn(400);
		return false;
	});

});

function hideLightbox(){
	$('#fadeout').fadeOut(400);
	$('#msl-lightbox').fadeOut(400);
};
