function strpos(haystack, needle, offset) {
    var i = (haystack + '').indexOf(needle, (offset || 0));
    return i === -1 ? false : i;
}

var mslMetro = {};

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
                    article['text'] = $.trim(d[0]);

                    var d = value.split('class="');
                    d = d[1].split('"');
                    article['css'] = $.trim(d[0]);

                    articles.push(article);
                }
            });

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
                allPages.push(currentPage);
            }

            MetroScroller.loadData(allPages);
            r();
        }
    });

};

mslMetro.dyLoadData = function (url) {
    $('#msl-metro-more-left').hide();
    $('#msl-metro-more-right').hide();

    $('#msl-metro-loading').fadeIn(800, function () {
        mslMetro.loadAjax(url, function () {

            var cLeft = 940;
            var left = parseInt($('.msl-metro-page-selected').css('left').replace('px', '')) * -1 + $('#msl-metro-fade-left').width();
            $('#msl-metro-container').css('left', left + 'px');
            $('.msl-metro-page').each(function () {
                $(this).css('left', cLeft + 'px');
                cLeft = cLeft + 940;
            });

            $('#msl-metro-loading').fadeOut(2500);
            $('#msl-metro-more-left').fadeIn(2500);
            $('#msl-metro-more-right').fadeIn(2500);
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

