/**
 * @class SU_Data
 * @author Michael Nicholas
 *
 * Retrieves data from MSL widgets within the current page, if any exist.
 *
 * Data is pulled from News and EventList widgets.
 *
 * The data will be loaded into arrays {eventData, newsData} as either eventObj or newsObj objects.
 * Can test if data is available using boolean functions {hasEvents, hasNews, hasBlogs}
 * 
 * Widgets must be given a unique 'Wrapper div ID' in the widget configuration.
 * The div ID is the key value for that set of data within the arrays.
 *
 * Add to Basket uses a hidden iframe and window.postMessage to communicate with the events page
 * and trigger the appropriate add-to-basket button. The postMessage also sends back the new
 * basket html from the page loaded after triggering the add-to-basket button in the hidden frame.
 */

/**
 * MSL Widgets:
 *
 * Membership
 * <MSL:Memberships Organisations="6019,6109" ContainerID="MyMemberships" ExpiryWarningPeriod="" />
 */

var SU_Data = {
	/* --------------------------------
	 * Data Types
	 * -------------------------------- */
	types: {
		// Event Object
		eventObj: function() {
			this.Title = '';		// Event name
			this.Description = '';	// Brief event description
			this.Location = '';		// Venue
			this.Date = null;		// Date
			this.Image = '';		// Logo
			this.Link = '';			// Event link
			this.Organisation = ''; // Organisation Name
			this.Brand = '';		// Brand Name
			this.FullText = '';		// Full text description (not loaded by default)
			this.Tickets = [];		// Array of ticket objects (not loaded by default)
			this.GetEvent = function() { return SU_Data.load.loadFullEvent(this) };
			this.AddToBasket = function(ticketIndex, quantity) { SU_Data.basket.eventAddToBasket(this, ticketIndex, quantity) };
		},
		// Ticket Object - child of eventObj
		eventTicketObj: function() {
			this.Name = '';
			this.Price = '';
			this.Quantities = [];
			this.PurchaseID = '';
			this.QuantityID = '';
		},
		// News Object
		newsObj: function() {
			this.Title = '';
			this.Description = '';
			this.Organisation = '';
			this.Story = '';
			this.Date = '';
			this.Image = '';
			this.Link = '';
			this.Tags = [];
		},
		// Blog Post Object
		blogObj: function() {
			this.Title = '';
			this.Description = '';
			this.Author = '';
			this.AuthorLink = '';
			this.Story = '';
			this.Date = '';
			this.Image = '';
			this.Link = '';
			this.GetPost = function() { return SU_Data.load.loadFullBlogPost(this); }
		},
		// Membership Object
		membershipObj: function() {
			this.Name = '';
			this.Link = '';
		},
		// Activity List
		activitiesObj: function() {
			this.Name = '';
			this.Link = '';
			this.ID = '';
			this.Type = '';
			this.Category = '';
		},
		// Data transmission object for use with window.postMessage
		messageObj: function() {
			this.Message = null; // Message Type string
			this.Data = null; // Data object (any type)
			this.Type = 'SU_Data postMessage';
		}
	},
	
	/* --------------------------------
	 * Data Objects/Arrays
	 * -------------------------------- */
	memberships: [],
	eventData: {},
	newsData: {},
	blogData: {},
	
	/* --------------------------------
	 * Data Tests
	 * -------------------------------- */
	hasMemberships: function() { return SU_Data.memberships.length > 0; },
	hasEvents: function() { return Object.keys(SU_Data.eventData).length > 0; },
	hasNews: function() { return Object.keys(SU_Data.newsData).length > 0; },
	hasBlogs: function() { return Object.keys(SU_Data.blogData).length > 0; },
	
	/* --------------------------------
	 * Load Data Functions
	 * -------------------------------- */
	load: {
		loadMemberships: function () {
			SU_Data.memberships = [];
			$('div.mslwidget#MyMemberships dl.memberships a.membership').each(function () {
				var membership = new SU_Data.types.activitiesObj();
				membership.Name = $(this).text();
				membership.Link = $(this).attr('href');
				SU_Data.memberships.push(membership);
			});
		},
		loadActivities: function () {
			SU_Data.activities = [];
			$('div.mslwidget .msl_organisation_list li a').each(function () {
				var activities = new SU_Data.types.activitiesObj();
				activities.Category = $(this).parent().parent().find('div.msl-gl-group').text();		
				activities.Name = $(this).text();
				activities.Link = $(this).attr('href');
				activities.ID = $(this).attr('href').replace('activities/','').replace('/','');
				activities.Type = $(this).parent().parent().parent().attr('id');
				SU_Data.activities.push(activities);
			});
		},
		/**
		 * Parses any EventList widgets on the page and populates the eventData array with the data.
		 */
		loadEvents: function() {
			$('.msl_eventlist').each(function() {
				// get the div ID of the parent, used to reference this data list, set in widget config
				var widgetId = null;
				if ($(this).parent().attr('id') != null) {
					widgetId = $(this).parent().attr('id');
				}
				else {
					console.error('Events widget is missing a div ID.');
					return;
				}
				// create an array for the events
				var events = [];
				// parse each event item
				$(this).find('.event_item').each(function(index) {
					// create and populate a new SU_Event object
					var event = new SU_Data.types.eventObj();
					event.Title = $(this).find('.msl_event_name').text();
					event.Description = $(this).find('.msl_event_description').text();
					event.Description = $.trim(event.Description.replace(/[\r\n\t]/g, ''));
					event.Location = $(this).find('.msl_event_location').text();
					event.Location = $.trim(event.Location.replace(/[\r\n\t]/g, ''));
					var dateValue = $(this).find('.msl_event_time').text();
					if (dateValue != null) {
						dateValue = $.trim(dateValue.replace(/[\r\n]/g, '').replace(/midnight/g, '0am').replace(/noon/g, '12pm'));
						// Parse date as an object if we can
						var year = new Date().getFullYear();
						var dateMatch = dateValue.match(/^([0-9]{1,2}).* ([a-z]+)/i);
						if (dateMatch != null && dateMatch.length >= 3) {
							event.Date = new Date(Date.parse(dateMatch[1] + ' ' + dateMatch[2] + ' ' + year));
							if (new Date(event.Date).getMonth() < new Date().getMonth()) {
								event.Date.setFullYear(year+1);
							}
							var timeValue = dateValue.match(/[0-9\:]+[a|p]m/);
							if (timeValue != null && timeValue.length >= 1) {
								var timeSplit = timeValue[0].match(/([0-9]+):?([0-9]+)?([a|p]m)/);
								if (timeSplit != null && timeSplit.length >= 3) {
									if (timeSplit[1] == '12' && timeSplit[3] == 'am') {
										timeSplit[1] = 0;
									}
									else if (timeSplit[1] != '12' && timeSplit[3] == 'pm') {
										timeSplit[1] = 12 + parseInt(timeSplit[1]);
									}
									if (timeSplit[2] == null) {
										timeSplit[2] = 0;
									}
									event.Date.setHours(timeSplit[1], timeSplit[2], 0, 0);
								}
							}
						}
						else {
							event.Date = null;
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
				// Remove the Widget Data from the page. It's not needed any more.
				$(this).parent().remove();
			});
		},
		/**
		 * Parses any News widgets on the page and populates the newsData array with the data.
		 */
		loadNews: function() {
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
					// create and populate a new SU_News object
					var article = new SU_Data.types.newsObj();
					article.Organisation = $(this).find('.msl_news_org').text();
					article.Organisation = $.trim(article.Organisation.replace(/[\r\n\t]/g, ''));
					article.Title = $(this).find('h5').text();
					article.Description = $(this).find('.leader').text();
					article.Story = $(this).find('.msl_newsbodytext').html();
					article.Story = $.trim(article.Story.replace(/[\r\n\t]/g, ''));
					article.Date = new Date(Date.parse($(this).find('.msl_pubdate').text()));
					article.Link = $(this).find('.news_image a').first().attr('href').replace('../','/');
					if ($(this).find('img').length == 1) {
						article.Image = $(this).find('img').first().attr('src');
					}
					var tags = $(this).attr('class').split(/\s+/);
					article.Tags = $.grep(tags, function(item) {
						return SU_Data.helper.stringLeft(item, 3) == 'msl';
					});
					// push it into the news array
					news.push(article);
				});
				// add all the news to the newsData store, referenced using the widgetId
				SU_Data.newsData[widgetId] = news;
				// Remove the widget data from the page.
				$(this).remove();
			});
		},
		/**
		 * Parses any Recent Blog Post widgets on the page and populates the blogData array with the data.
		 */
		loadBlogs: function() {
			$('ul.msl-recentblogposts').each(function() {
				// get the div ID of the parent, used to reference this data list, set in widget config
				var widgetId = null;
				if ($(this).parent().attr('id') != null) {
					widgetId = $(this).parent().attr('id');
				}
				else {
					console.log('Blog widget is missing a div ID.');
					return;
				}
				// create an array for the blog articles
				var blogPosts = [];
				// parse each news item
				$(this).find('li.msl-recentblogpost').each(function(index) {
					// create and populate a new blogObj object
					var article = new SU_Data.types.blogObj();
					article.Title = $(this).find('.msl-recentblogposttitle').text();
					article.Description = $(this).find('span.msl-recentblogpost').text();
					article.Description = $.trim(article.Description.replace(/[\r\n\t]/g, ''));
					article.Author = $(this).find('.msl-recentblogpostblogname').text()
					article.AuthorLink = $(this).find('.msl-recentblogpostblogname').attr('href');
					article.Story = '';
					article.Date = $(this).find('.msl-recentblogpostdate').text();
					article.Image = $(this).find('.msl-recentblogpostimage').first().attr('src');
					article.Link = $(this).find('.msl-recentblogposttitle').attr('href');
					// push it into the blogpost array
					blogPosts.push(article);
				});
				// add all the blog posts to the blogData store, referenced using the widgetId
				SU_Data.blogData[widgetId] = blogPosts;
				// remove widget data from the page
				$(this).parent().remove();
			});
		},
		/**
		 * Given an eventObj object, this function makes an ajax call to the event page to retrieve
		 * the full description and list of tickets on sale. This data is cached so it's only loaded
		 * once per page
		 * @param {eventObj} event The event object from one of the child lists in eventData.
		 */
		loadFullEvent: function(event) {
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
							var ticket = new SU_Data.types.eventTicketObj();
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
		},
		/**
		 * Ajax calls the blog post page and retrieves the full text.
		 * @param {blogObj} blogPost The blog post object.
		 */
		loadFullBlogPost: function(blogPost) {
			// Make sure this is a blogObj object
			if (blogPost.Story == null || blogPost.Link == null) return null;
			// Make sure we have a blog link, and haven't got a story
			if (blogPost.Link != '' && blogPost.Story == '') {
				// Make ajax call to the blog post page to get the data
				$.ajax({
					url: blogPost.Link,
					async: false,
					success: function(data) {
						// make sure we got some content
						if (data == null) return;
						// get the blog post
						blogPost.Story = $('.msl_blog_post_body', data).html();
						blogPost.Story = $.trim(blogPost.Story.replace(/[\r\n\t]/g, ''));
					}
				});
			}
			return blogPost;
		}
	},
	helper: {
		/**
		 * Takes the first N characters from the given string.
		 * If there are less than N characters it returns the whole string.
		 * @param {String} str The string.
		 * @param {number} n The number of characters.
		 */
		stringLeft: function(str, n) {
			if (n <= 0)
				return "";
			else if (n > String(str).length)
				return str;
			else
				return String(str).substring(0, n);
		}
	},
	basket: {
		// contains the basket data to be transmitted (if there is any)
		eventAddToBasket_Data: null
	}
};

