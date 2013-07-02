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
			var image = $(document.createElement('img')).addClass('author').addClass('img-polaroid').attr('src', 'http://www.swansea-union.co.uk/' + o.Image);
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
	},
	EventSlider_Portrait: function(mslWidgetId, targetselector) {
		var dayColors = ['bb-green', 'bb-yellow', 'bb-pink', 'bb-blue'];
		$(targetselector).addClass('sliderPortrait');
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
			var img = $(document.createElement('img')).attr('src', 'http://www.swansea-union.co.uk' + o.Image);
			var title = $(document.createElement('div')).addClass('event-title').text(o.Title);
			var date = $(document.createElement('div')).addClass('event-date').text(o.Date.format('dddd, dS mmmm yyyy'));
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
				if (peekCount > 3) {
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
			var img = $(document.createElement('img')).attr('src', 'http://www.swansea-union.co.uk' + o.Image);
			var title = $(document.createElement('div')).addClass('event-title').text(o.Title);
			var date = $(document.createElement('div')).addClass('event-date').text(o.Date.format('dddd, dS mmmm yyyy'));
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
	},
	EventSlider_ActivitiesCategorySlider: function(typeName, targetselector) {
		$(targetselector).find('div').remove();
		$(targetselector).addClass('sliderActivities');
		var slider = $(document.createElement('div')).addClass('slider');
		var categories = SU_Data.getActivities()
								.filter(function(d) { return d.Type == typeName; })
								.map(function(d) { return d.Category; }).getUnique();
		jQuery.each(categories, function(i, o) {
			var slide = $(document.createElement('div')).addClass('slide');
			var inner = $(document.createElement('div')).addClass('slide-inner');
			var link = $(document.createElement('a')).addClass('su-activity-category').attr('href', '#');
			var img = $(document.createElement('img')).attr('src', './img/activities/cat' + o.replace(/\W/g,'') + ".png");
			var title = $(document.createElement('div')).addClass('activitiesCatName').text(o);
			title.addClass((typeName == "Sport" || typeName == "Sports") ? "sport" : "society");
			$(link).append(img).append(title);
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
	EventSlider_ActivitiesListSlider: function(catName, targetselector) {
		$(targetselector).fadeOut("fast", function() {
			$(targetselector).iosSlider('destroy');
			$(targetselector).find('div').remove();
			$(targetselector).addClass('sliderActivities');
			var slider = $(document.createElement('div')).addClass('slider');
			var activities = SU_Data.getActivities().filter(function(d) { return d.Category == catName; });
			jQuery.each(activities, function(i, o) {
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
			$('#su-activitiesListHeader').text("Sports Clubs - " + catName);
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
			o.Image = o.Image + '?' + $.param({thumbnail_width: 480, thumbnail_height: 679, resize_type: 'CropToFit'});
			var img = $(document.createElement('img')).attr('src', 'http://www.swansea-union.co.uk' + o.Image);
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