var SU_Widget = {
	BlogWidget: function(mslWidgetId, targetSelector, number) {
		if (typeof SU_Data == "undefined") {
			console.error("SU_Widget: SU_Data not defined.");
			return;
		}
		if (typeof SU_Data.blogData[mslWidgetId] == "undefined") {
			console.error("SU_Widget: SU_Data doesn't contain a blog called '" + mslWidgetId + "'");
			return;
		}
		if ($(targetSelector).length != 1) {
			console.error("SU_Widget: Blog target object invalid '" + targetSelector + "'");
			return;
		}
		jQuery.each(SU_Data.blogData[mslWidgetId], function(i, o) {
			if (i >= number) return;
			var post = $(document.createElement('div')).addClass('su-blog-post');
			var link = $(document.createElement('a')).attr('href', o.Link).attr('rel', 'deep');
			if (i >= 4) {
				post.addClass('hideBP2');
			}
			else if (i >= 3) {
				post.addClass('hideBP1');
			}
			var inner = $(document.createElement('div')).addClass('su-blog-post-inner');
			var title = $(document.createElement('div')).addClass('title').text(o.Title);
			var intro = $(document.createElement('div')).addClass('intro').text(o.Description);
			var image = $(document.createElement('img')).addClass('author').attr('src', 'http://www.swansea-union.co.uk/' + o.Image);
			$(inner).append(title);
			$(inner).append(image);
			$(inner).append(intro);
			$(link).append(inner);
			$(post).append(link);
			$(targetSelector).append(post);
		});
	},
	NewsWidget: function(mslWidgetId, targetSelector, number) {
		if (typeof SU_Data == "undefined") {
			console.error("SU_Widget: SU_Data not defined.");
			return;
		}
		if (typeof SU_Data.newsData[mslWidgetId] == "undefined") {
			console.error("SU_Widget: SU_Data doesn't contain a news widget called '" + mslWidgetId + "'");
			return;
		}
		if ($(targetSelector).length != 1) {
			console.error("SU_Widget: News target object invalid '" + targetSelector + "'");
			return;
		}
		jQuery.each(SU_Data.newsData[mslWidgetId], function(i, o) {
			if (i >= number) return;
			var news = $(document.createElement('div')).addClass('news default');
			var link = $(document.createElement('a')).attr('href', o.Link).attr('rel', 'deep');
			var inner = $(document.createElement('div')).addClass('news-inner');
			var innerimg = $(document.createElement('div')).addClass('news-inner-img');
			var img = $(document.createElement('div')).addClass('news-bgimage').css('background-image', 'url(\'http://www.swansea-union.co.uk' + o.Image + '\')');
			var title = $(document.createElement('div')).addClass('title');
			var author = $(document.createElement('div')).addClass('news-author');
			author.text(o.Organisation);
			title.text(o.Title);
			$(innerimg).append(img);
			$(innerimg).append(title);
			switch (i) {
				case 0:
					$(news).addClass('big');
					var desc = $(document.createElement('div')).addClass('description');
					desc.text(o.Description);
					$(innerimg).append(desc);
					break;
				case 1:
					$(news).addClass('medium');
					var desc = $(document.createElement('div')).addClass('description');
					desc.text(o.Description);
					$(innerimg).append(desc);
					break;
				case 9:
					$(news).addClass('small extra');
					break;
				default:
					$(news).addClass('small');
					break;
			}
			$(inner).append(innerimg);
			$(link).append(inner).append(author);
			$(news).append(link);
			$(targetSelector).append(news);
		});
		$(targetSelector + ' div.title').each(function() {
			$(this).wrapLines('<div class="title">', '</div>');
		})
		$(targetSelector).isotope({
			itemSelector : '.news',
			layoutMode: 'masonry',
			masonry: {
				columnWidth: 228
			},
			filter: '.news:not(.extra)'
		});
		$(window).resize(function() {
			var w = $(window).width();
			if (w >= 912 && w < 1140) {
				if (SU_Widget.IsotopeNewsFilterCheck) return;
				$(targetSelector).isotope({ filter: '.news' });
				SU_Widget.IsotopeNewsFilterCheck = true;
			}
			else {
				if (!SU_Widget.IsotopeNewsFilterCheck) return;
				$(targetSelector).isotope({ filter: '.news:not(.extra)' });
				SU_Widget.IsotopeNewsFilterCheck = false;
			}
		});
		window.resizeBy(0, 0);
		resetDeepLinks();
	},
	IsotopeNewsFilterCheck: false,
	EventSlider_Filter: function(mslWidgetId, targetselector, sliderselector, validTypes, validVenues) {
		if (typeof(validTypes) == 'undefined')
			validTypes = ['Club Nights', 'Freshers Events', 'Live Music', 'Special Events'];
		if (typeof(validVenues) == 'undefined')
			validVenues = ['Divas', 'Peppermint', 'Oceana', 'Sin City'];
		var types = [];
		var venues = [];
		SU_Data.eventData[mslWidgetId].map(function(d) {
			types.push.apply(types, d.Type);
			venues.push(d.Organisation);
		});
		types = types.getUnique().sort();
		types = types.filter(function(d) { return validTypes.indexOf(d) > -1; });
		venues = venues.getUnique().sort();
		venues = venues.filter(function(d) { return validVenues.indexOf(d) > -1; });
		// Output HTML
		/*
			<div class="m-btn-strip">
				<a href="#" class="m-btn">Compose New</a>
				
				<div class="m-btn-group">
					<a href="#" class="m-btn">Archive</a>
					<a href="#" class="m-btn">Spam</a>
					<a href="#" class="m-btn">Delete</a>
				</div>
									
				<div class="m-btn-group">
					<a href="#" class="m-btn">Move to</a>
					<a href="#" class="m-btn">Labels</a>
				</div>
			
				<a href="#" class="m-btn">More</a>
			</div>
		*/
		var btnStrip = $(document.createElement('div')).addClass('m-btn-strip');
		var makeBtn = function(type, text) {
			var btn = $(document.createElement('div')).addClass('m-btn mini filter').addClass(type).text(text);
			if (type == 'venue') btn.addClass('red');
			else if (type == 'type') btn.addClass('red');
			else btn.addClass('blue');
			btn.on('click', function(e) {
				$(targetselector).find('div.filter').addClass('disabled').removeClass('active');
				$(this).removeClass('disabled').addClass('active');
				SU_Widget.EventSlider_Filter_ClickEvent(mslWidgetId, sliderselector, text, type);
			});
			return btn;
		};
		var makeGroup = function() {
			return $(document.createElement('div')).addClass('m-btn-group');
		};
		btnStrip.append(makeBtn('all', 'All'));
		var typeBtnGroup = makeGroup();
		for (var i = 0; i < types.length; i++) {
			typeBtnGroup.append(makeBtn('type', types[i]));
		}
		var venueBtnGroup = makeGroup();
		for (var i = 0; i < venues.length; i++) {
			venueBtnGroup.append(makeBtn('venue', venues[i]));
		}
		btnStrip.append(typeBtnGroup).append(venueBtnGroup);
		$(targetselector).append(btnStrip);
		$(targetselector).find('div.filter').addClass('disabled').removeClass('active');
		$(targetselector).find('div.filter.all').removeClass('disabled').addClass('active');
	},
	EventSlider_Filter_ClickEvent: function(mslWidgetId, targetselector, selected, filterType) {
		var eventsList = null;
		if (filterType == 'type') {
			eventsList = SU_Data.getTypeEvents(mslWidgetId, selected).map(function (d) { return d.EventID; });
		}
		else if (filterType == 'venue') {
			eventsList = SU_Data.getOrganisationEvents(mslWidgetId, selected).map(function (d) { return d.EventID; });
		}
		if ($(targetselector).hasClass('sliderSmall')) {
			SU_Widget.EventSlider_Landscape(mslWidgetId, targetselector, eventsList);
		}
		else {
			SU_Widget.EventSlider_Portrait(mslWidgetId, targetselector, eventsList);
		}
	},
	EventSlider_Portrait: function(mslWidgetId, targetselector, filterEventIds) {
		var dayColors = ['bb-green', 'bb-yellow', 'bb-pink', 'bb-blue'];
		$(targetselector).iosSlider('destroy');
		$(targetselector).addClass('sliderPortrait').html('');
		var slider = $(document.createElement('div')).addClass('slider');
		var dayIndex = 0, prevDate = '01/01/2000';
		var events = SU_Data.getEvents(mslWidgetId, 20);
		if (filterEventIds != null) {
			events = events.filter(function(d) {
				return filterEventIds.indexOf(d.EventID) > -1;
			});
		}
		jQuery.each(events, function(i, o) {
			if (i > 0) {
				if (prevDate != o.Date.format('dd/MM/yyyy')) {
					dayIndex = (dayIndex+1) % dayColors.length;
				}
			}
			var slide = $(document.createElement('div')).addClass('slide');
			var inner = $(document.createElement('div')).addClass('slide-inner').addClass(dayColors[dayIndex]); // use dayindex to decide class
			var link = $(document.createElement('a')).attr('href', o.Link.replace('../', '')).attr('rel', 'deep');
			var img = $(document.createElement('img'));
			if (o.Image != null && o.Image.length > 0) {
				img.on('error', function() {
					$(this).replaceWith($(document.createElement('div')).addClass('orgText').text(o.Organisation));
					
				});
				img.attr('src', 'http://www.swansea-union.co.uk' + o.Image);
			}
			else {
				img = $(document.createElement('div')).addClass('orgText').text(o.Organisation);
			}
			var title = $(document.createElement('div')).addClass('event-title').text(o.Title);
			var date = $(document.createElement('div')).addClass('event-date').text(o.Date.format('dddd, d MMMM yyyy'));
			$(link).append(img).append(title).append(date);
			$(inner).append(link);
			$(slide).append(inner);
			$(slider).append(slide);
			prevDate = o.Date.format('dd/MM/yyyy');
		});
		$(targetselector).append(slider);
		$(targetselector).iosSlider({
			snapToChildren: true,
			scrollbar: false,
			desktopClickDrag: true,
			infiniteSlider: false
		});
		$(targetselector).on("webkitAnimationStart", SU_Widget.sliderAnimListener);
		$(targetselector).on("webkitAnimationEnd", SU_Widget.sliderAnimListener);
		$(targetselector).on("animationstart", SU_Widget.sliderAnimListener);
		$(targetselector).on("animationend", SU_Widget.sliderAnimListener);
	},
	sliderAnimListener: function(e) {
		switch(e.type) {
			case "animationstart":
			case "webkitAnimationStart":
				var peekCount = jQuery.data(this, 'slidePeekCount');
				if (typeof(peekCount) == 'undefined') {
					peekCount = 0;
				}
				peekCount++;
				jQuery.data(this, 'slidePeekCount', peekCount);
				if (peekCount > 2) {
					$(this).find('.slider').addClass('noAnim');
				}
				break;
			case "animationend":
			case "webkitAnimationEnd":
				break;
		}
	},
	EventSlider_Landscape: function(mslWidgetId, targetselector) {
		var dayColors = ['bb-green', 'bb-yellow', 'bb-pink', 'bb-blue'];
		$(targetselector).addClass('sliderSmall');
		var slider = $(document.createElement('div')).addClass('slider');
		var dayIndex = 0, prevDate = '01/01/2000';
		var events = SU_Data.getEvents(mslWidgetId, 20);
		jQuery.each(events, function(i, o) {
			if (i > 0) {
				if (prevDate != o.Date.format('dd/MM/yyyy')) {
					dayIndex = (dayIndex+1) % dayColors.length;
				}
			}
			var slide = $(document.createElement('div')).addClass('slide');
			var inner = $(document.createElement('div')).addClass('slide-inner').addClass(dayColors[dayIndex]); // use dayindex to decide class
			var link = $(document.createElement('a')).attr('href', o.Link.replace('../', '')).attr('rel', 'deep');
			var img = $(document.createElement('img'));
			if (o.Image != null && o.Image.length > 0) {
				img.on('error', function() {
					$(this).replaceWith($(document.createElement('div')).addClass('orgText').text(o.Organisation));
					
				});
				var imgSrc = o.Image.substring(0, o.Image.indexOf('?'));
				imgSrc = imgSrc + '?' + $.param({thumbnail_width: 217, thumbnail_height: 157, fill_colour: 'f6f6f8', resize_type: 'CropToFit'});
				img.attr('src', 'http://www.swansea-union.co.uk' + imgSrc);
			}
			else {
				img = $(document.createElement('div')).addClass('orgText').text(o.Organisation);
			}
			var title = $(document.createElement('div')).addClass('event-title').text(o.Title);
			var date = $(document.createElement('div')).addClass('event-date').text(o.Date.format('dddd, d MMMM yyyy'));
			$(link).append(img).append(title).append(date);
			$(inner).append(link);
			$(slide).append(inner);
			$(slider).append(slide);
			prevDate = o.Date.format('dd/MM/yyyy');
		});
		$(targetselector).append(slider);
		$(targetselector).iosSlider({
			snapToChildren: true,
			scrollbar: false,
			desktopClickDrag: true,
			infiniteSlider: false
		});
		$(targetselector).on("webkitAnimationStart", SU_Widget.sliderAnimListener);
		$(targetselector).on("webkitAnimationEnd", SU_Widget.sliderAnimListener);
		$(targetselector).on("animationstart", SU_Widget.sliderAnimListener);
		$(targetselector).on("animationend", SU_Widget.sliderAnimListener);
	},
	EventSlider_ActivitiesCategorySlider: function(typeName, targetselector) {
		$(targetselector).find('div').remove();
		$(targetselector).addClass('sliderActivities');
		var slider = $(document.createElement('div')).addClass('slider');
		$(targetselector).addClass((typeName == "Sport" || typeName == "Sports") ? "sport" : "society");
		var categories = SU_Data.getActivities()
								.filter(function(d) { return d.Type == typeName; })
								.map(function(d) { return d.Category; }).getUnique();
		jQuery.each(categories, function(i, o) {
			var slide = $(document.createElement('div')).addClass('slide');
			var inner = $(document.createElement('div')).addClass('slide-inner');
			var link = $(document.createElement('a')).addClass('su-activity-category').attr('href', '#');
			var img = $(document.createElement('img')).attr('src', '/stylesheet/su/activities-cat' + o.replace(/\W/g,'') + ".png");
			var title = $(document.createElement('div')).addClass('activitiesCatName').text(o);
			if (i == 0) {
				slide.addClass("selected");
				link.addClass("selected");
			}
			title.addClass((typeName == "Sport" || typeName == "Sports") ? "sport" : "society");
			link.append(img).append(title);
			link.on('click', function (e) {
				e.preventDefault();
				$(targetselector).find('div.slide').removeClass('selected');
				$(this).closest('div.slide').addClass('selected');
				$(targetselector).find('a.su-activity-category').removeClass('selected');
				$(this).addClass('selected');
				SU_Widget.EventSlider_ActivitiesListSlider($(this).text(), "#su-activitiesList");
			});
			inner.append(link);
			slide.append(inner);
			$(slider).append(slide);
		});
		$(targetselector).append(slider);
		$(targetselector).iosSlider({
			snapToChildren: true,
			scrollbar: false,
			desktopClickDrag: true,
			infiniteSlider: false
		});
	},
	EventSlider_ActivitiesListSlider: function(catName, targetselector) {
		$(targetselector).fadeOut("fast", function() {
			$(targetselector).iosSlider('destroy');
			$(targetselector).find('div').remove();
			$(targetselector).addClass('sliderActivities');
			var slider = $(document.createElement('div')).addClass('slider');
			var activities = SU_Data.getActivities().filter(function(d) { return d.Category == catName; });
			jQuery.each(activities, function(i, o) {
				if (i == 0) {
					$(targetselector).addClass((o.Type == "Sport" || o.Type == "Sports") ? "sport" : "society");
				}
				var slide = $(document.createElement('div')).addClass('slide');
				var inner = $(document.createElement('div')).addClass('slide-inner');
				var link = $(document.createElement('a')).attr('href', '#');
				var img = $(document.createElement('img')).attr('src', o.Image);
				var title = $(document.createElement('div')).addClass('activitiesItemName').text(o.Name);
				title.addClass((o.Type == "Sport" || o.Type == "Sports") ? "sport" : "society");
				$(link).append(img).append(title);
				$(inner).append(link);
				$(slide).append(inner);
				$(slider).append(slide);
			});
			$(targetselector).append(slider);
			var listType = activities[0].Type;
			$('#su-activitiesListHeader').text(((listType == "Sport" || listType == "Sports") ? "Sports Clubs - " : "Societies - ") + catName);
			$(targetselector).iosSlider({
				snapToChildren: true,
				scrollbar: false,
				desktopClickDrag: true,
				infiniteSlider: false
			});
			$(targetselector).fadeIn();
		});
	},
	OfficerSlider: function(mslWidgetId, targetselector) {
		if (typeof SU_Data == "undefined") {
			console.error("SU_Widget: SU_Data not defined.");
			return;
		}
		if (typeof SU_Data.personData[mslWidgetId] == "undefined") {
			console.error("SU_Widget: SU_Data doesn't contain a person widget called '" + mslWidgetId + "'");
			return;
		}
		if ($(targetselector).length != 1) {
			console.error("SU_Widget: Officer slider target object invalid '" + targetselector + "'");
			return;
		}
		$(targetselector).addClass('sliderOfficers');
		var slider = $(document.createElement('div')).addClass('slider');
		var officers = SU_Data.personData[mslWidgetId];
		jQuery.each(officers, function(i, o) {
			var slide = $(document.createElement('div')).addClass('slide');
			var inner = $(document.createElement('div')).addClass('slide-inner');
			var link = $(document.createElement('a')).attr('href', o.Link);
			var img = $(document.createElement('img')).attr('src', 'http://www.swansea-union.co.uk' + o.Image);
			var name = $(document.createElement('div')).addClass('officer-name').text(o.Name);
			var title = $(document.createElement('div')).addClass('officer-title').text(o.Title);
			var email = $(document.createElement('a')).addClass('officer-email').text(o.Email).attr('href','mailto:' + o.Email);
			$(link).append(title).append(img).append(name).append(email);
			$(inner).append(link);
			$(slide).append(inner);
			$(slider).append(slide);
		});
		$(targetselector).append(slider);
		$(targetselector).iosSlider({
			snapToChildren: true,
			scrollbar: false,
			desktopClickDrag: true,
			infiniteSlider: false
		});
	},
	Coverflow: function(eventList, targetSelector) {
		eventList = SU_Data.getEvents(eventList, 7);
		var randomId = 'icarousel' + Math.floor((Math.random() * 10000) + 1);
		
		var container = $(document.createElement('div')).addClass('carousel-container');
		var icarousel = $(document.createElement('div')).addClass('icarousel').attr('id', randomId);
		container.append(icarousel);
		$(targetSelector).append(container);
		
		var carouselObj = $('#' + randomId);
		jQuery.each(eventList, function(i, o) {
			var slide = $(document.createElement('div')).addClass('slide');
			var link = $(document.createElement('a')).attr('href', o.Link.replace('../', '')).attr('rel', 'deep');
			o.Image = o.Image.substring(0, o.Image.indexOf('?'));
			o.Image = o.Image + '?' + $.param({thumbnail_width: 480, thumbnail_height: 679, resize_type: 'ResizeFitAll'});
			var img = $(document.createElement('img'));
			img.on('error', function() {
				$(this).attr('src', 'http://placehold.it/480x679');
			});
			img.attr('src', 'http://www.swansea-union.co.uk' + o.Image);
			link.append(img);
			slide.append(link);
			carouselObj.append(slide);
		});
		
		carouselObj.iCarousel({
                    easing: 'ease-in-out',
                    slides: 5,
                    make3D: true,
                    perspective: 25,
                    animationSpeed: 700,
                    pauseTime: 5000,
                    startSlide: 0,
                    directionNav: true,
                    autoPlay: true,
                    keyboardNav: true,
                    touchNav: true,
                    mouseWheel: false,
                    pauseOnHover: true,
                    direction: 'rtl',
                    timer: 'none',
                    onBeforeChange: function(){}, // Triggers before a slide change
                    onAfterChange: function(){}, // Triggers after a slide change
                    onLastSlide: function(){}, // Triggers when last slide is shown
                    onAfterLoad: function(){} // Triggers when carousel has loaded
                });
	}
};