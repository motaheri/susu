/**
	@author Toby Hughes, web@swansea-union.co.uk
	@owner Swansea University Students' Union (C) 2012
	@filename metro.js
	@description Metro Scroller jQuery Library
**/

var MetroScroller = {};

MetroScroller.leftCollapsed = true;
MetroScroller.hoverLeft = false;
MetroScroller.rightCollapsed = true;
MetroScroller.hoverRight = false;
MetroScroller.disableScroll = false;

MetroScroller.disableScrolling = function(){
	MetroScroller.disableScroll = true;
	$('#msl-metro-more-left').hide();
	$('#msl-metro-more-right').hide();
};

MetroScroller.enableScrolling = function(){
	MetroScroller.disableScroll = false;
	$('#msl-metro-more-left').show();
	$('#msl-metro-more-right').show();
};

MetroScroller.initSideButtons = function(){

	/*$('#msl-metro-nav ul li a').click(function(){
		var href = $(this).attr('href');
		MetroScroller.loadExampleData();
		$('#msl-metro-nav ul li.selected').removeClass('selected');
		$(this).parent().addClass('selected');
		return false;
	});*/

	$('#msl-metro-more-right').click(function(){
		MetroScroller.scrollLeft();
	});
	
	$('#msl-metro-more-left').click(function(){
		MetroScroller.scrollRight();
	});

	$('#msl-metro-fade-right').hover(function(){
		//MetroScroller.hoverRight = true;
		if(MetroScroller.rightCollapsed==true && MetroScroller.disableScroll == false){
			MetroScroller.rightI = parseInt($('.msl-metro-page-selected').css('left').replace('px','')) * -1 + $('#msl-metro-fade-left').width();
			$('#msl-metro-container').animate({left: (MetroScroller.rightI - 30)}, function(){
				MetroScroller.rightCollapsed = false;
			});
			$('#msl-metro-more-right').animate({marginLeft: '-75', width: '150'}, function(){
				$(this).addClass('wide');
			});
		}
	}, function(){
		//MetroScroller.hoverRight = false;
		if(MetroScroller.rightCollapsed==false && MetroScroller.disableScroll == false){
			var l = $('.msl-metro-page-selected:last-child').css('left');
			if(!l){
				var c = $('#msl-metro-container').find('.msl-metro-page-selected');
				c = c[c.length - 1];
				l = $(c).css('left');
			}	
			MetroScroller.rightI = parseInt(l.replace('px','')) * -1 + $('#msl-metro-fade-left').width();
			$('#msl-metro-container').animate({left: MetroScroller.rightI}, function(){
				MetroScroller.rightCollapsed = true;
			});
			$('#msl-metro-more-right').animate({marginLeft: '0', width: '75'}, function(){
				$(this).removeClass('wide');
				MetroScroller.rightCollapsed = true;
			});
		}
	});


	$('#msl-metro-fade-left').hover(function(){
		//MetroScroller.hoverLeft = true;
		if(MetroScroller.leftCollapsed==true && MetroScroller.disableScroll == false){
			MetroScroller.leftI = parseInt($('.msl-metro-page-selected').css('left').replace('px','')) * -1 + $('#msl-metro-fade-left').width();
			$('#msl-metro-container').animate({left: (MetroScroller.leftI + 30)}, function(){
				MetroScroller.leftCollapsed = false;
			});
			$('#msl-metro-more-left').animate({marginRight: '-75', width: '150'}, function(){
				$(this).addClass('wide');
			});
		}
	}, function(){
		//MetroScroller.hoverRight = false;
		if(MetroScroller.leftCollapsed==false && MetroScroller.disableScroll == false){
			MetroScroller.leftI = parseInt($('.msl-metro-page-selected').css('left').replace('px','')) * -1 + $('#msl-metro-fade-left').width();
			$('#msl-metro-container').animate({left: MetroScroller.leftI}, function(){
				MetroScroller.leftCollapsed = true;
			});
			$('#msl-metro-more-left').animate({marginRight: '0', width: '75'}, function(){
				$(this).removeClass('wide');
			});
		}
	});
};

MetroScroller.initButtons = function(){

	$('.msl-metro-page .article img').unbind('hover');
	
	$('.msl-metro-page .article').hover(function(){
		$('.msl-metro-page .article img.gray').hide();
		$('.msl-metro-page .article canvas').show();
		$('.msl-metro-page .article img.color').show();
		$(this).find('img.gray').show();
		$(this).find('canvas').hide();
		$(this).find('img.color').hide();
	}, function(){
		$('.msl-metro-page .article img.gray').hide();
		$('.msl-metro-page .article img.color').show();
		$('.msl-metro-page .article canvas').show();
	});
	
};


