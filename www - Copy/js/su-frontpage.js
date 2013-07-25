            
            /*
             * NEWS
             */
            $(document).ready(function() {
                SU_Widget.NewsWidget('newsmain', '#isonews', 10);
                $('#isonews').isotope({
                    itemSelector : '.news',
                    layoutMode: 'masonry',
                    masonry: {
                        columnWidth: 228
                    },
                    filter: '.news:not(.extra)'
                });
                isoNewsFilter();
            });
            var isoNewsFilterCheck = false;
            function isoNewsFilter() {
                var w = $(window).width();
                if (w >= 912 && w < 1140) {
                    if (isoNewsFilterCheck) return;
                    $('#isonews').isotope({ filter: '.news' });
                    isoNewsFilterCheck = true;
                }
                else {
                    if (!isoNewsFilterCheck) return;
                    $('#isonews').isotope({ filter: '.news:not(.extra)' });
                    isoNewsFilterCheck = false;
                }
            };
            $(window).resize(function() {
                isoNewsFilter();
            });
			
			/*
			 * EVENTS
			 */
            $(document).ready(function() {
                SU_Widget.EventSlider_Portrait('eventsmain','#su-eventsPortrait');
				SU_Widget.EventSlider_Filter('eventsmain', '#su-eventsPortraitFilter', '#su-eventsPortrait', ['Club Nights', 'Live Music', 'Special Events']);
                SU_Widget.EventSlider_Landscape('eventsmain','#su-eventsLandscape');
				var myOrgs = SU_Data.membershipsData.map(function(d) { return d.Name; }).sort();
				SU_Widget.EventSlider_Filter('eventsmain', '#su-eventsLandscapeFilter', '#su-eventsLandscape', [], myOrgs);
            });
            
            /*
             * BLOGS
             */
            $(document).ready(function() {
                SU_Widget.BlogWidget('officerblogs', '#officer-blogs', 5);
            });
            
            /*
             * EVENTS COVERFLOW
             */
            $(document).ready(function() {
                SU_Widget.Coverflow('eventsfeatured', '#coverflow');
            });
			
			/*
			 * FRONT PAGE MEDIA
			 */
			$(document).ready(function($){
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
							icon: 'twitter.png'
						},
						facebook: {
							id: '18315300553,153740337972319', //Facebook Timeline/160254513987568
							out: 'user,intro,text',
							text: 'content',
							comments: 0,
							image_width: 6, //3 = 600 4 = 480 5 = 320 6 = 180
							icon: 'facebook.png'
						},
						youtube: {
							id: 'StudentSwanseaEvents',
							intro: 'Uploaded,Favorite,New Video',
							search: 'Search',
							out: 'thumb,text,user,share',
							feed: 'uploads,favorites,newsubscriptionvideos',
							thumb: 'default',
							icon: 'youtube.png'
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
					iconPath: 'images/dcsns-dark/',
					imagePath: 'images/dcsns-dark/'
				});
			});
			
	 
 
