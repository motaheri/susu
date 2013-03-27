        
            /*
             * URL #! NAVIGATION
             */
            function resetHashUrl() {
                $.address.value('/ ');
            }
            function contentHandler_Event(eventObj) {
                $('.sulb-inner.event .buy button').unbind('click');
                $('.sulb-inner.event .buy button').click(function () {
                    $('.sulb-inner.event .buy-info').slideDown();
                });
                $('.sulb-inner.event .gallery').html('');
                $.ajax({
                    url: 'https://graph.facebook.com/sinsavers?fields=albums.limit(1).fields(photos.limit(15))',
                    dataType: 'jsonp',
                    success: function(data) {
                        var fb_images = data.albums.data[0].photos.data;
                        console.log(fb_images);
                        if (fb_images.length > 0) {
                            $.each(fb_images, function(i, o) {
                                console.log("Image:" + o);
                                var img_obj = o.images[o.images.length - 3];
                                var img = $('<img>', {
                                    class: 'img-rounded',
                                    src: img_obj.source
                                });
                                $('.sulb-inner.event .gallery').append(img);
                            });
                        }
                    }
                });
                suLightBox('#events-lightbox', eventObj);
            }
            function contentHandler_Blog(blogObj) {
                
            }
            function contentHandler_News(newsObj) {
				$('#news-lightbox div.title').html(newsObj.Title);
				$('#news-lightbox img.lead').attr('src', 'http://www.swansea-union.co.uk' + newsObj.Image);
				$('#news-lightbox div.desc').html(newsObj.Story);
				$('#news-lightbox div.sulb-author').html(newsObj.Organisation);
                suLightBox('#news-lightbox', newsObj);
            }
            function suLightBox(selector, data) {
                $(selector).lightbox_me({
                    centered: true,
                    overlayCSS: { background: 'black', opacity: 0.9 },
                    onLoad: function() {
                        $("body").css("overflow", "hidden");
                    },
                    onClose: function() {
                        $("body").css("overflow", "auto");
                        resetHashUrl();
                        $('.sulb-inner.event .buy-info').hide();
                    }
                });
            }
			$(document).ready(function() {
				$.address.strict(true);
				$.address.crawlable(true);
				$.address.change(function(event) {
					if (event.value == "/") return;
					console.log("Change: " + event.value);
					if (/^\/ents\/event\//i.test(event.value) ||
						/^\/events\//.test(event.value)) {
						console.log('CONTENT TRIGGER: Event');
						// Find the event in the SU_Data object, if it exists.
						if (typeof SU_Data != "undefined") {
							if (SU_Data.hasEvents) {
								for (var eventList in SU_Data.eventData) {
									for (var obj in SU_Data.eventData[eventList]) {
										contentHandler_Event(obj);
										return;
									}
								}
							}
						}
						// If not, redirect to the standalone Event page
						//window.location = event.value;
						contentHandler_Event();
					}
					else if (/^\/blogs\/blog\//i.test(event.value) ||
							 /^\/union\/officer\//i.test(event.value) ||
							 /^\/union\/fto\//i.test(event.value)) {
						console.log('CONTENT TRIGGER: Blog');
					}
					else if (/^\/news\/article\//i.test(event.value)) {
						console.log('CONTENT TRIGGER: News');
						// Find the news article in the SU_Data object, if it exists.
						if (typeof SU_Data != "undefined") {
							if (SU_Data.hasNews) {
								for (var newsList in SU_Data.newsData) {
									for (var obj in SU_Data.newsData[newsList]) {
										if (SU_Data.newsData[newsList][obj].Link.indexOf(event.value) !== -1) {
											console.log(event.value);
											contentHandler_News(SU_Data.newsData[newsList][obj]);
											return;
										}
									}
								}
							}
						}
						// If not, redirect to the standalone News page
						//window.location = event.value;
						contentHandler_News();
					}
				});
				$('a[rel="deep"]').unbind('click');
				$('a[rel="deep"]').click(function(e) {
					e.preventDefault();
					var url = $(this).attr('href');
					if ($.address.value() != url) {
						$.address.value(url == '/' ? '/ ' : url);
					}
				});
			});
			
			/*
             * MENU JAVASCRIPT
             */
            $(document).ready(function(){
                $('#menu li:not(#menu-logo)').on('click',function(e){
					var linkRel = $(this).children('a').attr('rel');
						if(linkRel != 'page'){
							e.preventDefault();
							$('#menu li').removeClass('menu-link-hover'); 
							var menuLink = $(this).text().toLowerCase();
							if($('.'+menuLink).is(":visible")){
								$('.'+menuLink).hide();
								$.mask.close();
							}else{
								$('#menu li').removeClass('menu-link-hover');
								$(this).addClass('menu-link-hover');
								$('.menu-content').hide();
								$('.'+menuLink).show(); 
								$('#menu').expose();
							}
						}
                });
                $('html').click(function() {
                    $('#menu li').removeClass('menu-link-hover');
                    if($('.menu-content').is(":visible")){
                        $('.menu-content').hide();
                        $.mask.close();
                    }
                });
                $('#menu li, #menu-content-container').click(function(event){
                    event.stopPropagation();
                });
                
                // Create the dropdown base
                $("<select />").appendTo("#mobile-nav");

                // Create default option  
                $("<option />", {
                   "selected": "selected",
                   "value"   : "",
                   "text"    : "Click to Browse.."
                }).appendTo("#mobile-nav select");

                // Populate dropdown with menu items
                $("#menu-pages li a").each(function() {
                 var el = $(this);
                 $("<option />", {
                     "value"   : el.attr("href"),
                     "text"    : el.text()
                 }).appendTo("#mobile-nav select");
                });
            });
			
			/*
			 * HEADLINE WRAP TEXT
			 */
			jQuery.fn.wrapLines = function( openTag, closeTag )
            {
				// Get words & tidy up
				var original = $(this).text();
				var words = $(this).text().match(/\S+/g);
				for (var i = 0; i < words.length; i++) {
					if (words[i] == "&") {
						words[i] == "and";
					}
				}
				console.log('Text Array: ' + words);
				
				// Remove all bar the first word
				$(this).text(words[0]);
				
				// Record height of the element
				var height = $(this).height();
				// Add words until height increases (ie. wraps)
				for (var i = 1; i < words.length; i++) {
					var currentLine = $(this).text();
					$(this).text(currentLine + ' ' + words[i]);
					if (this.height() == height) { // fits
					}
					else { // doesnt fit
						$(this).before(openTag + currentLine + ' ' + closeTag);
						$(this).text(words[i]);
					}
				}
				$(this).before(openTag + $(this).text() + ' ' + closeTag);
				
				// Remove original
				$(this).remove();
            };
			
			jQuery.fn.wrapLines2 = function( openTag, closeTag )
            {
                var dummy = this.clone();
				dummy.css({
                    top: -9999,
                    left: -9999,
                    position: 'absolute',
                    width: this.width()
                });
				dummy.appendTo(this.parent());
                var text = dummy.text().match(/\S+\s+/g);
                var words = text.length,
					lastTopOffset = 0,
					lines = [],
					lineText = '';
                for (var i = 0; i < words; i++)
                {
                    dummy.html(
						text.slice(0,i).join('') + text[i].trim().replace(/(\S)/, '$1<span/>') + text.slice(i+1).join('')
					);
					var topOffset = jQuery('span', dummy).offset().top;
					if (topOffset !== lastTopOffset && i != 0)
					{
						console.log('New Line: ' + lineText);
						lines.push(lineText);
						lineText = text[i];
					}
					else {
						lineText += text[i];
					}
					lastTopOffset = topOffset;
                }
				console.log('New Line: ' + lineText);
                lines.push(lineText);
                this.html(openTag + lines.join( closeTag + openTag ) + closeTag);
				$(dummy).remove();
            };