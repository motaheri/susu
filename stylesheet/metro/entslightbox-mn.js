/* Toby Hughes' original lightbox code
   Last updated: 3rd October 2012 by Michael Nicholas
 */
 
/* initialise lightbox values */
var Lightbox = {};
Lightbox.mapInit = 0;

/* on load */
$(document).ready(function () {
	/* append the event lightbox div with dummy data */
	$('body').append('<div style="display:none;" id="fadeout-ents"></div><div id="msl-lightbox-ents" style="display:none;"><div id="msl-lightbox-ents-title">ILOVEMONDAYS<br /> <span id="msl-lightbox-ents-subtitle">UV Rave</span></div><div id="msl-lightbox-ents-toc"><strong>Terms and Conditions</strong></div><div id="msl-lightbox-ents-content"><div id="msl-lightbox-ents-content-title"><span id="msl-lightbox-ents-content-t-date">Mon 9th Jul </span><span id="msl-lightbox-ents-content-t-time">9pm</span><br /><span id="msl-lightbox-ents-content-t-venue">Oceana</span></div><span id="msl-lightbox-ents-content-text">lorem ipsum</span></div><div id="msl-lightbox-ents-footer">&nbsp;</div><div id="msl-lightbox-ents-image"><img src="http://swansea.ukmsl.net/asset/Event/6042/422619_300423750022251_74026777_n.jpeg" /></div><div id="msl-lightbox-ents-more">&nbsp;</div></div>');
	/* add click event handler for the box office links	 */
	$('.msl-boxoffice-item-info a, .ents-lightbox').click(function () {
		var a = $(this).attr('href');
		/* call lightbox function with event url as parameter */
		showEntsLightbox(a);
		return false;
	});

	/* add a click event handler to the darkened background to close the lightbox */
	$('#fadeout-ents').click(function(){  
		hideEntsLightbox();
	});
});

function hideEntsLightbox() {
	hideLightbox();
};

