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

	/* Mobile Login */
	if ($.exists('.page_mobilelogin')){	
		var loginTarget = $('#su_page_content .wrapper');
		$('.login-content.swansea-uni-student').appendTo(loginTarget);
		var $guestStaffLogin = $('.login-content.staff').appendTo(loginTarget).show();
		//$guestStaffLogin.find('.login-content.staff .login-font').text('Guests/Staff');
		$('.login-admin-links').appendTo(loginTarget).show();
		$('.login-controlpanel-links').appendTo(loginTarget).show();
	}
    
	/* Quick Fix -- Remove */
	/*
	$("#referendum_ballot_submit input[value=Abstain]").hide();
	if (location.href.indexOf('elections/nominations/33') != -1) {
         $('.election_requirement_list').parents('.vpForm').hide().prev().hide().prev().hide();
    }
	*/	
	
    /*
     * COVERFLOW
     */
	if ($.exists('.page_root')){
		SU_Widget.Coverflow('Data_Events_FeaturedUnion', '#coverflow');
	}
	else if($.exists('.page_events')){
		SU_Widget.Coverflow('Data_Events_FeaturedEnts', '#coverflow');
	}
	else if($.exists('.page_travelshop.page_new')){
		SU_Widget.Coverflow('Data_Events_FeaturedTravel', '#coverflow');
	}
	else if($.exists('.page_tv')&&!$.exists('.page_advice')&&!$.exists('.page_travel')){
		SU_Widget.Coverflow('Data_Events_FeaturedUnion', '#coverflow', '960', '1358');
	}
	else if($.exists('.page_tv.page_advice')){
		SU_Widget.Coverflow('Data_Events_FeaturedAdvice', '#coverflow', '960', '1358');
	}
	else if($.exists('.page_travelshop.page_new')||$.exists('.page_tv.page_travel')){
		SU_Widget.Coverflow('Data_Events_FeaturedTravel', '#coverflow', '960', '1358');
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
			$('#my-events').append('<h3>You are not a member of any Sports or Societies.<br />Visit our <a href="/sports">Sport</a> and <a href="/societies">Society</a> pages to see what activities you can join.</h3>');
		}
    }
	
	/*
     * EVENTS - Travel Shop
     */
    var pageTriggers_TravelShop_Main = ['.page_travelshop.page_new'];
    if ($.exists(pageTriggers_TravelShop_Main)) {
		// Main ENTS List
		console.log('initiated travel shop page events');
        SU_Widget.EventSlider_Portrait('Data_Events_FeaturedTravel','#su-eventsPortrait');
        SU_Widget.EventSlider_Filter('Data_Events_FeaturedTravel', '#su-eventsPortraitFilter', '#su-eventsPortrait');
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
	  return a.hostname.replace('www.','');
	}
	function url_pathname(data) {
	  var    a      = document.createElement('a');
			 a.href = data;
	  return a.pathname;
	}
	
	
	
	
	/*
     * Activity Admin - Edit Group Pages
     */
	// This removes option for Admins to suicide their privileges  
    var pageTriggers_EditGroups = ['.page_organisation.page_editmembers'];
    if ($.exists(pageTriggers_EditGroups)) {
		var activityRole = $('#edit_members h1').first().text().toLowerCase();
		if(activityRole == 'president' || activityRole == 'captain'){
			$('#edit_members .msl_table:first-of-type td').each(function(){
				var thisRole = $(this).text().toLowerCase();
				// Magic words - Super User needs to have the Words Sport or Society as last name
				if(thisRole.indexOf("society") > -1 || thisRole.indexOf("sport") > -1){
					$(this).prev('td').children('input').hide();
				}
			});
		}
	
	}
	
	
	
	
	
    /*
     * Activity Purchases - Customisation Pages
     */
    var pageTriggers_CustomizePages = ['.page_shop.page_customise'];
    if ($.exists(pageTriggers_CustomizePages)) {
	
		$('.vpFormPair').each(function () {
			var thisTitle = $(this).find('.title').text().toLowerCase();
			if(thisTitle.indexOf('donate')>0){
				var fieldid = $(this).find('input').attr('name');
				$(this).find('.vp_content').empty();
				$('.vp_content').append($('<select name="' + fieldid + '" id="' + fieldid + '" onfocus="javascript:vp_highlight(this.parentNode.parentNode);" onblur="javascript:vp_unhighlight(this.parentNode.parentNode);"></select>'));
				var socOptions = $(this).find('select');

				$.each(SU_Data.membershipsData, function(d) {
					var option = $("<option>" + SU_Data.membershipsData[d].Name + "</option>").attr('value', SU_Data.membershipsData[d].Name);
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
				fbPageId = fbPageId.substring(urlSlice);
			}
			console.log(fbPageId);
			fbPageId = 'http://facebook.com/' + fbPageId.replace(/^\/|\/$/g, '');
			console.log(fbPageId);
			var fbLink = $(document.createElement('a')).attr('target', '_blank').attr('href', fbPageId).text('Society Facebook Page');
			$('div.mslwidget#su-org-facebook-page').html(fbLink);
		}
		if ($.exists('#suorgeventlist')) {
			SU_Widget.EventSlider_Landscape('Data_Events_Organisation', '#suorgeventlist');
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
	
	/*
	 * Global Document Slider
	 * TO DO: Add Slider Script
	 */
	function createDocumentSlider(source, target){
		var resourceSource = '';
		var resourcesTarget = '';
		var resourceHtml = '';
		var resourceName = '';
		var resourceNameIsUrl = false;
		var resourceIndex = '';
		var resourceFileTxt = '';
		var resourceDocType = 'default';
		var resourceAcceptableType = [
			'doc','docx','pdf','xls','xlsx','ppt','pptx','jpeg','jpg','gif','png','bmp'
		];
		// Set default source
		if($(source).length){
			resourceSource = source;
		}else{
			resourceSource = '#article .content'
		}
		// Set default target 
		if($(target).length){
			resourceTarget = target;
		}else{
			resourceTarget = '.wrapper.clearfix';
		}
		
		var links = $(resourceSource + ' a');
		
		$.each(links, function(i) {
		  console.error('New Link');
		  var resourceFilename = false;
		  var thisUrl = links[i].href.replace(/\/$/,'');
			console.log('the links url ' + thisUrl);
		  resourceTitle = $(links[i]).text();
			console.log('text inside link ' + resourceTitle);
		  resourceDocType = thisUrl.split('.').pop();
			console.log('document extension ' + resourceDocType);
		  if ($.inArray(resourceDocType, resourceAcceptableType)<0){
				console.log('text inside link ' + resourceTitle);
			  if(url_domain(document.URL) == url_domain(thisUrl)){
				  resourceDocType = 'internal';
				  //resourceFilename = url_pathname(thisUrl);
			  }else if(thisUrl.indexOf("mailto:")>-1 && thisUrl.indexOf("@")>0){
				  resourceDocType = 'email';
			  }else if(thisUrl.indexOf("facebook.com")>-1){
				  resourceDocType = 'facebook';
			  }else if(thisUrl.indexOf("twitter.com")>-1){
				  resourceDocType = 'twitter';
			  }else if(thisUrl.indexOf("youtube")>-1){
				  resourceDocType = 'youtube';
			  }else if(thisUrl.indexOf("flickr.com")>-1){
				  resourceDocType = 'flickr';
			  }else if(thisUrl.indexOf("tumblr.com")>-1){
				  resourceDocType = 'tumblr';
			  }else{
				  resourceDocType = 'external';
			  }
			  console.log('resourceDocType ' + resourceDocType);
		  }
		  
		  
		  if(!resourceFilename){
			resourceIndex = thisUrl.lastIndexOf("/") + 1;
			console.log('resourceIndex ' + resourceIndex);
			
			if(thisUrl.substr(resourceIndex).indexOf('.')<0 && url_pathname(thisUrl).indexOf('/')<0){
				// Relative Link?
				resourceFilename = url_domain(thisUrl);
				console.log('1resourceFilename ' + resourceFilename);
			}else if(url_pathname(thisUrl).replace(/^\/|\/$/g, '').indexOf('/')>-1){
				// Long URL 
				console.error(url_pathname(thisUrl));
				console.error(url_pathname(thisUrl).replace(/^\/|\/$/g, '').indexOf('/'));
				resourceFilename = url_domain(thisUrl) + "&#133;" + thisUrl.substr(resourceIndex);
				console.log('2resourceFilename ' + resourceFilename);
			}else{
				// 
				console.error(thisUrl);
				console.error('x');
				console.error(thisUrl.substr(resourceIndex));
				console.error(thisUrl);
				if(thisUrl.indexOf('/') > -1){
					console.error('y');
					resourceFilename = url_domain(thisUrl) + "/" + thisUrl.substr(resourceIndex);
					console.error(resourceFilename);
				}else{
					console.error('z');
					
					resourceFilename = url_domain(thisUrl);
					resourceFilename = thisUrl.split(':').pop();
					console.error(resourceFilename);
				}
			}
			
		  }
		  
		  resourceFilename = decodeURIComponent(resourceFilename.replace(/\/$/,''));
		  console.log('4resourceFilename' + resourceFilename);
		  
		  if(resourceTitle.indexOf('http')>-1 || resourceTitle.indexOf('mailto:')>-1 || resourceTitle.indexOf('www.')>-1 || resourceTitle.indexOf('.com')>-1 || resourceTitle.indexOf('ac.uk')>-1 || resourceTitle.indexOf('.co.uk')>-1 || resourceTitle.indexOf('.org')>-1){
			resourceNameIsUrl = true;
			console.error('is url');
		  }
		  
		  console.error('here');
		  console.log(resourceFilename);
		  console.log(resourceNameIsUrl);
		  
		  
		  if(resourceFilename.length>0 && resourceDocType != 'email' && !resourceNameIsUrl){
			resourceFileTxt = resourceTitle + '<br/>' + resourceFilename;
			console.log('1resourceFileTxt ' + resourceFileTxt);
		  }else{
			resourceFileTxt = resourceFilename;
			console.log('2resourceFileTxt ' + resourceFileTxt);
		  }
		  
		  var resourceClassName = 'document-'+resourceDocType;
		  resourceHtml = resourceHtml + "<a title='" + resourceDocType + "' class='resource-link-item "+
		  resourceClassName + "' href='" + links[i].href + " '><span class='resource-link-name'>" 
		  + resourceFileTxt + "</span></a>";        
		});
   
		resourceHtml = '<div class="page-resources wrapper">' + resourceHtml + '</div>';
		$(resourceTarget).append(resourceHtml);
	}
	createDocumentSlider();
	
});