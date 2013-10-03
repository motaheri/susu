	/*
     * ACTIVITIES	
     */

	var currentWebUrl = window.location.href;
	if (currentWebUrl.indexOf('swansea-union.co.uk/activities') > 0) {
		currentWebUrl = currentWebUrl.replace('swansea-union.co.uk/activities','swansea-union.co.uk/organisation');
		window.location.replace(currentWebUrl);
    }



jQuery.exists = function (selectors) {
    if (typeof selectors == "string") {
        return $(selectors).length > 0;
    }
    else if (typeof selectors == "object") {
        for (var i = 0; i < selectors.length; i++) {
            if ($(selectors[i]).length > 0) {
                return true;
            }
        }
    }
    return false;
}

$(document).ready(function() {
    
    /*
     * COVERFLOW
     */
	if ($.exists('.page_root')){
		SU_Widget.Coverflow('Data_Events_FeaturedUnion', '#coverflow');
	}
	else if($.exists('.page_events')){
		SU_Widget.Coverflow('Data_Events_FeaturedEnts', '#coverflow');
	}
	else if($.exists('.page_tv')){
		SU_Widget.Coverflow('Data_Events_FeaturedUnion', '#coverflow', '960', '1358');
	}
    
    /*
     * NEWS
     */
    var pageTriggers_News = ['.page_root', '.page_frontpage'];
    if ($.exists(pageTriggers_News)) {
        SU_Widget.NewsWidget('Data_News_Main', '#isonews', 10);
    }
    
    /*
     * EVENTS - MAIN LIST
     */
    var pageTriggers_Events_Main = ['.page_root', '.page_events', '.page_frontpage'];
    if ($.exists(pageTriggers_Events_Main)) {
		// Main ENTS List
        SU_Widget.EventSlider_Portrait('Data_Events_Ents','#su-eventsPortrait');
        SU_Widget.EventSlider_Filter('Data_Events_Ents', '#su-eventsPortraitFilter', '#su-eventsPortrait');
		
		// Personal MY EVENTS List
        var myOrgs = SU_Data.membershipsData.map(function(d) { return d.Name; }).sort();
		if (myOrgs.length > 0) {
	        SU_Widget.EventSlider_Landscape('Data_Events_Activities','#su-eventsLandscape');
	        SU_Widget.EventSlider_Filter('Data_Events_Activities', '#su-eventsLandscapeFilter', '#su-eventsLandscape', [], myOrgs);
		}
		else {
			$('#my-events').append('<h2>You are not a member of any Sports or Societies.<br />Visit our <a href="/sports">Sport</a> and <a href="/societies">Society</a> pages to see what activities you can join.</h2>');
		}
    }
	
	/*
	 * EVENTS - SOCIETY BOOKINGS
	 */
	if ($.exists('.page_events.page_societies')) {
		$('div#cover').addClass('coverSocieties');
	}
    
    /*
     * OFFICER BLOGS
     */
    var pageTriggers_OfficerBlogs = ['.page_root', '.page_frontpage'];
    if ($.exists(pageTriggers_OfficerBlogs)) {
        SU_Widget.BlogWidget('Data_Blogs_Officer', '#officer-blogs', 5);
    }
	
	
	function url_domain(data) {
	  var    a      = document.createElement('a');
			 a.href = data;
	  return a.hostname;
	}
	
    /*
     * Activity Purchases - Customisation Pages
     */
    var pageTriggers_CustomizePages = ['.page_shop.page_customise'];
    if ($.exists(pageTriggers_CustomizePages)) {
	
		$('.vpFormPair').each(function () {
			if ($(this).find('.title').text() == 'Choose Society or Club name *') {
				var fieldid = $(this).find('input').attr('name');
				$(this).find('.vp_content').empty();
				$('.vp_content').append($('<select name="' + fieldid + '" id="' + fieldid + '" onfocus="javascript:vp_highlight(this.parentNode.parentNode);" onblur="javascript:vp_unhighlight(this.parentNode.parentNode);"></select>'));
				var socOptions = $(this).find('select');
				$(SU_Data.types.membershipObj.Name).each(function () {
					var option = $("<option>" + $(this).Name() + "</option>").attr('value', $(this).Name);
					socOptions.append(option);                
				});
			}
		});
	
	}
	
	
	
	
	/*
     * ORGANIZATIONS
     */
    var pageTriggers_Organizations = ['.page_organisation'];
	if ($.exists(pageTriggers_Organizations)) {
		$('.mslwidget .vp_content textarea').attr('rows', 1).attr('cols', 30);
		var matchingOrgs = SU_Data.activitiesData.filter(function(d) { return d.Link == window.location.pathname && d.Link.length > 0; });
		if (matchingOrgs.length > 0) {
			var orgType = matchingOrgs[0].Type;
			if (orgType == "Sports") {
				$('div#cover').addClass('coverSports');
			}
			else {
				$('div#cover').addClass('coverSocieties');
			}
		}
		var fbPageId = $('div.mslwidget#su-org-facebook-page').text();
		if (fbPageId.length > 3) {
			var hasFbDomain = (url_domain(fbPageId) == 'facebook.com');
			if(hasFbDomain){
				var urlSlice = parseInt(fbPageId.indexOf("facebook.com") + 12);
				fbPageId = fbPageId.substring(urlSlice).replace(/^\/|\/$/g, '');
			}
			var fbLink = $(document.createElement('a')).attr('target', '_blank').attr('href', 'http://www.facebook.com/' + fbPageId).text('Society Facebook Page');
			$('div.mslwidget#su-org-facebook-page').html(fbLink);
		}
	}
    if ($.exists(pageTriggers_Organizations)) {
        var pageName = $('#page-badge-title').text();
		if(!pageName){pageName = $('.msl-grouping-context-control').text();}
		pageName = pageName.replace('(change)','');
		$("#cover .banner-title").html(pageName).show('300');
    }
	


	
	/*
	 * FRONT PAGE MEDIA
	 */
	var pageTriggers_OfficerBlogs = ['.page_root', '.page_frontpage'];
    if ($.exists(pageTriggers_OfficerBlogs)) {
		$('#su-media-frontpage').dcSocialStream({
			feeds: {
				twitter: {
					id: 'Sinkswansea,SinCitySwansea,SUSUflux,thewaterfrontSU,SwanseaUnion,SUSUVoice,studentswansea',
					intro: 'Tweeted',
					search: 'Tweeted',
					out: 'intro,thumb,text,share',
					retweets: false,
					replies: false,
					images: 'small',
					url: 'http://studentswansea.co.uk/twitter/twitter.php',
					icon: 'icon-social-twitter.png'
				},
				facebook: {
					id: '18315300553,153740337972319', //Facebook Timeline/160254513987568
					out: 'user,intro,text',
					text: 'content',
					comments: 0,
					image_width: 6, //3 = 600 4 = 480 5 = 320 6 = 180
					icon: 'icon-social-facebook.png'
				},
				youtube: {
					id: 'StudentSwanseaEvents',
					intro: 'Uploaded,Favorite,New Video',
					search: 'Search',
					out: 'thumb,text,user,share',
					feed: 'uploads,favorites,newsubscriptionvideos',
					thumb: 'default',
					icon: 'icon-social-youtube.png'
				}
			},
			rotate: {
				delay: 0
			},
			twitterId: '',
			control: false,
			filter: false,
			wall: true,
			cache: false,
			order: 'date',
			max: 'limit',
			limit: 1,
			height: 450,
			iconPath: '/stylesheet/su/',
			imagePath: '/stylesheet/su/',
		});
	}
	
	resetDeepLinks();
	
	/*
	 * AUTO FACEBOOK GALLERY
	 */
    $('.su-fbgallery').each(function() {
		var container = $(this);
		var fbGalleryId = $(this).attr('id');
		if (fbGalleryId == null || typeof(fbGalleryId) != "string" || fbGalleryId.length < 5 || fbGalleryId.substring(0,2) != "fb") {
			console.error('SU Facebook Gallery: Invalid ID. The DIV ID must be like fb123456789.')
			return;
		}
		fbGalleryId = fbGalleryId.substring(2);
		var slider = $(document.createElement('div')).addClass('slider');
		SU_Data.social.getFacebookGallery(fbGalleryId, function(data, name) {
			$("<h2>" + name + "</h2>").insertBefore(container);
			$.each(data, function() {
				var desiredImageWidth = parseInt(this.Width * (161.0 / this.Height));
				var slide = $(document.createElement('div')).addClass('slide');
				var img = $(document.createElement('img'));
				img.css('width', desiredImageWidth + 'px');
				img.css('height', '161px');
				img.attr('src', this.Image);
				slide.append(img);
				slider.append(slide);
			});
			container.append(slider);
			$(container).iosSlider({
				snapToChildren: true,
				scrollbar: false,
				desktopClickDrag: true,
				infiniteSlider: false
			});
		});
	});
	
	/*
	 * FACEBOOK PAGE LIKE BUTTON
	 */
	if (typeof(SU_Facebook) == 'object') {
		var facebookLikeButtonClass = 'su-facebook-like-button';
		var facebookLikeButtonSelector = 'div.' + facebookLikeButtonClass;
		$(facebookLikeButtonSelector).each(function () {
			var path = window.location.pathname;
			if (typeof(SU_Facebook.page_likes[path]) == "string") {
				var pageName = SU_Facebook.page_likes[path];
				if (typeof(pageName) == "string" && pageName.length > 4) {
					var like = $(this).first();
					like.attr('data-href', 'https://www.facebook.com/' + pageName);
					like.attr('data-width', '300');
					like.attr('data-height', '190');
					like.attr('data-show-faces', 'true');
					like.attr('data-header', 'false');
					like.attr('data-stream', 'false');
					like.attr('data-show-border', 'false');
					like.removeClass(facebookLikeButtonClass).addClass('fb-like-box');
					return;
				}
			}
			$(this).remove();
		});
		facebookLikeButtonClass = 'su-facebook-like-buttonsimple';
		facebookLikeButtonSelector = 'div.' + facebookLikeButtonClass;
		$(facebookLikeButtonSelector).each(function () {
			var path = window.location.pathname;
			if (typeof(SU_Facebook.page_likes[path]) == "string") {
				var pageName = SU_Facebook.page_likes[path];
				if (typeof(pageName) == "string" && pageName.length > 4) {
					var like = $(this).first();
					like.attr('data-href', 'https://www.facebook.com/' + pageName);
					like.attr('data-width', '300');
					like.attr('data-height', '70');
					like.attr('data-show-faces', 'false');
					like.attr('data-header', 'false');
					like.attr('data-stream', 'false');
					like.attr('data-show-border', 'false');
					like.removeClass(facebookLikeButtonClass).addClass('fb-like-box');
					return;
				}
			}
			$(this).remove();
		});
	}
});