jQuery.exists = function (selectors) {
    if (typeof selectors == "string") {
        return $(selectors).length > 0;
    }
    else if (typeof selectors == "object") {
        for (var i = 0; i < selectors.length; i++) {
            if ($(selectors[i]).length > 0) {
                return true;
            }
        }
    }
    return false;
}

$(document).ready(function() {
    
    /*
     * COVERFLOW
     */
    var pageTriggers_Coverflow = ['.page_root', '.page_events', '.page_testpagemike'];
    if ($.exists(pageTriggers_Coverflow)) {
        SU_Widget.Coverflow('Data_Events_Ents', '#coverflow');
    }
    
    /*
     * NEWS
     */
    var pageTriggers_News = ['.page_root', '.page_testpagemike'];
    if ($.exists(pageTriggers_News)) {
        SU_Widget.NewsWidget('Data_News_Main', '#isonews', 10);
    }
    
    /*
     * EVENTS - MAIN LIST
     */
    var pageTriggers_Events_Main = ['.page_root', '.page_events', '.page_testpagemike'];
    if ($.exists(pageTriggers_Events_Main)) {
        SU_Widget.EventSlider_Portrait('Data_Events_Ents','#su-eventsPortrait');
        SU_Widget.EventSlider_Filter('Data_Events_Ents', '#su-eventsPortraitFilter', '#su-eventsPortrait', ['Club Nights', 'Live Music', 'Special Events']);
        SU_Widget.EventSlider_Landscape('Data_Events_Ents','#su-eventsLandscape');
        var myOrgs = SU_Data.membershipsData.map(function(d) { return d.Name; }).sort();
        SU_Widget.EventSlider_Filter('Data_Events_Ents', '#su-eventsLandscapeFilter', '#su-eventsLandscape', [], myOrgs);
    }
    
    
    /*
     * OFFICER BLOGS
     */
    var pageTriggers_OfficerBlogs = ['.page_root', '.page_testpagemike'];
    if ($.exists(pageTriggers_OfficerBlogs)) {
        SU_Widget.BlogWidget('Data_Blogs_Officer', '#officer-blogs', 5);
    }
    
});