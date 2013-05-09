            
            /*
             * NEWS
             */
            $(document).ready(function() {
                SU_Widget.NewsWidget('newsmain', '#isonews', 10);
            });
			
			/*
			 * EVENTS
			 */
            $(document).ready(function() {
                SU_Widget.EventSlider_Portrait('eventsmain','#su-eventsPortrait');
                SU_Widget.EventSlider_Landscape('eventsmain','#su-eventsLandscape');
            });
            
            /*
             * BLOGS
             */
            $(document).ready(function() {
                SU_Widget.BlogWidget('officerblogs','#officer-blogs',6);
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
             * EVENTS COVERFLOW
             */
            $(document).ready(function() {
                SU_Widget.Coverflow('eventsfeatured', '#coverflow');
            });
