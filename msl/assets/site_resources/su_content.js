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
    var pageTriggers_Coverflow = ['.page_root', '.page_events', '.page_event', '.page_frontpage', '.page_testpagemike'];
    if ($.exists(pageTriggers_Coverflow)) {
        SU_Widget.Coverflow('Data_Events_Ents', '#coverflow');
    }
    
    /*
     * NEWS
     */
    var pageTriggers_News = ['.page_root', '.page_frontpage', '.page_testpagemike'];
    if ($.exists(pageTriggers_News)) {
        SU_Widget.NewsWidget('Data_News_Main', '#isonews', 10);
    }
    
    /*
     * EVENTS - MAIN LIST
     */
    var pageTriggers_Events_Main = ['.page_root', '.page_events', '.page_event', '.page_frontpage', '.page_testpagemike'];
    if ($.exists(pageTriggers_Events_Main)) {
        SU_Widget.EventSlider_Portrait('Data_Events_Ents','#su-eventsPortrait');
        SU_Widget.EventSlider_Filter('Data_Events_Ents', '#su-eventsPortraitFilter', '#su-eventsPortrait');
		
        SU_Widget.EventSlider_Landscape('Data_Events_All','#su-eventsLandscape');
        var myOrgs = SU_Data.membershipsData.map(function(d) { return d.Name; }).sort();
        SU_Widget.EventSlider_Filter('Data_Events_Ents', '#su-eventsLandscapeFilter', '#su-eventsLandscape', [], myOrgs);
    }
    
    
    /*
     * OFFICER BLOGS
     */
    var pageTriggers_OfficerBlogs = ['.page_root', '.page_frontpage', '.page_testpagemike'];
    if ($.exists(pageTriggers_OfficerBlogs)) {
        SU_Widget.BlogWidget('Data_Blogs_Officer', '#officer-blogs', 5);
    }
	

	/*
	 * FRONT PAGE MEDIA
	 */
	var pageTriggers_OfficerBlogs = ['.page_root', '.page_frontpage', '.page_testpagemike'];
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
    
});