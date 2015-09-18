/**
 * @class SU_Data
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
 *
 * Example Usages:  SU_Data.<function>
 *
 *  getEvents('widgetDivId', 8)							// Fetch 8 events from the event list with the given widget DIV id.
 *
 *  getBrandEvents('widgetDivId', 'tooters')			// Fetch default number of tooters branded events from the event list with the given widget DIV id.
 *  getBrandEvents('ALL', 'tooters', 4)					// Fetch 4 tooters branded events any event list.
 *
 *  getOrganisationEvents('widgetDivId', 'Divas', 6)	// Fetch 6 Divas organisation events from the widget with the given widget DIV id.
 *  getOrganisationEvents('widgetDivId', '6013', 6)		// Fetch 6 of this organisation ID's events from the widget with the given widget DIV id.
 *  getOrganisationEvents('ALL', 'Divas')				// Fetch default number of Divas organisation events from any event list.
 *
 *  getActivities()										// Get Society and Sport Activities
 *
 *  social.getGalleryImages('sinsavers', 10, CALLBACK(photos, galleryName))
 *  		// Gets an array of types.socialImageObj objects and passes it to the callback function along with the album name
 */

/**
 * MSL Widgets:
 *
 * Membership
 * <MSL:Memberships Organisations="6019,6109" ContainerID="MyMemberships" ExpiryWarningPeriod="" />
 *
 * EventList
 * <MSL:Eventlist ShowFuture="True" ShowTypes="True" EventsToDisplay="100" ShowDate="False" ShowOrganisationName="True"
 * 		ShowBrandName="True" ShowDateOnEvent="True" ShowTime="True" HideOnNoEvents="True" ShowRSSFeed="True"
 * 		ShowBuyTicketsLink="True" ShowFeatured="False" OrganisationID="6013" IncludeChildOrganisations="True"
 * 		EntertainmentsEventsOnly="False" ContainerID="eventsall" SortOrder="Start date (earliest first)" />
 */