MetroScroller.scrollLeft = function(){
	var firstChild = $('.msl-metro-page-selected').prev();	//this is going to be added onto the end
	var oldActive = $('#msl-metro-container').children()[1]; //this is the currently active element
	var newActive = $('.msl-metro-page-selected').next(); //this is going to be new active element
	var container = $('#msl-metro-container'); //this is the container
	var selected = $('.msl-metro-page-selected');

	$('.msl-metro-page-selected').removeClass('msl-metro-page-selected');
	$(newActive).addClass('msl-metro-page-selected');

	//work out new left
	//var newLeft = $("#msl-metro-container > div").size() * 940;
	var o = parseInt($('.msl-metro-page:last-child').css('left').replace('px',''));
	//console.log(o);
	newLeft = 940 + o
	//console.log(newLeft);

	//add first child to end
	container.append('<div class="msl-metro-page msl-metro-page-hidden" style="left:' + newLeft + 'px">' + $(firstChild).html() + '</div>');
	var newWidth = $("#msl-metro-container > div").size() * 940;
	//container.width(newWidth + 'px');
	$('.msl-metro-page-selected .overlay').fadeOut();	

	//add hidden class to all
	$('.msl-metro-page').addClass('msl-metro-page-hidden');

	//remove hidden class from incoming element
	$(newActive).removeClass('msl-metro-page-hidden');
		
	//remove all of the canvas elements!
	$('.msl-metro-page canvas').remove();

	//reCanvas all of this stuff!
	MetroScroller.deSaturate();

	//update side buttons
	var side_selected = $('#msl-metro-more-left .msl-page-button.current');
	if(side_selected.next().hasClass('msl-page-button')){
		side_selected.next().addClass('current');
	} else {
		side_selected.prev().prev().addClass('current');
	}
	side_selected.removeClass('current');
	var side_selected = $('#msl-metro-more-right .msl-page-button.current');
	if(side_selected.prev().hasClass('msl-page-button')){
		side_selected.prev().addClass('current');
	} else {
		side_selected.next().next().addClass('current');
	}
	side_selected.removeClass('current');
	
	//animate and delete first child when done
	var oldLeft = container.offset().left;
	container.animate({left: "-=940"}, { complete: function(){
		$(firstChild).remove();
		//container.offset({ left: oldLeft });
		MetroScroller.initButtons();
		$('.msl-metro-page-selected .overlay').fadeIn(800);
	}, duration: 1300});
	
};

MetroScroller.scrollRight = function(){
	var firstChild = $('.msl-metro-page-selected').next();	//this is going to be added onto the end
	var oldActive = $('#msl-metro-container').children()[1]; //this is the currently active element
	var newActive = $('.msl-metro-page-selected').prev(); //this is going to be new active element
	var container = $('#msl-metro-container'); //this is the container
	var selected = $('.msl-metro-page-selected');

	$('.msl-metro-page-selected').removeClass('msl-metro-page-selected');
	$(newActive).addClass('msl-metro-page-selected');

	//work out new left
	var o = parseInt($('.msl-metro-page:first-child').css('left').replace('px',''));
	newLeft = o - 940;

	//add first child to end
	container.prepend('<div class="msl-metro-page msl-metro-page-hidden" style="left:' + newLeft + 'px">' + $(firstChild).html() + '</div>');
	var newWidth = $("#msl-metro-container > div").size() * 940;
	$('.msl-metro-page-selected .overlay').fadeOut();	

	//add hidden class to all
	$('.msl-metro-page').addClass('msl-metro-page-hidden');

	//remove hidden class from incoming element
	$(newActive).removeClass('msl-metro-page-hidden');
		
	//remove all of the canvas elements!
	$('.msl-metro-page canvas').remove();

	//reCanvas all of this stuff!
	MetroScroller.deSaturate();

	//update side buttons
	var side_selected = $('#msl-metro-more-left .msl-page-button.current');
	if(side_selected.prev().hasClass('msl-page-button')){
		side_selected.prev().addClass('current');
	} else {
		side_selected.next().next().addClass('current');
	}
	side_selected.removeClass('current');
	var side_selected = $('#msl-metro-more-right .msl-page-button.current');
	if(side_selected.next().hasClass('msl-page-button')){
		side_selected.next().addClass('current');
	} else {
		side_selected.prev().prev().addClass('current');
	}
	side_selected.removeClass('current');
	
	//animate and delete first child when done
	var oldLeft = container.offset().left;
	container.animate({left: "+=940"}, { complete: function(){
		$(firstChild).remove();
		//container.offset({ left: oldLeft });
		MetroScroller.initButtons();
		//selected.removeClass('msl-metro-page-selected');
		$('.msl-metro-page-selected .overlay').fadeIn(800);
	}, duration: 1300});
};

