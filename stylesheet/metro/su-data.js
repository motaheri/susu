/**
 * @class SU_Data
 * @author Michael Nicholas
 *
 * Retrieves data from MSL widgets within the current page, if any exist.
 *
 * Data is pulled from News and EventList widgets.
 *
 * The data will be loaded into arrays {eventData, newsData} as either eventObj or newsObj objects.
 * Can test if data is available using boolean variables {hasEvents, hasNews}
 * 
 * Widgets must be given a unique 'Wrapper div ID' in the widget configuration.
 * The div ID is the key value for that set of data within the arrays.
 *
 * Add to Basket uses a hidden iframe and window.postMessage to communicate with the events page
 * and trigger the appropriate add-to-basket button. The postMessage also sends back the new
 * basket html from the page loaded after triggering the add-to-basket button in the hidden frame.
 */

var SU_Data = {};

// Event Object
SU_Data.eventObj = function() {
	this.Title = '';		// Event name
	this.Description = '';	// Brief event description
	this.Location = '';		// Venue
	this.Date = '';			// Date
	this.Time = '';			// Time
	this.Image = '';		// Logo
	this.Link = '';			// Event link
	this.FullText = '';		// Full text description (not loaded by default)
	this.Tickets = [];		// Array of ticket objects (not loaded by default
	this.GetEvent = function() { return SU_Data.getFullEvent(this) };
	this.AddToBasket = function(type, quantity) { SU_Data.eventAddToBasket(this, type, quantity) };
}

// Ticket Object - child of eventObj
SU_Data.eventTicketObj = function() {
	this.Name = '';
	this.Price = '';
	this.Quantities = [];
	this.PurchaseID = '';
	this.QuantityID = '';
}

// News Object
SU_Data.newsObj = function() {
	this.Title = '';
	this.Description = '';
	this.Organisation = '';
	this.Story = '';
	this.Date = '';
	this.Image = '';
	this.Link = '';
	this.Tags = [];
}

// Blog Post Object
SU_Data.blogPostObj = function() {
	this.Title = '';
	this.Description = '';
	this.Author = '';
	this.AuthorLink = '';
	this.Story = '';
	this.Date = '';
	this.Image = '';
}

// Boolean variables to quickly identify if we have data
SU_Data.hasEvents = false;
SU_Data.hasNews = false
SU_Data.hasBlogPosts = false;

// Actual data arrays
SU_Data.eventData = {};
SU_Data.newsData = {};
SU_Data.blogPostData = {};

// Data transmission object for use with window.postMessage
SU_Data.messageObj = function() {
	this.Message = null; // Message Type string
	this.Data = null; // Data object (any type)
	this.Type = 'SU_Data postMessage';
};

/**
 * Parses any EventList widgets on the page and populates the eventData array with the data.
 */
SU_Data.findEventData = function() {
	$('.msl_eventlist').each(function() {
		// get the div ID of the parent, used to reference this data list, set in widget config
		var widgetId = null;
		if ($(this).parent().attr('id') != null) {
			widgetId = $(this).parent().attr('id');
		}
		else {
			console.log('Events widget is missing a div ID.');
			return;
		}
		// create an array for the events
		var events = [];
		// parse each event item
		$(this).find('.event_item').each(function(index) {
			// mark that we have an event
			SU_Data.hasEvents = true;
			// create and populate a new SU_Event object
			var event = new SU_Data.eventObj();
			event.Title = $(this).find('.msl_event_name').text();
			event.Description = $(this).find('.msl_event_description').text();
			event.Description = $.trim(event.Description.replace(/[\r\n\t]/g, ''));
			event.Location = $(this).find('.msl_event_location').text();
			event.Location = $.trim(event.Location.replace(/[\r\n\t]/g, ''));
			var dateValue = $(this).find('.msl_event_time').text();
			if (dateValue != null) {
				dateValue = $.trim(dateValue.replace(/[\r\n]/g, ''));
				var dateMatch = dateValue.match(/(\w+ \w+) ([\w:]+ - [\w:]+)/);
				if (dateMatch == null) {
					dateMatch = dateValue.match(/(\w+ \w+)/);
					if (dateMatch.length == 2) {
						event.Date = dateMatch[1];
					}
				}
				else {
					if (dateMatch.length == 3) {
						event.Date = dateMatch[1];
						event.Time = dateMatch[2];
					}
				}
			}
			event.Link = $(this).find('.msl_event_name').first().attr('href');
			if ($(this).find('img').length == 1) {
				event.Image = $(this).find('img').first().attr('src');
			}
			// push it into the events array
			events.push(event);
		});
		// add all the events to the eventData store, referenced using the widgetId
		SU_Data.eventData[widgetId] = events;
	});
}

