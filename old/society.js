$(document).ready(function () {

    $('.msl-contact-widget tr').each(function () {
        var prop = $(this).children('td:first-child').html();
        var val = $(this).children('td:last-child').html();
        if (val.length > 0) {
            var link = val;
            if (prop == "twitter") {
                link = "http://twitter.com/" + link;
            }
            if (prop == "facebook") {
                link = "http://fb.com/" + link;
            }
            if (prop == "youtube") {
                link = "http://youtube.com/user/" + link;
            }
            $('.msl-box-contact .msl-dy-sidebar-padding').append('<div class="msl_widget"><a id="ctl00_Main_emailaddresslink_lnkEmailAddress" class="msl_email msl_prop_' + prop + '" href="' + link + '">' + val + '</a></div>');
        }
    });
    
    $('.msl-exec-widget h3').each(function(index, value){
    	var title = $(this).html();
    	var k = $('.msl-exec-widget div.badge:eq(' + index + ') a:last');
    	var name = k.html();
    	var link = k.attr('href');
    	link = link.replace('../../profile/', '');
    	link = link.replace('/', '');
    	$('.msl-society-contact-exec tbody').append('<tr><td>' + name + '</td><td>' + title + '</td><td><a href="' + link + '">Message</a></td></tr>');
    });
});