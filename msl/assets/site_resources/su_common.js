
/*
 * URL #! NAVIGATION
 */

function resetHashUrl() {
	$.address.value('/ ');
}

function resetDeepLinks() {
	$('a[rel="deep"]').unbind('click');
	$('a[rel="deep"]').click(function(e) {
		$('.js_lb_overlay').remove();
		e.preventDefault();
		var url = $(this).attr('href');
		if ($.address.value() != url) {
			$.address.value(url == '/' ? '/ ' : url);
		}
	});
}

function contentHandler_Event(eventObj) {
	eventObj = eventObj.GetEvent();
	console.log(eventObj);
	
	$('.sulb-inner.event #sulb-ticketselect').html('');
	for (var i = 0; i < eventObj.Tickets.length; i++) {
		var ticketObj = eventObj.Tickets[i];
		$('.sulb-inner.event #sulb-ticketselect').append('<option data-index="' + i + '">'+ ticketObj.Name + ' (&pound;' + ticketObj.Price + ')</option>');
		$('.sulb-inner.event #sulb-ticketqty').html('');
		for (var j = 0; j < ticketObj.Quantities.length; j++) {
			$('.sulb-inner.event #sulb-ticketqty').append('<option>'+ ticketObj.Quantities[j] + '</option>');
		}
	}
	
	$('.sulb-inner.event .buy button').unbind('click');
	$('.sulb-inner.event .buy button').click(function () {
		$('.sulb-inner.event .buy-info').slideDown();
		$('.sulb-inner.event .buy button').unbind('click');
		$('.sulb-inner.event .buy button').click(function () {
			var ticketIndex = parseInt($('.sulb-inner.event #sulb-ticketselect option:selected').first().attr('data-index'));
			var ticketQty = parseInt($('.sulb-inner.event #sulb-ticketqty option:selected').text());
			console.log('AddToBasket() ' + ticketIndex + ':' + ticketQty);
			eventObj.AddToBasket(ticketIndex, ticketQty);
		});
	});
	$('img.poster').attr('src', 'http://www.swansea-union.co.uk' + eventObj.Image);
	$('.sulb-inner.event div.title').text(eventObj.Title);
	if (eventObj.FullText.length > 0) {
		$('.sulb-inner.event div.desc').html('<p class="info"></p>' + eventObj.FullText);
	}
	$('.sulb-inner.event p.info').text(eventObj.Location + ' - ' + eventObj.Date.format('d MMMM yyyy @ HH:MM'));
	
	$('.sulb-inner.event .sliderPhotoGallery').iosSlider('destroy');
	$('.sulb-inner.event .sliderPhotoGallery .slider').html('');
	$('.sulb-inner.event h2#sulb-eventgallery-title').text("Gallery - Loading...");
	SU_Data.social.getGalleryImages(eventObj.Brand, 15, function(d, albumName) {
		$('.sulb-inner.event h2#sulb-eventgallery-title').text("Gallery - Facebook: " + albumName);
		$.each(d, function(i, o) {
			$('.sulb-inner.event .sliderPhotoGallery .slider').append('<div class="slide' + (o.Height > o.Width ? ' portrait' : '') + '"><div class="slide-inner"><img class="img-rounded" src="' + o.Image + '" /></div></div>');
		});
		$('.sulb-inner.event .sliderPhotoGallery').iosSlider({
			snapToChildren: true,
			scrollbar: false,
			desktopClickDrag: true,
			infiniteSlider: false
		});
	});
	var relatedEvents = eventObj.GetRelatedEvents();
	$('.sulb-inner.event div.sulb-relatedEvents').html('');
	if (relatedEvents.length > 0) {
		$.each(relatedEvents, function(i, o) {
			var revent = $(document.createElement('div')).addClass('sulb-relatedevent');
			var relink = $(document.createElement('a')).attr('href', o.Link.replace('../', '')).attr('rel', 'deep');
			var reimage = $(document.createElement('img')).attr('src', 'http://www.swansea-union.co.uk' + o.Image);
			var retitle = $(document.createElement('div')).addClass('event-title').text(o.Title);
			var redate = $(document.createElement('div')).addClass('event-date').text(o.Date.format('dddd, d MMMM yyyy'));
			relink.append(reimage).append(retitle).append(redate);
			revent.append(relink);
			$('.sulb-inner.event div.sulb-relatedEvents').append(revent);
		});
	}
	suLightBox('#events-lightbox', eventObj);
	resetDeepLinks();
}

