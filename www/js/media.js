
            
            /*
             * EVENTS COVERFLOW
             */
            $(document).ready(function(){
                $('#icarousel').iCarousel({
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
            });
            
            
            
  

			
			
jQuery(document).ready(function($){
	$('#social-stream').dcSocialStream({
		feeds: {
			twitter: {
				id: 'Sinkswansea,SinCitySwansea,SUSUflux,thewaterfrontSU,SwanseaUnion,SUSUVoice,studentswansea',
				intro: 'Tweeted',
				search: 'Tweeted',
				out: 'intro,thumb,text,share',
				retweets: false,
				replies: false,
				images: 'small', // large w: 786 h: 346, thumb w: 150 h: 150, medium w: 600 h: 264, small w: 340 h 150
				url: 'http://studentswansea.co.uk/twitter/twitter.php',
				icon: 'twitter.png'
			},
			rss: {
				id: ''
			},
			stumbleupon: {
				id: ''
			},
			facebook: {
				id: '18315300553,153740337972319,Facebook Timeline/160254513987568',
				out: 'intro,thumb,title,text,user,share',
				text: 'content',
				comments: 3,
				image_width: 6, //3 = 600 4 = 480 5 = 320 6 = 180
				icon: 'facebook.png'
			},
			google: {
				id: ''
			},
			delicious: {
				id: ''
			},
			vimeo: {
				id: ''
			},
			youtube: {
				id: 'StudentSwanseaEvents',
				intro: 'Uploaded,Favorite,New Video',
				search: 'Search',
				out: 'intro,thumb,title,text,user,share',
				feed: 'uploads,favorites,newsubscriptionvideos',
				thumb: 'default',
				icon: 'youtube.png'
			},
			pinterest: {
				id: ''
			},
			flickr: {
				id: '71533749@N02',
				intro: 'Uploaded',
				out: 'intro,thumb,title,text,share',
				lang: 'en-us',
				icon: 'flickr.png'
			},
			lastfm: {
				id: ''
			},
			dribbble: {
				id: ''
			},
			deviantart: {
				id: ''
			},
			tumblr: {
				id: '',
				thumb: 250
			}
		},
		rotate: {
			delay: 0
		},
		twitterId: '',
		control: false,
		filter: true,
		wall: true,
		cache: false,
		max: 'limit',
		limit: 10,
		iconPath: 'images/dcsns-dark/',
		imagePath: 'images/dcsns-dark/'
	});
				 
});
