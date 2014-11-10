/*
 * ACTIVITIES	
 */

/* Redirect unused sub-page to a more useful page */
var currentWebUrl = window.location.href;
if (currentWebUrl.indexOf('swansea-union.co.uk/activities') > 0) {
	window.location.replace('http://www.swansea-union.co.uk/yourunion/');
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


function getParameterByName(name,href){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( href );
  if( results == null )
	return "";
  else
	return decodeURIComponent(results[1].replace(/\+/g, " "));
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
	/* Varsity Temp Code */
	if (location.href.indexOf('mysport/thewelshvarsity') != -1) {
			var replaced = $("#page-org-join").html().replace(/membership/g,'ticket').replace(/Membership/g,'Ticket').replace(/organisation/g,'event').replace(/Organisation/g,'Event');
			$("#page-org-join").html(replaced);
    }
	
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
     * Breadcrumbs
     */
    var pageTriggers_BreadCrumbs = ['.wrapper #article .breadcrumb'];
    if ($.exists(pageTriggers_BreadCrumbs)) {
        SU_Widget.BreadCrumbWidget('.wrapper #article .breadcrumb');
		$('.wrapper .breadcrumb').show();
    }

    
    /*
     * NEWS
     */
    var pageTriggers_News = ['.page_root', '.page_frontpage'];
    if ($.exists(pageTriggers_News)) {
        SU_Widget.NewsWidget('Data_News_Main', '#isonews', 10);
    }

    
    /*
     * Union FrontPage Slider
     */	
    var pageTriggers_MyUnion_root = ['.page_root', '.page_frontpage'];
    if ($.exists(pageTriggers_MyUnion_root)) {
		var unionType = "FTO";
		var firstCat = SU_Data.unionData.filter(function(d) { return d.Type == "FTO" })[0].Category;
		SU_Widget.EventSlider_UnionCategorySlider(unionType, "#su-unionCat");
		SU_Widget.EventSlider_UnionListSlider(firstCat, "#su-unionList");
		$('#su-unionList').show();

		resetDeepLinks();	
	}
	
	
    /*
     * My Union Slider
     */		
    var pageTriggers_MyUnion = ['.page_yourunion'];
    if ($.exists(pageTriggers_MyUnion)) {		
		var unionType = "FTO";
		var firstCat = SU_Data.unionData.filter(function(d) { return d.Type == "FTO" || d.Type == "Other"; })[0].Category;
		SU_Widget.EventSlider_UnionCategorySlider(unionType, "#su-unionCat");
		SU_Widget.EventSlider_UnionListSlider(firstCat, "#su-unionList");
		$('#su-unionList').show();

		resetDeepLinks();
	}
	
	
	
    /*
     * Societies Slider
     */		
    var pageTriggers_societies = ['.page_societies'];
    if ($.exists(pageTriggers_societies)) {	
	
		var activityType = "Societies";
		var firstCat = SU_Data.activitiesData.filter(function(d) { return d.Type == activityType; })[0].Category;
		SU_Widget.EventSlider_ActivitiesCategorySlider(activityType, "#su-activitiesCat");
		SU_Widget.EventSlider_ActivitiesListSlider(firstCat, "#su-activitiesList");
		$('#su-activitiesList').show();
	
		resetDeepLinks();
	}
		
	
    /*
     * Sports Slider
     */		
    var pageTriggers_sports = ['.page_sports'];
    if ($.exists(pageTriggers_sports)) {	
	
		var activityType = "Sports";
		var firstCat = SU_Data.activitiesData.filter(function(d) { return d.Type == activityType; })[0].Category;
		SU_Widget.EventSlider_ActivitiesCategorySlider(activityType, "#su-activitiesCat");
		SU_Widget.EventSlider_ActivitiesListSlider(firstCat, "#su-activitiesList");
		$('#su-activitiesList').show();

		SU_Widget.EventSlider_Portrait('Data_Events_Sport','#su-eventsPortrait');
		resetDeepLinks();
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
			$('.events-container #my-events .scroll-left-arrow,.events-container #my-events .scroll-right-arrow').hide();
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
    /* Add option for ticket purchasers to donate money to their society/sport groups */
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
	 
	 
	 
	/* Clean up empty Containers first */
	
	// Remove any MSL widget that is empty because the org has not filled out their data 
	$('#page-org-info .mslwidget').filter(function () {
		return $.trim($(this).text()).length == 0;
	}).hide();
	
	// Remove Committee box if they haven't assigned their committee 
	// To Do: Add a nag/notice for the Amdin user as a reminder for them to fill it out
	if(($('.org-box.orgcommittee').text()).replace(/^\s\s*/, '').replace(/\s\s*$/, '') == ''){
		$('.org-box.orgcommittee').hide();
	}
	
	// Remove election box if no elections are currently running 
	if(($('.org-box.orgelection').text()).replace(/^\s\s*/, '').replace(/\s\s*$/, '') == ''){
		$('.org-box.orgelection').hide();
	}
	
	// Remove poll box if there is no current polls running on org page
	if(($('.org-box.orgpoll').text()).replace(/^\s\s*/, '').replace(/\s\s*$/, '') == ''){
		$('.org-box.orgpoll').hide();
	} 	
	 
	 
    var pageTriggers_Organizations = ['.page_mysociety,.page_mysport,.page_myunion,.page_myactivity,.page_organisation'];
	if ($.exists(pageTriggers_Organizations)) {
		// Best way to get the title of a page
		// To Do: move this to common functions 
		var orgTitle = document.getElementsByTagName('title')[0].text;
		// Resize text area input box
		$('.mslwidget .vp_content textarea').attr('rows', 1).attr('cols', 30);
		
		// Find current organization by matching against urls
		// To Do: move to common functions 
		var matchingOrgs = SU_Data.activitiesData.filter(function(d) { return d.Link == window.location.pathname && d.Link.length > 0; });
		
		if (matchingOrgs.length > 0) {
			var orgType = matchingOrgs[0].Type;
			// Add sports cover photo 
			if (orgType == "Sports") {
				$('div#cover').addClass('coverSports');
				$('#article .breadcrumb .dept0').attr('href', '/sports/');
				$('#article .breadcrumb .dept0').text(orgType);
			}
			// Add society cover photo 
			else {
				$('div#cover').addClass('coverSocieties');
				$('#article .breadcrumb .dept0').attr('href', '/societies/');
				$('#article .breadcrumb .dept0').text(orgType);
			}
		}
		
		// get Facebook page ID
		var fbPageId = $('div.mslwidget#su-org-facebook-page').text();
		if (fbPageId.length > 3 && fbPageId.indexOf('/groups/') == -1) { //Make sure it's a page and not a group
			var hasFbDomain = (fbPageId.indexOf('facebook.com') != -1);
			if(hasFbDomain){ // There has to be a better way of doing this, how about using the URL path function?
				var urlSlice = parseInt(fbPageId.indexOf("facebook.com") + 12); 
				fbPageId = fbPageId.substring(urlSlice); // get everything after the facebook.com domain
			}
			fbPageId = fbPageId.replace(/^\/+|\/+$/g, ''); // Then trim it
			var fbPageIdLink = 'https://facebook.com/' + fbPageId.replace(/^\/|\/$/g, ''); // Recreate the link for consistency 
			console.log(fbPageIdLink); 
			var fbPageTitle = orgTitle + ' Facebook Page';
			var fbLink = $(document.createElement('a')).attr('target', '_blank').attr('href', fbPageIdLink).text(fbPageTitle);
			// Add the facebook link to the org sidebar
			$('div.mslwidget#su-org-facebook-page').html(fbLink);
			
			// Standard FB Like button with friends' icons added to the sidebar. Will run automatically because of some code at the top of the template.
			var fbLikeButtonCode = '<div class="fb-like-box" data-href="http://www.facebook.com/'+fbPageId+'" data-width="350" data-height="285" data-colorscheme="light" data-show-faces="true" data-header="false" data-stream="false" data-show-border="false"></div>';
			
			$('#su-org-facebook-page').html(fbLikeButtonCode);
			
			// Hide then show to avoid flashing content 
			$('#su-org-facebook-page').parent().show();

		}else if(fbPageId.length > 3){
			
			// For groups we just add a link
			var fbPageTitle = orgTitle + ' Facebook Group';
			var fbLikeButtonCode = '<a href="'+fbPageId+'" target="_blank">'+ fbPageTitle +'</a>';
			
			$('#su-org-facebook-page').html(fbLikeButtonCode);
			$('#su-org-facebook-page').parent().show();
		}
		
		// Call the events Widget 
		if ($.exists('#suorgeventlist')) { 
			SU_Widget.EventSlider_Landscape('Data_Events_Organisation', '#suorgeventlist');
		}
		
		// Add the org name to the banner 
        var pageName = $('#page-badge-title').text();
		// ??
		if(!pageName){pageName = $('.msl-grouping-context-control').text();}
		// ??
		pageName = pageName.replace('(change)','');
		// ??
		$("#cover .banner-title").html(pageName).show('300');
    }
	

	/*
	Original YT Playlist Simone Gianni <simoneg@apache.org>
	Tweeked to work with Channels, Playlists and Single video. 
	*/

	(function() {
		function createPlayer(jqe, video, options) {
			var ifr = $('iframe', jqe);
			if (ifr.length === 0) {
				ifr = $('<iframe scrolling="no">');
				ifr.addClass('player');
			}
			var src = 'http://www.youtube.com/embed/' + video.id;
			if (options.playopts) {
				src += '?';
				for (var k in options.playopts) {
					src+= k + '=' + options.playopts[k] + '&';
				}  
				src += '_a=b';
			}
			ifr.attr('src', src);
			jqe.append(ifr);  
		}
		
		function createCarousel(jqe, videos, options) {
			var car = $('div.carousel', jqe);
			if (car.length === 0) {
				car = $('<div>');
				car.addClass('carousel');
				jqe.append(car);
				
			}
			$.each(videos, function(i,video) {
				options.thumbnail(car, video, options); 
			});
		}
		
		function createThumbnail(jqe, video, options) {
			var imgurl = video.thumbnails[0].url;
			var img = $('img[src="' + imgurl + '"]');
			if (img.length !== 0) return;
			img = $('<img>');    
			img.addClass('thumbnail');
			jqe.append(img);
			img.attr('src', imgurl);
			img.attr('title', video.title);
			img.click(function() {
				options.player(options.maindiv, video, $.extend(true,{},options,{playopts:{autoplay:1}}));
			});
		}
		
		var defoptions = {
			autoplay: false,
			user: null,
			carousel: createCarousel,
			player: createPlayer,
			thumbnail: createThumbnail,
			loaded: function() {},
			playopts: {
				autoplay: 0,
				egm: 1,
				autohide: 1,
				fs: 1,
				showinfo: 0
			}
		};
		
		
		$.fn.extend({
			youTubeChannel: function(options) {
				var md = $(this);
				md.addClass('youtube');
				md.addClass('youtube-channel');
				var allopts = $.extend(true, {}, defoptions, options);
				allopts.maindiv = md;
				
				var jsonUrl = '';	
				
				console.log('YT Type ' + allopts.type);
				
				if(allopts.type == 'Channel'){
					jsonUrl = 'http://gdata.youtube.com/feeds/users/' + allopts.user + '/uploads?alt=json-in-script&format=5&callback=?';
				}else if(allopts.type == 'Playlist'){
					jsonUrl = 'https://gdata.youtube.com/feeds/api/playlists/' + allopts.user + '?v=2&alt=json&callback=?';
				}
				
				console.log('JSON Url ' + jsonUrl);
				
				$.getJSON(jsonUrl, null, function(data) {
					var feed = data.feed;
					var videos = [];
					console.log('YT videos ' + videos);
					
					$.each(feed.entry, function(i, entry) {
						var thisVideoId = '';
						if(allopts.type == 'Channel'){
							thisVideoId = entry.id.$t.match('[^/]*$');
						}else if(allopts.type == 'Playlist'){
							thisVideoId = this.media$group.yt$videoid.$t;
						}
						var video = {
							title: entry.title.$t,
							id: thisVideoId,
							thumbnails: entry.media$group.media$thumbnail
						};
						videos.push(video);
					});
					allopts.allvideos = videos;
					allopts.carousel(md, videos, allopts);
					allopts.player(md, videos[0], allopts);
					allopts.loaded(videos, allopts);
				});
			} 
		});
		
	})();

	
	if ($.exists(pageTriggers_Organizations)) {
		var YTOrgInfo = $('div.mslwidget#su-org-youtube-channel').text().replace(/^\/+|\/+$/g, '');
	}
	
    if ($.exists(pageTriggers_Organizations) && YTOrgInfo != '') {
		
		var YTurlType = 'Channel';
		var hasYTDomain = (YTOrgInfo.indexOf('youtube.com/user') != -1);
		var YTinfo = YTOrgInfo;
		
		if(hasYTDomain){
			var urlSlice = parseInt(YTOrgInfo.indexOf("youtube.com/user") + 16);
			YTinfo = YTOrgInfo.substring(urlSlice);
			if(YTinfo.indexOf('?') != -1){ //Sometimes YouTube incorporates internal referrers into their URLS
				YTinfo = YTinfo.substring(0, YTinfo.indexOf('?'));
			}
			YTinfo = YTinfo.replace(/^\/+|\/+$/g, ''); //Trim
			if(YTinfo.indexOf('/') != -1){ //Sometimes YouTube incorporates extra slashes after username. http://www.youtube.com/user/suswansea/videos
				YTinfo = YTinfo.substring(0, YTinfo.indexOf('/'));
			}
			YTinfo = YTinfo.replace(/^\/+|\/+$/g, ''); //Trim again
		}else if(YTOrgInfo.indexOf('list=') != -1){
			YTurlType = 'Playlist';
			//Example: http://www.youtube.com/watch?v=Vw4KVoEVcr0&list=PL62E49BC6C80447FB
			YTinfo = getParameterByName('list',YTOrgInfo); 
		}else if(YTOrgInfo.indexOf('/watch?v=') != -1 || YTOrgInfo.indexOf('.com/v') != -1){
			// Example 1: http://www.youtube.com/watch?v=TKmm7oGyPHw
			// Example 2: http://www.youtube.com/v/TKmm7oGyPHw
			YTurlType = 'Video';
			YTinfo = getParameterByName('v',YTOrgInfo); 
			if(YTinfo == ''){
				var urlSlice = parseInt(YTOrgInfo.indexOf(".com/v") + 6);
				YTinfo = YTOrgInfo.substring(urlSlice);
			}
		}
		
		var youtubeOrgLink = '';
		if(YTurlType == 'Playlist' || YTurlType == 'Video'){
			youtubeOrgLink = '<a target="_blank" href="' + YTOrgInfo  + '">' + orgTitle + ' YouTube ' + YTurlType + '</a>';
		}else{
			youtubeOrgLink = '<a target="_blank" href="http://www.youtube.com/user/' + YTinfo + '">' + orgTitle + ' YouTube ' + YTurlType + '</a>';
		}
		
		$('div.mslwidget#su-org-youtube-channel').html(youtubeOrgLink);
		console.log('YT Link ' + youtubeOrgLink);
		if (YTurlType == 'Video') {
			YTOrgInfo = "//www.youtube.com/embed/" + YTinfo;
			var YTvideoCode = '<iframe class="YT-org-single-video" src="' + YTOrgInfo + '" frameborder="0" allowfullscreen></iframe>';
			$('.org-box.orgYTplayer .YTplayer').html(YTvideoCode).parent().show();
		}else if(YTurlType == 'Channel' || YTurlType == 'Playlist'){
		//YTChannelId.length > 3
			$(function() {
				// YTCHannelID needs to be YTINFO 
				$('.org-box.orgYTplayer .YTplayer').youTubeChannel({user : YTinfo, type : YTurlType});
				$('.org-box.orgYTplayer').show();
			});		
		}
	}
	
	/* Unescape Twitter embed code */
	function HTMLDecode(encodedStr){
		return $("<div/>").html(encodedStr).text();
	}
	$('.org-box.org-twitter-embed').hide();
	var getTwitterEmbedCode = $('.org-box.org-twitter-embed').html();
	var decodeTwitterEmbedCode = HTMLDecode(getTwitterEmbedCode);
	$('#page-org-info .org-twitter').html(decodeTwitterEmbedCode).show();
	
	
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
		  //console.log('New Link');
		  var resourceFilename = false;
		  var thisUrl = links[i].href.replace(/\/$/,'');
			//console.log('the links url ' + thisUrl);
		  resourceTitle = $(links[i]).text();
			//console.log('text inside link ' + resourceTitle);
		  resourceDocType = thisUrl.split('.').pop();
			//console.log('document extension ' + resourceDocType);
		  if ($.inArray(resourceDocType, resourceAcceptableType)<0){
				//console.log('text inside link ' + resourceTitle);
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
			  //console.log('resourceDocType ' + resourceDocType);
		  }
		  
		  
		  if(!resourceFilename){
			resourceIndex = thisUrl.lastIndexOf("/") + 1;
			//console.log('resourceIndex ' + resourceIndex);
			
			if(thisUrl.substr(resourceIndex).indexOf('.')<0 && url_pathname(thisUrl).indexOf('/')<0){
				// Relative Link?
				resourceFilename = url_domain(thisUrl);
				//console.log('1resourceFilename ' + resourceFilename);
			}else if(url_pathname(thisUrl).replace(/^\/|\/$/g, '').indexOf('/')>-1){
				// Long URL 
				//console.log(url_pathname(thisUrl));
				//console.log(url_pathname(thisUrl).replace(/^\/|\/$/g, '').indexOf('/'));
				resourceFilename = url_domain(thisUrl) + "&#133;" + thisUrl.substr(resourceIndex);
				//console.log('2resourceFilename ' + resourceFilename);
			}else{
				// 
				/*console.log(thisUrl);
				console.log('x');
				console.log(thisUrl.substr(resourceIndex));
				console.log(thisUrl);*/
				if(thisUrl.indexOf('/') > -1){
					//console.log('y');
					resourceFilename = url_domain(thisUrl) + "/" + thisUrl.substr(resourceIndex);
					//console.log(resourceFilename);
				}else{
					//console.log('z');
					
					resourceFilename = url_domain(thisUrl);
					resourceFilename = thisUrl.split(':').pop();
					//console.error(resourceFilename);
				}
			}
			
		  }
		  
		  resourceFilename = decodeURIComponent(resourceFilename.replace(/\/$/,''));
		  //console.log('4resourceFilename' + resourceFilename);
		  
		  if(resourceTitle.indexOf('http')>-1 || resourceTitle.indexOf('mailto:')>-1 || resourceTitle.indexOf('www.')>-1 || resourceTitle.indexOf('.com')>-1 || resourceTitle.indexOf('ac.uk')>-1 || resourceTitle.indexOf('.co.uk')>-1 || resourceTitle.indexOf('.org')>-1){
			resourceNameIsUrl = true;
			//console.error('is url');
		  }
		  
		  //console.error('here');
		  //console.log(resourceFilename);
		  //console.log(resourceNameIsUrl);
		  
		  
		  if(resourceFilename.length>0 && resourceDocType != 'email' && !resourceNameIsUrl){
			resourceFileTxt = resourceTitle + '<br/>' + resourceFilename;
			//console.log('1resourceFileTxt ' + resourceFileTxt);
		  }else{
			resourceFileTxt = resourceFilename;
			//console.log('2resourceFileTxt ' + resourceFileTxt);
		  }
		  
		  var resourceClassName = 'document-'+resourceDocType;
		  
		  if(i == '0'){resourceHtml = '<h2>Resources</h2>';}
		  resourceHtml = resourceHtml + "<a title='" + resourceDocType + "' class='resource-link-item "+
		  resourceClassName + "' href='" + links[i].href + " '><span class='resource-link-name'>" 
		  + resourceFileTxt + "</span></a>";        
		});
		if(resourceHtml.length>20){
			resourceHtml = '<div class="page-resources wrapper">' + resourceHtml + '</div>';
			$(resourceTarget).append(resourceHtml);
		}
	}
	if($.exists('.page_activity,.page_societies,.page_sports,.page_organisation,.page_advice,.page_nursery,.page_shops,.page_venues,.page_union')&&!$.exists('#edit_header,.page_unionplan')){
		createDocumentSlider();
	}
	
});