MetroScroller.loadData = function(pages){
	var html = '';	

	if(pages.length==1){
		MetroScroller.disableScrolling();
	} else {
		MetroScroller.enableScrolling();
	}

	for (var i = 0; i < pages.length; i++) {
		var page = pages[i];
		var pagehtml = '';
		
		for (var i2 = 0; i2 < page.length; i2++) {
			var article = page[i2];
			var articlehtml = '';
			
			articlehtml = articlehtml + '<div class="metro-white-border"></div><a href="' + article['link'] + '"><img src="' + article['img'] + '" /></a>';
			articlehtml = articlehtml + '<div class="heading"><a href="' + article['link'] + '"><span class="title">' + article['title'] + '<span class="category"> | ' + article['category'] + '</span></span><br /><span class="featured-n">' + article['text'] + '...</span></a></div>';

			//TxODO: SORT OUT CLASSES
			if(i2==0){
				articleID = 1;
			}
			if(i2==1){
				articleID = 2;
			}
			if(i2==2){
				articleID = 2 + ' nbr';
			}
			if(i2==3){
				articleID = 3;
			}
			if(i2==4){
				articleID = 4;
			}
			if(i2==5){
				articleID = 3;
			}
			if(i2==6){
				articleID = 4;
			}		
			if(i2==7){
				articleID = 3 + ' nbr';
			}	
			articlehtml = '<div class="article article-' + articleID + ' ' + article['css'] + '">' + articlehtml + '</div>';
			pagehtml = pagehtml + articlehtml;
		}				

		//TxODO: sort out hidden and visible
		var ac = 'msl-metro-page-hidden';
		if(i==1 || pages.length==1){
			ac = 'msl-metro-page-selected';
		}
		pagehtml = '<div class="msl-metro-page ' + ac + '"><div class="page-inner clearfix">' + pagehtml + '</div></div>';
		html = html + pagehtml;
	}

	$('#msl-metro-container').html(html);

	var cLeft = 940;
	$('#msl-metro-container').css('left','-1736px');
	$('.msl-metro-page').each(function(){
		$(this).css('left', cLeft+'px');
		cLeft = cLeft + 940;
	});

	MetroScroller.initButtons();
	MetroScroller.deSaturate();

	var left = parseInt($('.msl-metro-page-selected').css('left').replace('px','')) * -1 + $('#msl-metro-fade-left').width();
	$('#msl-metro-container').css('left',left + 'px');
};


MetroScroller.loadExampleData = function(){
	$('#msl-metro-more-left').hide();
	$('#msl-metro-more-right').hide();

	$('#msl-metro-loading').fadeIn(800, function(){
		var article = [];
		article['title'] = 'Advice Centre Opens';
		article['category'] = 'Advice';
		article['css'] = '';
		article['img'] = '/stylesheet/metro/tile.jpg';
		article['text'] = 'Lorem ipsum dolor sit amet, con sectetur adipiscing elit. Nulla sit amet lorem sit amet tortor. ';
		var page = [];
		page.push(article);
		page.push(article);
		page.push(article);
		page.push(article);
		page.push(article);
		page.push(article);
		page.push(article);
		page.push(article);
		var data = [];
		data.push(page);
		data.push(page);
		data.push(page);
		MetroScroller.loadData(data);
		$(this).fadeOut(2500);
		$('#msl-metro-more-left').fadeIn(2500);
		$('#msl-metro-more-right').fadeIn(2500);
	});
};

MetroScroller.deSaturate = function(){
	
	//show any hidden images	
	$('.article img').show();
	$('.article').each(function(){
		if($(this).find('img').size() == 2){
			$($(this).find('img')[1]).remove();
		}
	});	

	$('.msl-metro-page .article img').each(function(){
		
		var h = $(this).height();
		if(h==0){
			h = 102;
			var parentc = $(this).parent().parent();
			if($(parentc).hasClass('article-2')){
				h = 102;
			}
			if($(parentc).hasClass('article-1')){
				h = 255;
			}
			if($(parentc).hasClass('article-3')){
				h = 97;
			}
		}
		var w = $(this).width();
		
		$(this).clone().insertAfter(this).hide().addClass('gray');
		$(this).addClass('color');
		//duplicate and hide the image
		Pixastic.process(this, "desaturate", { rectx: { width : w, height : h }});
		//remove any duplicate image tags
		if($(this).parent().find('img').size() == 2){
			//$(this).parent().find('img')[1].remove();
		}	
	});
};

MetroScroller.resize = function(){
	var w = $(window).width();
	var h = $(window).height();

	w = w - 940;
	w = w / 2;
	$('#msl-metro-fade-left').width(w+'px');
	$('#msl-metro-fade-right').width((w + 1)+'px');

	w = $(window).width();
	$('#msl-metro-wrapper').width(w+'px');
}

/** Let's load this up! **/

$(document).ready(function(){
	//MetroScroller.initSideButtons();
	//MetroScroller.initButtons();
	//MetroScroller.deSaturate();
	MetroScroller.resize();	
	//MetroScroller.loadExampleData();
	
	/*var cLeft = 940;
	var left = parseInt($('.msl-metro-page-selected').css('left').replace('px','')) * -1 + $('#msl-metro-fade-left').width();
	$('#msl-metro-container').css('left',left + 'px');
	$('.msl-metro-page').each(function(){
		$(this).css('left', cLeft+'px');
		cLeft = cLeft + 940;
	});*/

	$(window).resize(function(){
		MetroScroller.resize();
	});
});