function contentHandler_Blog(blogObj) {
	var imgSrc = setUrlParameters(blogObj.Image, {thumbnail_width: 220, thumbnail_height: 311, resize_type: 'ResizeFitAll'});
	$('#blog-lightbox h2.title').html(blogObj.Title);
	$('#blog-lightbox img.lead').attr('src', 'http://www.swansea-union.co.uk' + imgSrc);
	$('#blog-lightbox p.info span.organisation').text(blogObj.Author);
	$('#blog-lightbox p.info span.date').text(blogObj.Date.format('dddd, dS mmmm yyyy'));
	$('#blog-lightbox div.desc').html(blogObj.Story);
	$('#blog-lightbox div.sulb-author').html(blogObj.Author);
	suLightBox('#blog-lightbox', blogObj);
}

function contentHandler_News(newsObj) {
	console.log(newsObj);
	var imgSrc = setUrlParameters(newsObj.Image, {thumbnail_width: 220, thumbnail_height: 311, resize_type: 'ResizeFitAll'});
	$('#news-lightbox h2.title').html(newsObj.Title);
	$('#news-lightbox img.lead').attr('src', 'http://www.swansea-union.co.uk' + imgSrc);
	$('#news-lightbox div.organisation').text(newsObj.Organisation);
	$('#news-lightbox div.date').text(newsObj.Date.format('dddd, dS mmmm yyyy'));
	$('#news-lightbox div.content').html(newsObj.Story);
	$('#news-lightbox div.sulb-author').html(newsObj.Organisation);
	suLightBox('#news-lightbox', newsObj);
}

function suLightBox(selector, data) {
	$(selector).lightbox_me({
		centered: true,
		overlayCSS: { background: 'black', opacity: 0.9 },
		onLoad: function() {
			$("body").css("overflow", "hidden");
		},
		onClose: function() {
			$("body").css("overflow", "auto");
			resetHashUrl();
			$('.sulb-inner.event .buy-info').hide();
		}
	});
}