var SU_Data = {
	/* --------------------------------
	 * Data Types
	 * -------------------------------- */
	types: {
		// Event Object
		eventObj: function() {
			this.EventID = '';        // Event ID
			this.Title = '';		  // Event name
			this.Type = [];			  // Event Type
			this.Description = '';    // Brief event description
			this.Location = '';		  // Venue
			this.Date = null;		  // Date
			this.Image = '';		  // Logo
			this.Link = '';			  // Event link
			this.Organisation = '';   // Organisation Name
			this.OrganisationID = ''; // Organisation Name
			this.Brand = '';		  // Brand Name
			this.FullText = '';		  // Full text description (not loaded by default)
			this.Tickets = [];		  // Array of ticket objects (not loaded by default)
			this.GetEvent = function() { return SU_Data.load.loadFullEvent(this) };
			this.GetRelatedEvents = function() { return this.Brand.length > 0 ? SU_Data.getBrandEvents('ALL', this.Brand, 4) : []; }
			this.AddToBasket = function(ticketIndex, quantity) { SU_Data.basket.eventAddToBasket(this, ticketIndex, quantity) };
		},
		
		
		
		// Menu Object	
		eventTicketObj: function() {
			this.Category = '';
			this.Title = '';
			this.Link = '';
			this.Image = '';
		},
		// Ticket Object - child of eventObj
		menuObj: function() {
			this.Name = '';
			this.Price = '';
			this.Quantities = [];
			this.PurchaseID = '';
			this.QuantityID = '';
		},
		// Organisation Object
		organisationObj: function(orgId, orgName) {
			this.OrganisationID = typeof(orgId) != 'undefined' ? orgId : '';
			this.Organisation = typeof(orgName) != 'undefined' ? orgName : '';
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
			this.OrganisationID = ''; // Organisation Name
		},
		// Activity List
		activitiesObj: function() {
			this.Name = '';
			this.Link = '';
			this.OrganisationID = '';
			this.Image = '';
			this.Type = '';
			this.Category = '';
		},
		// Union List
		unionObj: function() {
			this.Name = '';
			this.Link = '';
			this.OrganisationID = '';
			this.Image = '';
			this.Type = '';
			this.Category = '';
		},
		/** WORKING HERE **/
		// Breadcrumb List 
		crumbObj: function(){
			this.Title = 'titleDefault';
			this.Link = 'linkDefault';
			this.Slug = 'slugDefault';
			this.Path = [];
			this.Dept = '1';
		},
		// Data transmission object for use with window.postMessage
		messageObj: function() {
			this.Message = null; // Message Type string
			this.Data = null; // Data object (any type)
			this.Type = 'SU_Data postMessage';
		},
		socialImageObj: function() {
			this.Image = '';
			this.Width = 0;
			this.Height = 0;
			this.Created = null;
			this.Tags = [];
		},
		personObj: function() {
			this.ID = 0;
			this.Name = '';
			this.Email = '';
			this.Image = '';
			this.Link = '';
			this.Info = '';
		}
	},
	
	/* --------------------------------
	 * Data Objects/Arrays
	 * -------------------------------- */
	eventBrands: [],
	eventData: {},
	eventOrganisations: [],
	breadCrumb: [],
	newsData: {},
	blogData: {},
	menuData: {},
	personData: {},
	
	/* --------------------------------
	 * Data Tests
	 * -------------------------------- */
	hasActivities: function() { return SU_Data.activitiesData.length > 0; },
	hasUnion: function() { return SU_Data.unionData.length > 0; },
	hasMemberships: function() { return SU_Data.membershipsData.length > 0; },
	hasEvents: function() { return Object.keys(SU_Data.eventData).length > 0; },
	hasNews: function() { return Object.keys(SU_Data.newsData).length > 0; },
	hasBlogs: function() { return Object.keys(SU_Data.blogData).length > 0; },
	
	/* --------------------------------
	 * Load Data Functions
	 * -------------------------------- */
	load: {
		loadMemberList: function() {
			$('div.mslwidget div.msl-groupedmemberlist').each(function(){
				var divId = $(this).parent().attr('id');
				SU_Data.personData[divId] = [];
				$(this).find('ul li > div').each(function() {
					var person = new SU_Data.types.personObj();
					person.Name = $(this).find('dl > dt > a').text();
					person.Email = $(this).find('dl > dd > a').text();
					person.ID = $(this).find('input').attr('value');
					person.Image = $(this).find('div.badge_tools img').attr('src').replace('/80x100','');
					person.Link = $(this).find('dl > dt').next('dd').text();
					if (person.Link == null || person.Link == "") {
						person.Link = $(this).find('div.badge_tools a').attr('href');
					}
					person.Title = $(this).parent().parent().prev().text();
					SU_Data.personData[divId].push(person);
				});
			});
		},
		loadMenu: function () {
			SU_Data.menuData = [];
			$('#menu-items .menu-list').each(function () {
				var menu = new SU_Data.types.menuObj();
				menu.Category = $(this).find('h1').text();
				menu.Title = $(this).find('ul li .msl-imagenav-title').text();
				menu.Link = $(this).find('ul li a').attr('href');
				menu.Image = $(this).find('ul li span img').attr('src');
				SU_Data.menuData.push(menu);
				//$(this).parent().parent().remove();
			});
		},
		loadMemberships: function () {
			SU_Data.membershipsData = [];
			$('div.mslwidget#Data_MyMemberships dl.memberships').each(function () {
				var membership = new SU_Data.types.membershipObj();
				membership.Name = $(this).find('a.membership').text();
				membership.Link = $(this).find('a.membership').attr('href');
				membership.OrganisationID = $(this).attr('data-msl-organisation-id');
				SU_Data.membershipsData.push(membership);
				$(this).parent().parent().remove();
			});
		},
		loadActivities: function () {
			SU_Data.activitiesData = [];
			$('div.mslwidget div.msl_organisation_list').each(function () {
				$(this).find('li a.msl-gl-link').each(function () {
					var activities = new SU_Data.types.activitiesObj();
					activities.Category = $(this).parent().parent().prev().find('h3').text();		
					activities.Name = $(this).text();
					activities.Link = $(this).attr('href');
					activities.OrganisationID = $(this).attr('href').replace('mysociety/','').replace('mysport/','').replace('myunion/','').replace('activities/','').replace('organisation/','').replace('/','').replace('/','');
					activities.Type = $(this).parent().attr('data-msl-organisation-id').indexOf('6109') >= 0 ? "Sports" : "Societies";
					activities.Image = '/' + $(this).parent().prev().find('img').attr('src');
					SU_Data.activitiesData.push(activities);
				});
				//$(this).parent().remove();
			});
		},
		loadUnion: function () {
			SU_Data.unionData = [];
			$('div.mslwidget.sudata-union div.msl_organisation_list').each(function () {
				$(this).find('li a.msl-gl-link').each(function () {
					var union = new SU_Data.types.unionObj();
					union.Category = $(this).parent().parent().prev().find('h3').text();		
					union.Name = $(this).text();
					union.Link = $(this).attr('href');
					union.OrganisationID = $(this).attr('href').replace('union/','').replace('organisation/','').replace('/','').replace('/','');
					union.Type = $(this).parent().attr('data-msl-organisation-id').indexOf('16228') >= 0 ? "FTO" : "Other";
					union.Image = '/' + $(this).parent().prev().find('img').attr('src');
					SU_Data.unionData.push(union);
					console.log(SU_Data.unionData);
				});
				$(this).parent().remove();
			});
		},
		/* Working Here */
		loadBreadCrumbs: function () {
			SU_Data.breadCrumbsData = [];
			$('div.mslwidget.sudata_union ul.level_1').each(function () {
				$(this).find('li a').each(function () {
					var breadCrumb = new SU_Data.types.crumbObj();
					breadCrumb.Title = $( this ).text(); // Get Current Link's Page Name		
					breadCrumb.Link = $( this ).attr("href").replace(/^\/+|\/+$/g, ''); // Trim slashes
					breadCrumb.Slug = breadCrumb.Link.split("/").pop().replace('/',''); // Get last folder
					breadCrumb.Path = breadCrumb.Link.split('/');
					breadCrumb.Dept = breadCrumb.Path.length;
		
					SU_Data.breadCrumbsData.push(breadCrumb);
				});
				$(this).parent().remove();
			});
		},
		/**
		 * Parses any EventList widgets on the page and populates the eventData array with the data.
		 */
		loadEvents: function() {
			$('div.msl_eventlist').each(function() {
				var divObj = $(this);
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
					event.Organisation = $(this).find('.msl_event_organisation').text();
					event.OrganisationID = $(this).attr('data-msl-organisation-id');
					event.Brand = $(this).find('.msl_event_brand').text();
					$(this).find('.msl_event_types a').each(function() {
						event.Type.push($(this).text());
					});
					
					var dateValue = $(this).find('.msl_event_time').text();
					if (dateValue != null) {
						dateValue = $.trim(dateValue.replace(/[\r\n]/g, '').replace(/midnight/g, '0am').replace(/noon/g, '12pm'));
						// Parse date as an object if we can
						var year = new Date().getFullYear();
						var dateMatch = dateValue.match(/^([0-9]{1,2})[^-]* ([a-z]+)/i);
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
					if (event.Link.indexOf("http://") == 0 || event.Link.indexOf("https://") == 0) {
						return;
					}
					event.EventID = parseInt(/\/event.*\/([0-9]+)\//.exec(event.Link)[1]);
					if ($(this).find('img').length == 1) {
						event.Image = $(this).find('img').first().attr('src');
						event.Image = event.Image.substring(0, event.Image.indexOf('?'));
						event.Image = event.Image + '?' + $.param({thumbnail_width: 218, thumbnail_height: 308, fill_colour: '000000'});
					}
					// push it into the events array
					events.push(event);
				});
				// add all the events to the eventData store, referenced using the widgetId
				SU_Data.eventData[widgetId] = events;
				var newBrands = events.map(function (d) { return d.Brand; }).getUnique().filter(function(d) { return d != ""; });
				SU_Data.eventBrands = SU_Data.eventBrands.concat(newBrands).getUnique().sort();
				var newOrgs = events.map(function(d) { return new SU_Data.types.organisationObj(d.OrganisationID, d.Organisation); }).filter(function(d) { return typeof(d.OrganisationID) != 'undefined'; });
				SU_Data.eventOrganisations = SU_Data.eventOrganisations.concat(newOrgs).getUnique(function (d) { return d.OrganisationID; }).sort(function(a,b) { return a.Organisation > b.Organisation; });
				// Remove the Widget Data from the page. It's not needed any more.
				divObj.parent().remove();
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
					article.Story = escapeHtml($(this).find('.msl_newsbodytext').html());
					article.Story = $.trim(article.Story.replace(/[\r\n\t]/g, ''));
					article.Story = article.Story.replace(/&nbsp;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"');
					article.Date = new Date(Date.parse($(this).find('.msl_pubdate').text()));
					if($(this).find('.news_image a').length>0){
						article.Link = $(this).find('.news_image a').first().attr('href').replace('../','/');
					}else{
							article.Link = '';
					}
					article.Link = ('/' + article.Link).replace('//','/');
					if ($(this).find('img').length > 0) {
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
					article.Description = '' + $(this).find('span.msl-recentblogpost').text();
					article.Description = $.trim(article.Description.replace(/[\r\n\t]/g, ''));
					article.Author = $(this).find('.msl-recentblogpostblogname').text();
					article.AuthorLink = $(this).find('.msl-recentblogpostblogname').attr('href').replace('../','/');
					article.AuthorLink = ('/' + article.AuthorLink).replace('//','/');
					article.Story = '';
					article.Date = new Date(Date.parse($(this).find('.msl-recentblogpostdate').text()));
					article.Image = $(this).find('.msl-recentblogpostimage').first().attr('src');
					article.Link = $(this).find('.msl-recentblogposttitle').attr('href').replace('../','/');
					article.Link = ('/' + article.Link).replace('//','/');
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
					url: 'http://www.swansea-union.co.uk/' + event.Link,
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
						var blogStory = $('.msl_blog_post_body', data).html();
						blogPost.Story = blogStory || '';
						blogPost.Story = $.trim(blogPost.Story.replace(/[\r\n\t]/g, ''));
					}
				});
			}
			return blogPost;
		}
	},
	social: {
		ignoredGalleries: ["Cover Photos", "Profile Pictures", "Timeline Photos", "Instagram Photos", "Coming Soon!"],
		getGalleryImages: function(brand, imgCount, callback) {
			if (typeof(SU_Facebook.brand_galleries[brand]) == 'undefined') {
				$('.sulb-inner.event .sliderPhotoGallery').hide();
				$('#sulb-eventgallery-title').hide();
				return;
			}
			$('.sulb-inner.event .sliderPhotoGallery').show();
			$('#sulb-eventgallery-title').show();
			if (typeof(imgCount) == 'string')
				imgCount = parseInt(imgCount);
			if (typeof(imgCount) != 'number')
				imgCount = 15;
			$.ajax({
				url: SU_Facebook.brand_galleries[brand] + "?fields=albums.limit(7).fields(name, type, photos.limit(" + imgCount + "))",
				dataType: 'jsonp',
				cache: true,
				success: function(data) {
					var result = [];
					var album = data.albums.data.filter(function (d) {  return d.type == "normal" && $.inArray(d.name, SU_Data.social.ignoredGalleries) == -1; })[0];
					var albumName = album.name;
					console.log('Album Name: ' + albumName);
					var fb_images = album.photos.data;
					if (fb_images.length > 0) {
						$.each(fb_images, function(i, o) {
							var img_src = o.images[3];
							var img_obj = new SU_Data.types.socialImageObj();
							img_obj.Image = img_src.source;
							img_obj.Width = parseInt(img_src.width);
							img_obj.Height = parseInt(img_src.height);
							img_obj.Created = new Date(o.created_time);
							if (typeof(o.tags) == "object" && o.tags.data.length > 0) {
								img_obj.Tags = o.tags.data;
							}
							result.push(img_obj);
						});
					}
					callback(result, albumName);
				}
			});
		},
		getFacebookGallery: function(galleryId, callback) {
			if (galleryId == null || typeof(galleryId) != "string" || galleryId.length < 3) {
				return;
			}
			var graphUrl = 'https://graph.facebook.com/' + galleryId + '?fields=name,photos.limit(24)';
			$.ajax({
				url: graphUrl,
				dataType: 'jsonp',
				cache: true,
				success: function(data) {
					var result = [];
					var album = data.photos.data;
					var albumName = data.name;
					if (album.length > 0) {
						$.each(album, function(i, o) {
							var img_src = o.images[3];
							var img_obj = new SU_Data.types.socialImageObj();
							img_obj.Image = img_src.source;
							img_obj.Width = parseInt(img_src.width);
							img_obj.Height = parseInt(img_src.height);
							img_obj.Created = new Date(o.created_time);
							if (typeof(o.tags) == "object" && o.tags.data.length > 0) {
								img_obj.Tags = o.tags.data;
							}
							result.push(img_obj);
						});
					}
					callback(result, albumName);
				}
			});
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
		eventAddToBasket_Data: null,
		updateBasketQty: function(){
			var qtyTotal = 0;
			$(".menu-content.basket .qty").each(function() {
				qtyTotal += parseInt($(this).text().replace( /^\D+/g, ''));
				if(qtyTotal > 0){
					$('.basket-count').text(qtyTotal);
					$('.menu-item-basket a').addClass('gold-underline');
					$('#menufication-nav a[href="/shop/reviewbasket"]').text('Basket (' + qtyTotal + ')');
				}else{
					$('.basket-count').text('');
					$('.menu-item-basket a').removeClass('gold-underline');
					$('#menufication-nav a[href="/shop/reviewbasket"]').text('Basket');
				}
			});
		}
	},
	/* Working Here */
	getBreadCrumbs: function(path) {
		//path is url.path with both leading and trailing slashes trimmed  
		path = path.replace(/^\/+|\/+$/g, '');
		
		var pathLink = '';
		
		if (typeof(path) != 'string') {
			console.error("SU_Data getBreadCrumbs(): No path string specified. Current will be used")
			pathLink = window.location.pathname.replace(/^\/+|\/+$/g, ''); // Trim slashes;
		}
		else{
			pathLink = path;
		}
		var breadCrumbs = SU_Data.breadCrumbsData;
		return breadCrumbs.filter(function (d) { return d.Link == pathLink});
	},
	getEvents: function(eventList, limit) {
		if (typeof(eventList) != 'string') {
			console.error("SU_Data getEvents(): No event list specified.")
			return [];
		}
		if (typeof(SU_Data.eventData[eventList]) != 'object') {
			console.error("SU_Data getEvents(): Specified event list is not present in SU_Data.")
			return [];
		}
		if (typeof(limit) != 'number') {
			limit = 10;
		}
		return SU_Data.eventData[eventList].slice(0, limit);
	},
	getBrandEvents: function(eventList, brandName, limit) {
		if (typeof(eventList) != 'string' || typeof(brandName) != 'string') {
			return [];
		}
		if (typeof(limit) != 'number') {
			limit = 10;
		}
		var events = [];
		if (eventList == 'ALL') {
			for (var eL in SU_Data.eventData) {
				events = events.concat(SU_Data.eventData[eL]);
			}
			events = events.getUnique(function (d) { return d.EventID; }).sort(function (a,b) { return a.Date - b.Date; });
		}
		else {
			if (typeof(SU_Data.eventData[eventList]) != 'object') {
				return [];
			}
			else {
				events = SU_Data.eventData[eventList];
			}
		}
		return events.filter(function (d) { return d.Brand == brandName || brandName == 'ALL'; }).slice(0, limit);
	},
	getTypeEvents: function(eventList, typeName, limit) {
		if (typeof(eventList) != 'string' || typeof(typeName) != 'string') {
			return [];
		}
		if (typeof(limit) != 'number') {
			limit = 10;
		}
		var events = [];
		if (eventList == 'ALL') {
			for (var eL in SU_Data.eventData) {
				events = events.concat(SU_Data.eventData[eL]);
			}
			events = events.getUnique(function (d) { return d.EventID; }).sort(function (a,b) { return a.Date - b.Date; });
		}
		else {
			if (typeof(SU_Data.eventData[eventList]) != 'object') {
				return [];
			}
			else {
				events = SU_Data.eventData[eventList];
			}
		}
		return events.filter(function (d) { return d.Type.indexOf(typeName) > -1 || typeName == 'All' || typeName == 'ALL'; }).slice(0, limit);
	},
	getOrganisationEvents: function(eventList, orgIdOrName, limit) {
		if (typeof(eventList) != 'string' || typeof(orgIdOrName) != 'string') {
			return [];
		}
		if (typeof(limit) != 'number') {
			limit = 10;
		}
		var events = [];
		if (eventList == 'ALL') {
			for (var eL in SU_Data.eventData) {
				events = events.concat(SU_Data.eventData[eL]);
			}
			events = events.getUnique(function (d) { return d.EventID; }).sort(function (a,b) { return a.Date - b.Date; });
		}
		else {
			if (typeof(SU_Data.eventData[eventList]) != 'object') {
				return [];
			}
			else {
				events = SU_Data.eventData[eventList];
			}
		}
		return events.filter(function (d) { return d.Organisation == orgIdOrName || d.OrganisationID == orgIdOrName || orgIdOrName == 'ALL' }).slice(0, limit);
	},
	getActivities: function () {
		return SU_Data.activitiesData;
	},
	getUnion: function () {
		return SU_Data.unionData;
	},
	getMyEvents: function(eventList, limit) {
		// Check the event list is valid
		if (typeof(eventList) != 'string' || typeof(SU_Data.eventData[eventList]) != 'object') {
			return [];
		}
		// Default limit if none given
		if (typeof(limit) != 'number') {
			limit = 10;
		}
		// My Memberships must be: count > 0
		if (SU_Data.membershipsData.length == 0) {
			return [];
		}
		// Get My Memberships
		var memberships = SU_Data.membershipsData.map(function(d) { return d.OrganisationID; });
		// Filter events in the given widget based on memberships
		return SU_Data.eventData[eventList].filter(function(d) {
			return memberships.indexOf(d.OrganisationID) > -1;
		});
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
			$('#basket').html(basketHtml);
			SU_Data.basket.updateBasketQty();
			console.log('updated Basket Qty');
			$('div.sulb-inner.event #buy-confirm').text('Basket updated!');
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
	console.log("eventAddToBasket()");
	$('#eventAddToBasketFrame').remove();
	var pendingMessage = "Please wait while item is being placed in your basket..." + "<br/>Taking too long? <a href='" + event.Link + "'>click here.</a>";
	$('div.sulb-inner.event #buy-confirm').html(pendingMessage);
	if (event == null || ticketIndex == null || typeof(ticketIndex) != 'number') return;
	if (quantity == null || typeof(quantity) != 'number' || quantity < 1 || quantity > 10) return;
	event.GetEvent();
	if (ticketIndex >= event.Tickets.length) return;
	var ticket = event.Tickets[ticketIndex];
	if (ticket == null) return;
	SU_Data.basket.eventAddToBasket_Data = { PurchaseID: ticket.PurchaseID, QuantityID: ticket.QuantityID, Quantity: quantity };
	console.log(SU_Data.basket.eventAddToBasket_Data);
	var frame = $('<iframe id="eventAddToBasketFrame" src="' + event.Link + '?skin=su&template=eventsapi"></iframe>').hide();
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
			msg.Data = $('#basket').html();
			parent.postMessage(msg, "http://www.swansea-union.co.uk/");
		}
	}
}

