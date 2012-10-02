Lightbox.tocLoaded = 0;

$(document).ready(function () {
	console.log('ents lightbox');

    $('body').append('<div style="display:none;" id="fadeout-ents"></div><div id="msl-lightbox-ents" style="display:none;"><div id="msl-lightbox-ents-title">ILOVEMONDAYS<br /> <span id="msl-lightbox-ents-subtitle">UV Rave</span></div><div id="msl-lightbox-ents-toc"><strong>Terms and Conditions</strong></div><div id="msl-lightbox-ents-content"><div id="msl-lightbox-ents-content-title"><span id="msl-lightbox-ents-content-t-date">Mon 9th Jul </span><span id="msl-lightbox-ents-content-t-time">9pm</span><br /><span id="msl-lightbox-ents-content-t-venue">Oceana</span></div><span id="msl-lightbox-ents-content-text">lorem ipsum</span></div><div id="msl-lightbox-ents-footer">&nbsp;</div><div id="msl-lightbox-ents-image"><img src="http://swansea.ukmsl.net/asset/Event/6042/422619_300423750022251_74026777_n.jpeg" /></div><div id="msl-lightbox-ents-more">&nbsp;</div></div>');

    $('.msl_eventlist a').click(function () {
        var a = $(this).attr('href');
        //console.log('ents lightbox');
        showEntsLightbox(a);
        return false;
    });

$('.ents-lightbox').click(function () {
        var a = $(this).attr('href');
        //console.log('ents lightbox');
        showEntsLightbox(a);
        return false;
    });

    
    $('#fadeout-ents').click(function(){
    	hideEntsLightbox();
    });
});

function hideEntsLightbox() {
    hideLightbox();
};


    function showEntsLightbox(a){
	$.ajax({
            url: a,
            success: function (data) {
                var x = data.split('<span class="msl-event-name">');
                x = x[1].split('</span>');
		var ename = x[0];
                var y = x[0].split(' ');
                var p = y[0] + '<br /><span id="msl-lightbox-ents-subtitle">' + x[0].replace(y[0] + ' ', '').replace('- ','') + '</span>';
                $('#msl-lightbox-ents-title').html(p);
                
                var d = new Date();
				var n = d.getFullYear();
                var x = data.split('<span class="msl-event-date">');
                x = x[1].split('</span>');
                $('#msl-lightbox-ents-content-t-date').html(x[0].replace(n, ''));
                
                var x = data.split('<span class="msl-event-time">');
		if(x.length>1){
                	x = x[1].split('</span>')[0].split('-');
                	$('#msl-lightbox-ents-content-t-time').html(' ' + x[0]);
		}
                
                var x = data.split('<span class="msl-event-logo">');
		var loadBrandImage = 0;
		if(x.length>1){
                	x = x[1].split('</span>');
                	x = x[0].split('src="');
			if(x.length>1){
                		x = x[1].split('"');
                		$('#msl-lightbox-ents-image img').attr('src', x[0]);
			} else {
				loadBrandImage = 1;
			}
		} else {
			loadBrandImage = 1;
		}
                
                var x = data.split('msl-event-location">');
		if(x.length>1){
                	x = x[1].split('</span>');
                	$('#msl-lightbox-ents-content-t-venue').html(x[0]);
		}

		var x = data.split('<!--sim_events-->');
                x = x[1].split('<!--sim_events-->');
		x = x[0].replace(/\.\.\/*/ig, '/ents/event/');
                $('#msl-lightbox-ents-more').html(x);

		$('#msl-lightbox-ents-more a').unbind('click');
		$('#msl-lightbox-ents-more a').click(function(){
			var a = $(this).attr('href');
			hideEntsLightbox();
			showEntsLightbox(a);
			return false;	
		});

		if($('#msl-lightbox-ents-more a').length==0){
			$('#msl-lightbox-ents-more').html('<div class="lbox-none">No related events.</div>');
		}
                
                var x = data.split('<!--STARTTEXT-->');
                x = x[1].split('<!--ENDTEXT-->');
                $('#msl-lightbox-ents-content-text').html(x[0]);

		if(loadBrandImage==1){
			console.log(p);
			if(p=='Sin Savers' || p=='Sin<br /><span id="msl-lightbox-ents-subtitle">Savers</span>'){
				$('#msl-lightbox-ents-image img').attr('src', '/asset/EventBrand/0/527647_10150874850848579_1378156209_n.jpg');
				$('#msl-lightbox-ents-more dt a').prepend('<span class="event_image"><img src="/asset/EventBrand/0/527647_10150874850848579_1378156209_n.jpg" /><span>');
			}
			if(p=='ilovemondays' || p=='ilovemondays<br /><span id="msl-lightbox-ents-subtitle">ilovemondays</span>'){
				$('#msl-lightbox-ents-image img').attr('src', '/asset/EventBrand/0/ilovemondays.jpg');
				$('#msl-lightbox-ents-more dt a').prepend('<span class="event_image"><img src="/asset/EventBrand/0/ilovemondays.jpg" /><span>');

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
				$('#lightbox-ticket-type').unbind('click');
				$('#lightbox-ticket-type').click(function(){
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
				$('#lightbox-ticket-qty').unbind('click');
				$('#lightbox-ticket-qty').click(function(){
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
                
                Lightbox.box = $('#msl-lightbox-ents');
				Lightbox.fadeout = $('#fadeout-ents');
				
				if(Lightbox.tocLoaded==0){
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

