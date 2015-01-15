jQuery(document).ready(function($){
	$('#social-stream').dcSocialStream({
		feeds: {
			twitter: {
				id: 'Sinkswansea,SinCitySwansea,WaterFront,SwanseaUnion,SUSUVoice,studentswansea',
				intro: 'Tweeted',
				search: 'Tweeted',
				out: 'intro,thumb,text,share',
				retweets: false,
				replies: false,
				images: 'small', // large w: 786 h: 346, thumb w: 150 h: 150, medium w: 600 h: 264, small w: 340 h 150
				url: 'http://studentswansea.co.uk/twitter/twitter.php',
				icon: 'icon-social-twitter.png'
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
				icon: 'icon-social-facebook.png'
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
				id: 'suswansea',
				intro: 'Uploaded,Favorite,New Video',
				search: 'Search',
				out: 'intro,thumb,title,text,user,share',
				feed: 'uploads,favorites,newsubscriptionvideos',
				thumb: 'default',
				icon: 'icon-social-youtube.png'
			},
			pinterest: {
				id: ''
			},
			flickr: {
				id: '71533749@N02',
				intro: 'Uploaded',
				out: 'intro,thumb,title,text,share',
				lang: 'en-us',
				icon: 'icon-social-flickr.png'
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
		iconPath: '/stylesheet/su/',
		imagePath: '/stylesheet/su/',
	});
				 
});