$(document).ready(function() {
	$.address.strict(true);
	$.address.crawlable(true);
	$.address.change(function(event) {
		if (event.value == "/") return;
		console.log("Address Change: " + event.value);
		if (/^\/ents\/event\//i.test(event.value) ||
			/^\/events\//.test(event.value)) {
			// Find the event in the SU_Data object, if it exists.
			if (typeof SU_Data != "undefined") {
				if (SU_Data.hasEvents) {
					for (var eventList in SU_Data.eventData) {
						for (var obj in SU_Data.eventData[eventList]) {
							if (typeof SU_Data.eventData[eventList][obj] == 'object' && SU_Data.eventData[eventList][obj].Link.indexOf(event.value) !== -1) {
								contentHandler_Event(SU_Data.eventData[eventList][obj]);
								return;
							}
						}
					}
				}
			}
			// If not, redirect to the standalone Event page
			window.location = event.value;
		}
		else if (/^\/blogs\/blog\//i.test(event.value) ||
				 /^\/union\/officer\//i.test(event.value) ||
				 /^\/union\/officers\//i.test(event.value) ||
				 /^\/union\/pto\//i.test(event.value) ||
				 /^\/union\/fto\//i.test(event.value)) {
			console.log('CONTENT TRIGGER: Blog');
			// Find the news article in the SU_Data object, if it exists.
			if (typeof SU_Data != "undefined") {
				if (SU_Data.hasBlogs) {
					for (var blogList in SU_Data.blogData) {
						for (var obj in SU_Data.blogData[blogList]) {
							if (SU_Data.blogData[blogList][obj].Link.indexOf(event.value) !== -1) {
								contentHandler_Blog(SU_Data.blogData[blogList][obj]);
								return;
							}
						}
					}
				}
			}
		}
		else if (/^\/news\/article\//i.test(event.value)) {
			console.log('CONTENT TRIGGER: News');
			// Find the news article in the SU_Data object, if it exists.
			if (typeof SU_Data != "undefined") {
				if (SU_Data.hasNews) {
					for (var newsList in SU_Data.newsData) {
						for (var obj in SU_Data.newsData[newsList]) {
							if (SU_Data.newsData[newsList][obj].Link.indexOf(event.value) !== -1) {
								contentHandler_News(SU_Data.newsData[newsList][obj]);
								return;
							}
						}
					}
				}
			}
			// If not, redirect to the standalone News page
			window.location = event.value;
		}
		else {
			// If not, redirect to the standalone page
			//window.location = event.value;
		}
	});
	resetDeepLinks();
	
	/* Scroll to top */ 
	$('#back-up').click(function () {
		$('html, body').animate({ scrollTop: 0 }, 'slow');
	});
	$('#ctl00_ctl11_lnkForgottenPassword,#ctl00_ctl11_lnkForgottenPassword,#ctl00_ctl11_btnLogin').addClass('m-btn purple resetpass');
	
});


/*
 * HEADLINE WRAP TEXT
 */
jQuery.fn.wrapLines = function( openTag, closeTag )
{
	// Get words & tidy up
	var original = $(this).text();
	var words = $(this).text().match(/\S+/g);
	for (var i = 0; i < words.length; i++) {
		if (words[i] == "&") {
			words[i] == "and";
		}
	}
	
	// Remove all bar the first word
	$(this).text(words[0]);
	
	// Record height of the element
	var height = $(this).height();
	// Add words until height increases (ie. wraps)
	for (var i = 1; i < words.length; i++) {
		var currentLine = $(this).text();
		$(this).text(currentLine + ' ' + words[i]);
		if (this.height() == height) { // fits
		}
		else { // doesnt fit
			$(this).before(openTag + currentLine + ' ' + closeTag);
			$(this).text(words[i]);
		}
	}
	$(this).before(openTag + $(this).text() + ' ' + closeTag);
	
	// Remove original
	$(this).remove();
};

jQuery.fn.wrapLines2 = function( openTag, closeTag )
{
	var dummy = this.clone();
	dummy.css({
		top: -9999,
		left: -9999,
		position: 'absolute',
		width: this.width()
	});
	dummy.appendTo(this.parent());
	var text = dummy.text().match(/\S+\s+/g);
	var words = text.length,
		lastTopOffset = 0,
		lines = [],
		lineText = '';
	for (var i = 0; i < words; i++)
	{
		dummy.html(
			text.slice(0,i).join('') + text[i].trim().replace(/(\S)/, '$1<span/>') + text.slice(i+1).join('')
		);
		var topOffset = jQuery('span', dummy).offset().top;
		if (topOffset !== lastTopOffset && i != 0)
		{
			console.log('New Line: ' + lineText);
			lines.push(lineText);
			lineText = text[i];
		}
		else {
			lineText += text[i];
		}
		lastTopOffset = topOffset;
	}
	console.log('New Line: ' + lineText);
	lines.push(lineText);
	this.html(openTag + lines.join( closeTag + openTag ) + closeTag);
	$(dummy).remove();
};

function encode_utf8(s) {
	return unescape(encodeURIComponent(s));
}

function decode_utf8(s) {
	return decodeURIComponent(escape(s));
}

function escapeHtml(unsafe) {
	return unsafe
		.replace(/–/g, "-")
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}