/**
 * Given an eventObj object, this function makes an ajax call to the event page to retrieve
 * the full description and list of tickets on sale. This data is cached so it's only loaded
 * once per page
 * @param {eventObj} event The event object from one of the child lists in eventData.
 */
SU_Data.getFullEvent = function(event) {
	// Make sure this is an event object
	if (event.FullText == null || event.Link == null) return null;
	// Make sure we have an event link, and haven't got a description
	if (event.Link != '' && event.FullText == '') {
		// Make ajax call to the event page to get the data
		$.ajax({
			url: event.Link,
			async: false,
			success: function(data) {
				// make sure we got some content
				if (data == null) return;
				// get the event description
				event.FullText = $('.msl-event-description', data).html();
			    event.FullText = $.trim(event.FullText.replace(/[\r\n\t]/g, ''));
				// find any tickets on sale
				$('.event_ticket', data).each(function() {
					var ticket = new SU_Data.eventTicketObj();
					ticket.PurchaseID = $(this).find('input').attr('id');
					ticket.QuantityID = $(this).find('select').attr('id');
					var temp1 = new String($(this).clone().children().remove().end().text().trim());
					var temp2 = temp1.match(/([\d\.]+) \(([\w\s]+)\)/i);
					if (temp2 == null || temp2.length != 3) return;
					ticket.Name = temp2[2];
					ticket.Price = temp2[1];
					ticket.Quantities = $(this).find('option').map(function(index, value) { return parseInt($(value).text()) });
					event.Tickets.push(ticket);
				});
			}
		});
	}
	return event;
}

// contains the basket data to be transmitted (if there is any)
var eventAddToBasket_Data = null;

/**
 * Listener for window.postMessage events sent from the child iframe.
 */
SU_Data.eventAddToBasket_Callback = function(e) {
	if (e.source == window) {
		return;
	}
	if (e.data == null || e.data.Type != 'SU_Data postMessage' ) {
		return;
	}
	// get the message object
	var msg = e.data;
	// handle message
	if (msg.Message == 'EventBasketRequest'){
		// if we have data to send, send it
		if (eventAddToBasket_Data != null) {
			// create message
			var data = new SU_Data.messageObj();
			data.Message = 'EventBasketData';
			data.Data = eventAddToBasket_Data
			// send
			e.source.postMessage(data, 'http://www.swansea-union.co.uk');
			// clear pending basket data
			eventAddToBasket_Data = null;
		}
		// otherwise read the basket content from the reply and delete the iframe
		else {
			var basketHtml = msg.Data;
			$('#eventAddToBasketFrame').remove();
			$('#msl-basket').html(basketHtml);
			if ($('#ctl00_basket_pnlBasket .qty').length > 0) {
				var qtyText = $("#basket .qty").text();
				var basketQuantity = $('.qty').length;
				$('#basket-summary-count').html(basketQuantity);
				$('#basket-summary-plu').html(basketQuantity == "1" ? 'item.' : 'items.');
				$('.blue-login').addClass('blue-login-basket');
				$('#basket-summary').unbind('click');
				$('#basket-summary').show().click(function() {
					window.location.href = 'http://www.swansea-union.co.uk/shop/checkout/';
					return false;
				});
			}
			else{
				$('.blue-login').removeClass('blue-login-basket');
				$('#basket-summary').hide();
			}
		}
	}
	else if (msg.Message == 'EventBasketCallback') {
		console.log('Triggered Add-to-Basket');
	}
}

/**
 * Function is embedded in the eventObj object.
 * Triggers an add-to-basket action using a hidden iframe.
 * @param {eventObj} event The event.
 * @param {ticketObj} ticket The ticket object (from within event.Tickets array).
 * @param {number} quantity How many tickets to add.
 */
