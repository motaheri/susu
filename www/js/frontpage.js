
            /*
             * JACKBOX
             */
            jQuery(document).ready(function() {
                jQuery(".jackbox[data-group]").jackBox("init", {
                    deepLinking: false,              // choose to use the deep-linking feature ("true" will enhance social sharing!) true/false
                    showInfoByDefault: false,       // show item info automatically when content loads, true/false
                    preloadGraphics: true,          // preload the jackbox graphics for a faster jackbox
                    fullscreenScalesContent: true,  // choose to always scale content up in fullscreen mode, true/false
                    defaultShareImage: "1.jpg",      // default social image
                    
                    useThumbs: false,                // choose to use thumbnails, true/false
                    showPageScrollbar: true,         // if you don't like the "page jump" when the scrollbar disappears, set this to "true"
                    useKeyboardControls: true        // The left and right keyboard arrows will cycle through the items.  up/down will toggle thumbs
                });
            });
            
            
            
            /*
             * NEWS ISOTOPE
             */
            $(function(){
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
             * URL #! NAVIGATION
             */
            function resetHashUrl() {
                $.address.value('/ ');
            }
            function contentHandler_Event(eventObj) {
                suLightBox('#events-lightbox');
            }
            function contentHandler_Blog(blogObj) {
                
            }
            function contentHandler_News(newsObj) {
                
            }
            function suLightBox(selector) {
                $(selector).lightbox_me({
                    centered: true,
                    overlayCSS: { background: 'white', opacity: 0.9 },
                    onLoad: function() { $("body").css("overflow", "hidden"); },
                    onClose: function() { $("body").css("overflow", "auto"); resetHashUrl(); }
                });
            }
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
                                for (var obj in SU_Data.eventData[name]) {
                                    contentHandler_Event(obj);
                                    return;
                                }
                            }
                        }
                    }
                    // If not, redirect to the standalone Event page
                    //window.location = event.value;
                    suLightBox('#events-lightbox');
                }
                else if (/^\/blogs\/blog\//i.test(event.value) ||
                         /^\/union\/officer\//i.test(event.value) ||
                         /^\/union\/fto\//i.test(event.value)) {
                    console.log('CONTENT TRIGGER: Blog');
                }
                else if (/^\/news\/article\//i.test(event.value)) {
                    console.log('CONTENT TRIGGER: News');
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
            
            
            
            /*
             * EVENTS SLIDER
             */
            $(document).ready(function() {
                $('.sliderPortrait').iosSlider({
                    snapToChildren: true,
                    scrollbar: false,
                    desktopClickDrag: true,
                    infiniteSlider: false
                });
                $('.sliderSmall').iosSlider({
                    snapToChildren: true,
                    scrollbar: false,
                    desktopClickDrag: true,
                    infiniteSlider: false
                });
            });
            
            
            
            /*
             * MENU JAVASCRIPT
             */
            $(document).ready(function(){
                $('#menu li:not(#menu-logo)').on('click',function(e){
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