function showEntsLightbox(a) {
	console.log('showEntsLightbox(a = "' + a + '")');
	/* safety check, ignore if no link */
	if (a == null) return;
	if (a == '#' || a == '') return;
	/* call the event information page with an ajax request
	   we are going to pull the event data and plug it into our
	   lightbox */
	$.ajax({
		url: a,
		success: function (data) {
			if (data == null) return;
			/* using split to find the content between two tags */
			var x = data.split('<span class="msl-event-name">');
			/* make sure that that tag exists, then split again to get the content */
			if (x.length < 2) return;
			x = x[1].split('</span>');
			/* full event name */
			var ename = x[0];
			/* pull out the event subtitle */
			var y = x[0].split(' ');
			var p = y[0] + '<br /><span id="msl-lightbox-ents-subtitle">' + x[0].replace(y[0] + ' ', '').replace('- ','') + '</span>';
			/* populate our ents lightbox */
			$('#msl-lightbox-ents-title').html(p);
			
			/* retrieve event date */
			var d = new Date();
			var n = d.getFullYear();
			var x = data.split('<span class="msl-event-date">');
			x = x[1].split('</span>');
			$('#msl-lightbox-ents-content-t-date').html(x[0].replace(n, ''));
			/* event time */
			var x = data.split('<span class="msl-event-time">');
			if(x.length > 1){
				x = x[1].split('</span>')[0].split('-');
				$('#msl-lightbox-ents-content-t-time').html(' ' + x[0]);
			}
			/* event logo */
			var x = data.split('<span class="msl-event-logo">');
			var loadBrandImage = 0;
			if(x.length > 1) {
				x = x[1].split('</span>');
				x = x[0].split('src="');
				if(x.length > 1) {
					x = x[1].split('"');
					$('#msl-lightbox-ents-image img').attr('src', x[0]);
				} else {
					loadBrandImage = 1;
				}
			} else {
				loadBrandImage = 1;
			}
			/* event location */
			var x = data.split('msl-event-location">');
			if(x.length > 1) {
				x = x[1].split('</span>');
				$('#msl-lightbox-ents-content-t-venue').html(x[0]);
			}
			/* similar events, hidden div within event
			   this provides the content for the sidebar */
			var x = data.split('<!--sim_events-->');
			x = x[1].split('<!--sim_events-->');
			x = x[0].replace(/\.\.\/*/ig, '/ents/event/');
			$('#msl-lightbox-ents-more').html(x);
			/* sidebar click handlers, swap to that event */
			$('#msl-lightbox-ents-more a').unbind('click');
			$('#msl-lightbox-ents-more a').click(function(){
				var a = $(this).attr('href');
				hideEntsLightbox();
				showEntsLightbox(a);
				return false;	
			});
			/* if no related events */
			if($('#msl-lightbox-ents-more a').length==0) {
				$('#msl-lightbox-ents-more').html('<div class="lbox-none">No related events.</div>');
			}
			/* manual & horrible fix to stop hidden door events from showing in the related list*/
			else {
				/* foreach related event, check the name */
				$('#msl-lightbox-ents-more a').each(function (){
					if ($(this).text() == "peppermint/idols")
						$(this).parent().parent().parent().hide();
				});
			}
			var x = data.split('<!--STARTTEXT-->');
			x = x[1].split('<!--ENDTEXT-->');
			$('#msl-lightbox-ents-content-text').html(x[0]);
			/* special case logos for sin & ilovemondays */
			if(loadBrandImage==1){
				if(p=='Sin Savers' || p=='Sin<br /><span id="msl-lightbox-ents-subtitle">Savers</span>'){
					$('#msl-lightbox-ents-image img').attr('src', '/asset/EventBrand/0/527647_10150874850848579_1378156209_n.jpg');
					$('#msl-lightbox-ents-more dt a').prepend('<span class="event_image"><img src="/asset/EventBrand/0/527647_10150874850848579_1378156209_n.jpg" /><span>');
				}
				else if(p=='ilovemondays' || p=='ilovemondays<br /><span id="msl-lightbox-ents-subtitle">ilovemondays</span>'){
					$('#msl-lightbox-ents-image img').attr('src', '/asset/EventBrand/0/ilovemondays.jpg');
					$('#msl-lightbox-ents-more dt a').prepend('<span class="event_image"><img src="/asset/EventBrand/0/ilovemondays.jpg" /><span>');
				}
				/* default image if event doesn't have one*/
				else {
					$('#msl-lightbox-ents-image img').attr('src', 'http://www.swansea-union.co.uk/stylesheet/metro/blank.jpg');
				}
			}


			//now we need to load tickets
			//first of all, check in msl_notification exists (we'll just show this in place of tickets)
			var x = data.split('class="msl_notification"');
			if(x.length>1){
				x = x[1].split('</div>');
				$('#msl-lightbox-ents-footer').addClass('notification');
				$('#msl-lightbox-ents-footer').addClass('notification-alert');
				$('#msl-lightbox-ents-footer').html(x[0].replace('>',''));
			} else {
				//find the number of tickets (event_ticket)
				var x = data.split('<div class="event_ticket">');
				if(x.length==1){
					//if no tickets, set html
					$('#msl-lightbox-ents-footer').addClass('notification');
					$('#msl-lightbox-ents-footer').html('There are no tickets available for this event.');
				} else {
					//if tickets
					var tickets = [];
					var tickettypes = '<option selected>Select Ticket</option>';			
					for (var i = 0; i < x.length; i++) {
						var y = x[i].split('$rptTickets$');
						if(y.length>1){
							//this is a ticket
							var ticket = {};

							var y = x[i].split('</select>');
							y = y[1].split('<input');
							ticket.name = y[0];

							var y = x[i].split('id="');
							y = y[1].split('"');
							ticket.id = y[0];

							var y = x[i].split('_ddQty">');
							y = y[1].split('</select>');
							ticket.qty = y[0];
							tickets[ticket.id] = ticket;
							tickettypes = tickettypes + '<option value="' + ticket.id + '">' + ticket.name + '</option>';
						}
					}
					Lightbox.tickets = tickets;
					$('#msl-lightbox-ents-footer').html('<select id="lightbox-ticket-type">' + tickettypes + '</select><select id="lightbox-ticket-qty" disabled="disabled"></select><a href="#" id="lightbox-ticket-buy" class="disabled">Buy Tickets</a>');
					$('#lightbox-ticket-type').unbind('change');
					$('#lightbox-ticket-type').change(function(){
						var v = $('#lightbox-ticket-type').val();
						if(v=='Select Ticket'){
							$('#lightbox-ticket-qty').attr("disabled", "disabled");
						} else {
							$('#lightbox-ticket-qty').html(Lightbox.tickets[v].qty);
							$('#lightbox-ticket-qty').removeAttr("disabled");
							var v2 = $('#lightbox-ticket-qty').val();
							if(parseInt(v2)>0){
								$('#lightbox-ticket-buy').removeClass('disabled');
							} else {
								$('#lightbox-ticket-buy').addClass('disabled');
							}
						}					
					});
					$('#lightbox-ticket-qty').unbind('change');
					$('#lightbox-ticket-qty').change(function(){
						var v = $('#lightbox-ticket-qty').val();
						var v2 = $('#lightbox-ticket-type').val();
						if(v2=='Select Ticket'){
							v = 0;
						}
						if(parseInt(v)>0){
							$('#lightbox-ticket-buy').removeClass('disabled');
						} else {
							$('#lightbox-ticket-buy').addClass('disabled');
						}
					});
					$('#lightbox-ticket-buy').unbind('click');
					$('#lightbox-ticket-buy').click(function(){
						var v = $('#lightbox-ticket-qty').val();
						var v2 = $('#lightbox-ticket-type').val();
						if(!$(this).hasClass('disabled')){
							window.location = a + '?addBasketQty=' + v + '&addBasketType=' + v2;	
						}
						return false;
					});
				}
			}
			/* set fadeout for the dark background div */
			Lightbox.box = $('#msl-lightbox-ents');
			Lightbox.fadeout = $('#fadeout-ents');
				
			/* pull in the terms and conditions from another page, but only once */
			if (Lightbox.tocLoaded == null)
				Lightbox.tocLoaded = 0;
			if (Lightbox.tocLoaded == 0) {
				$.ajax({url:'/tac/events', success: function(data){
					var x = data.split('<span class="lightbox-text">');
					x = x[1].split('</span>');
					$('#msl-lightbox-ents-toc').html('<strong>Terms and Conditions</strong><br />' + x[0]);
					Lightbox.tocLoaded = 1;
				}});
			}
				
			$('#msl-lightbox-ents-content').scrollTop(0);
				
			$('#fadeout-ents').width($('#msl-container').width()+'px');
			$('#fadeout-ents').height($('#msl-container-inner').height() + 91 + 360);
			$('#fadeout-ents').fadeIn(400);
			$('#msl-lightbox-ents').fadeIn(400);
		}
	});
}
