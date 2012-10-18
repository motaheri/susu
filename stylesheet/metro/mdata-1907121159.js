function strpos(haystack, needle, offset) {
	var i = (haystack + '').indexOf(needle, (offset || 0));
	return i === -1 ? false : i;
}

function ucfirst(str) {
	var firstLetter = str.substr(0, 1);
	return firstLetter.toUpperCase() + str.substr(1);
}

var mslMetro = {};

mslMetro.loadEvents = function(data, articles){
	var items = data.split('class="event_item');

	$.each(items, function (index, value) {
		var x = value.split('class="msl_event_hook"');	
		if(x.length>1){
			var article = {};

			var x = value.split('class="msl_event_time">');
			x = x[1].split('</dd>');
			article['datetime'] = $.trim(x[0]);

			var x = value.split('class="msl_event_location">');
			x = x[1].split('</dd>');
			article['category'] = $.trim(x[0]).replace(">", "").replace("<", "");

			var x = value.split('class="msl_event_description">');
			x = x[1].split('</dd>');
			article['text'] = $.trim(x[0]).replace(">", "").replace("<", "");

			var x = value.split('class="msl_event_name"');
			x = x[1].split('>');
			x = x[1].split('<');
			article['title'] = $.trim(x[0]).replace(">", "").replace("<", "");

			var x = value.split('src="');
			if(x.length>1){
				x = x[1].split('"');
				article['img'] = $.trim(x[0]);
			} else {
				if(article['title']=='Sin Savers'){
					article['img'] = '/asset/EventBrand/0/527647_10150874850848579_1378156209_n.jpg';
				}
				if(article['title']=='ilovemondays'){
					article['img'] = '/asset/EventBrand/0/ilovemondays.jpg';
				}
			}
		
			var x = value.split('href="');
			x = x[1].split('"');
			article['link'] = $.trim(x[0]);

			//article['category'] = '';
			article['css'] = 'event';

			articles.push(article);
		}	
	});	

	return articles;
};

mslMetro.loadAjax = function (url, r) {

	$.ajax({
		url: url,
		success: function (data) {
			var items = data.split('id="skin_blank"');
			items = items[1].split('<script type="text/javascript">');
			items = items[0].split('_divItem"');
			var articles = [];
			$.each(items, function (index, value) {
				if (strpos(value, 'msl_news_org', 0) > 0) {
					//is a news item, now split out
					var article = {};
					var d = value.split('msl_news_org">');
					d = d[1].split('</div>');
					article['category'] = $.trim(d[0]).replace(">", "");

					var d = value.split('href="');
					d = d[1].split('"');
					article['link'] = $.trim(d[0]);

					d = d[1].split('</a>');
					article['title'] = $.trim(d[0]).replace(">", "");

					var d = value.split('src="');
					d = d[1].split('"');
					article['img'] = $.trim(d[0]);

					var d = value.split('<p class="leader">');
					d = d[1].split('"');
					article['text'] = $.trim(d[0]) + "...";

					var d = value.split('class="');
					d = d[1].split('"');
					article['css'] = $.trim(d[0]);
					
					var d = d[0].split('msltagleader-');
					if(d.length>1){
						d = d[1].split(' ');
						article['category'] = $.trim(d[0]);
						article['category'] = ucfirst(article['category']);
					} else {
						article['category'] = "SUSU";
					}
					
					articles.push(article);
				}
			});

			articles = mslMetro.loadEvents(data, articles);

			var pages = 1;
			if (articles.length >= 24) {
				pages = 3;
			}
			var pi = 1;
			var currentPage = [];
			var allPages = [];
			$.each(articles, function (index, value) {
				if (index < 24) {
					currentPage.push(value);
					if (pi == 8) {
						allPages.push(currentPage);
						currentPage = [];
						pi = 0;
					}
				}
				pi++;
			});

			if (currentPage.length > 0) {
				if(allPages.length == 0){
					allPages.push(currentPage);
				}
			}

		if(allPages.length==2){
			allPages = [allPages[0]];
		}

		if(allPages.length==3){
		allPages = [allPages[2], allPages[0], allPages[1]];
		}
			//console.log(allPages);
			MetroScroller.loadData(allPages);
			r(allPages);
		}
	});

};

mslMetro.dyLoadData = function (url) {
	$('#msl-metro-more-left').hide();
	$('#msl-metro-more-right').hide();

	$('#msl-metro-loading').fadeIn(800, function () {
		mslMetro.loadAjax(url, function (i) {

			var cLeft = 940;
			var left = parseInt($('.msl-metro-page-selected').css('left').replace('px', '')) * -1 + $('#msl-metro-fade-left').width();
			$('#msl-metro-container').css('left', left + 'px');
			$('.msl-metro-page').each(function () {
				$(this).css('left', cLeft + 'px');
				cLeft = cLeft + 940;
			});

			$('#msl-metro-loading').fadeOut(2500);
			if(i.length>1){
				$('#msl-metro-more-left').fadeIn(2500);
				$('#msl-metro-more-right').fadeIn(2500);
			}
			$('.article.event').unbind('click');
			$('.article.event').click(function () {
				var a = $(this).find('a').attr('href');
				showEntsLightbox(a);
				return false;
			});
		});
	});
};

$(document).ready(function(){
	$('#msl-metro-nav li a').click(function(){
		$('#msl-metro-nav li.selected').removeClass('selected');
		$(this).parent().addClass('selected');
		var href = $(this).attr('href');
		mslMetro.dyLoadData(href);
		return false;
	});
});

/*$(document).ready(function () {
	MetroScroller.initSideButtons();
	MetroScroller.initButtons();
	MetroScroller.deSaturate();
	MetroScroller.resize();
	mslMetro.dyLoadData('/api/news-union/');
});*/