SU_Data.eventAddToBasket = function(event, ticket, quantity) {
	$('#eventAddToBasketFrame').remove();
	if (event == null || ticket == null) return;
	if (quantity == null || typeof(quantity) != 'number' || quantity < 1 || quantity > 10) return;
	event.GetEvent();
	eventAddToBasket_Data = { PurchaseID: ticket.PurchaseID, QuantityID: ticket.QuantityID, Quantity: quantity };
	var frame = $('<iframe id="eventAddToBasketFrame" src="' + event.Link + '"></iframe>').hide();
	$('body').append(frame);
}

/**
 * Parses any News widgets on the page and populates the newsData array with the data.
 */
SU_Data.findNewsData = function() {
	$('.news_full').each(function() {
		// get the div ID of the parent, used to reference this data list, set in widget config
		var widgetId = null;
		if ($(this).attr('id') != null) {
			widgetId = $(this).attr('id');
		}
		else {
			console.log('News widget is missing a div ID.');
			return;
		}
		// create an array for the news articles
		var news = [];
		// parse each news item
		$(this).find('.news_item').each(function(index) {
			// mark that we have some news
			SU_Data.hasNews = true;
			// create and populate a new SU_News object
			var article = new SU_Data.newsObj();
			article.Organisation = $(this).find('.msl_news_org').text();
			article.Organisation = $.trim(article.Organisation.replace(/[\r\n\t]/g, ''));
			article.Title = $(this).find('h5').text();
			article.Description = $(this).find('.leader').text();
			article.Story = $(this).find('.msl_newsbodytext').html();
			article.Story = $.trim(article.Story.replace(/[\r\n\t]/g, ''));
			article.Date = $(this).find('.msl_pubdate').text();
			article.Link = $(this).find('.news_image a').first().attr('href');
			if ($(this).find('img').length == 1) {
				article.Image = $(this).find('img').first().attr('src');
			}
			var tags = $(this).attr('class').split(/\s+/);
			article.Tags = $.grep(tags, function(item) {
				return SU_Data.stringLeft(item, 3) == 'msl';
			});
			// push it into the news array
			news.push(article);
		});
		// add all the news to the newsData store, referenced using the widgetId
		SU_Data.newsData[widgetId] = news;
	});
}


/**
 * Tales the first N characters from the given string.
 * If there are less than N characters it returns the whole string.
 * @param {String} str The string.
 * @param {number} n The number of characters.
 */
SU_Data.stringLeft = function(str, n) {
	if (n <= 0)
	    return "";
	else if (n > String(str).length)
	    return str;
	else
	    return String(str).substring(0, n);
}

/**
 * Code for the Events page to handle the Add To Basket actions.
 * Called on every page, but only does anything on the events page.
 */
SU_Data.f_EventPage_AddToBasket = function() {
	// Only run this code if the current page has tickets for sale.
	// I belive this is only /ents/event/<id>/ pages
	if ($('.event_tickets .event_ticket input.button').length > 0) {
		// If we have a parent window, send a basket request message
		if (parent != window) {
			var listener = function(e) {
				if (e.source == window) return;
				if (e.data == null || e.data.Type != 'SU_Data postMessage') return;
				var msg = e.data;
				if (msg.Message == 'EventBasketData') {
					var pId = msg.Data.PurchaseID;
					var qId = msg.Data.QuantityID;
					var quantity = msg.Data.Quantity;
					$('#' + qId).val(quantity);
					$('#' + pId).trigger('click');
					e.source.postMessage('EventBasketCallback', e.origin);
				}
			}
			if (window.addEventListener){
				addEventListener("message", listener, false);
			} else {
				attachEvent("onmessage", listener);
			}
			var msg = new SU_Data.messageObj();
			msg.Message = 'EventBasketRequest';
			msg.Data = $('#msl-basket').html();
			parent.postMessage(msg, "http://www.swansea-union.co.uk/");
		}
	}
}

/**
 * Document Ready Handler
 */
$(document).ready(function() {
	SU_Data.findEventData();
	SU_Data.findNewsData();
	// Basket & Add To Basket Code
	if (window.addEventListener){
		addEventListener("message", SU_Data.eventAddToBasket_Callback, false);
	} else {
		attachEvent("onmessage", SU_Data.eventAddToBasket_Callback);
	}
	SU_Data.f_EventPage_AddToBasket();
});

