            
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
             * BLOGS
             */
            $(document).ready(function() {
                SU_Widget.BlogWidget('officerblogs','#officer-blogs',6);
            });