/**
 * Listener for window.postMessage events sent from the child iframe.
 */
SU_Data.basket.eventAddToBasket_Callback = function(e) {
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
		if (SU_Data.basket.eventAddToBasket_Data != null) {
			// create message
			var data = new SU_Data.types.messageObj();
			data.Message = 'EventBasketData';
			data.Data = SU_Data.basket.eventAddToBasket_Data
			// send
			e.source.postMessage(data, 'http://www.swansea-union.co.uk');
			// clear pending basket data
			SU_Data.basket.eventAddToBasket_Data = null;
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
 * @param {number} ticketIndex The index of the ticket in the event.Tickets array.
 * @param {number} quantity How many tickets to add.
 */
SU_Data.basket.eventAddToBasket = function(event, ticketIndex, quantity) {
	$('#eventAddToBasketFrame').remove();
	if (event == null || ticketIndex == null || typeof(ticketIndex) != 'number') return;
	if (quantity == null || typeof(quantity) != 'number' || quantity < 1 || quantity > 10) return;
	event.GetEvent();
	if (ticketIndex >= event.Tickets.length) return;
	var ticket = event.Tickets[ticketIndex];
	if (ticket == null) return;
	SU_Data.basket.eventAddToBasket_Data = { PurchaseID: ticket.PurchaseID, QuantityID: ticket.QuantityID, Quantity: quantity };
	var frame = $('<iframe id="eventAddToBasketFrame" src="' + event.Link + '"></iframe>').hide();
	$('body').append(frame);
}


/**
 * Code for the Events page to handle the Add To Basket actions.
 * Called on every page, but only does anything on the events page.
 */
SU_Data.basket.f_EventPage_AddToBasket = function() {
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
			var msg = new SU_Data.types.messageObj();
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
	SU_Data.load.loadMemberships();
	SU_Data.load.loadEvents();
	SU_Data.load.loadNews();
	SU_Data.load.loadBlogs();
	/*
	// Basket & Add To Basket Code
	if (window.addEventListener){
		addEventListener("message", SU_Data.basket.eventAddToBasket_Callback, false);
	} else {
		attachEvent("onmessage", SU_Data.basket.eventAddToBasket_Callback);
	}
	SU_Data.basket.f_EventPage_AddToBasket();
	*/
});