/**
 * Document Ready Handler
 */
$(document).ready(function() {
	SU_Data.load.loadActivities();
	SU_Data.load.loadUnion();
	SU_Data.load.loadMenu();
	SU_Data.load.loadBreadCrumbs();
	SU_Data.load.loadMemberships();
	SU_Data.load.loadEvents();
	SU_Data.load.loadNews();
	SU_Data.load.loadBlogs();
	SU_Data.load.loadMemberList();
	SU_Data.basket.updateBasketQty();
	// Basket & Add To Basket Code
	if (window.addEventListener){
		addEventListener("message", SU_Data.basket.eventAddToBasket_Callback, false);
	} else {
		attachEvent("onmessage", SU_Data.basket.eventAddToBasket_Callback);
	}
	SU_Data.basket.f_EventPage_AddToBasket();
});


/**
 * Get Unique items in an array.
 * Optional accessor function to get unique key of object.
 * e.g.
 *      getUnique()
 *      getUnique(function (d) { return d.Attribute; })
 */
Array.prototype.getUnique = function(accessor) {
	if (typeof(accessor) != 'function') {
		accessor = function (d) { return d };
	}
    var u = {}, a = [];
    for(var i = 0, l = this.length; i < l; i++){
        if(u.hasOwnProperty(accessor(this[i]))) {
          continue;
        }
        a.push(this[i]);
        u[accessor(this[i])] = 1;
    }
    return a;
}

/**
 * Reset the given URL address parameters
 */
function setUrlParameters(address, parameters) {
	var ret = address;
	if (ret.indexOf('?') >= 0) {
		ret = ret.substring(0, ret.indexOf('?'));
	}
	return ret + '?' + $.param(parameters);
}