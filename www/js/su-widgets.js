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
			var inner = $(document.createElement('div')).addClass('su-blog-post-inner');
			var title = $(document.createElement('div')).addClass('title').text(o.Title);
			var intro = $(document.createElement('div')).addClass('intro').text(o.Description);
			var image = $(document.createElement('img')).addClass('author').addClass('img-polaroid').attr('src', 'http://www.swansea-union.co.uk/' + o.Image);
			$(inner).append(title);
			$(inner).append(image);
			$(inner).append(intro);
			$(post).append(inner);
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
			var news = $(document.createElement('div')).addClass('news').addClass('default');
			var link = $(document.createElement('a')).attr('href', o.Link.replace('../','/')).attr('rel', 'deep');
			var inner = $(document.createElement('div')).addClass('news-inner');
			var title = $(document.createElement('div')).addClass('title');
			var desc = $(document.createElement('div')).addClass('description');
			var author = $(document.createElement('div')).addClass('news-author');
			switch (i) {
				case 0:
					$(news).addClass('big');
					break;
				case 1:
					$(news).addClass('medium');
					break;
				case 9:
					$(news).addClass('small').addClass('extra');
					break;
				default:
					$(news).addClass('small');
					break;
			}
			author.text(o.Organisation);
			title.text(o.Title);
			desc.text(o.Description);
			$(inner).append(title).append(desc);
			$(link).append(inner).append(author);
			$(news).append(link);
			$(targetSelector).append(news);
		});
	}
};