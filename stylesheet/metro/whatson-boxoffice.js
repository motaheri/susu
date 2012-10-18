/*
 * Pulls the next future event for SU weekly brands
 * from dedicated MSL widget pages.
 * 
 * Last Updated: 18/10/2012 by Michael Nicholas
 */

// MONDAY - I LOVE MONDAYS
var boxOffice_brand_ilm = "http://www.swansea-union.co.uk/api/brands/ilm/";
// TUESDAY - FLUX
var boxOffice_brand_flux = "http://www.swansea-union.co.uk/api/brands/flux/";
// WEDNESDAY - PLAY ON WEDNESDAYS
var boxOffice_brand_playon = "http://www.swansea-union.co.uk/api/brands/playon/";
// THURSDAY - SIN SAVERS
var boxOffice_brand_sinsavers = "http://www.swansea-union.co.uk/api/brands/sinsavers/";
// FRIDAY - TOOTERS
var boxOffice_brand_tooters = "http://www.swansea-union.co.uk/api/brands/tooters/";
// FRIDAY - FACE OFF
var boxOffice_brand_faceoff = "http://www.swansea-union.co.uk/api/brands/faceoff/";
// SATURDAY - OHH EMM GEE
var boxOffice_brand_omg = "http://www.swansea-union.co.uk/api/brands/omg/";
// SATURDAY - SINK
var boxOffice_brand_sink = "http://www.swansea-union.co.uk/api/brands/sink/";

/*
 * Document Ready Event Handler
 */
$(document).ready(function() {
	boxOffice_setEventLink(boxOffice_brand_ilm, '#msl-boxoffice-regevent-ilm');
	boxOffice_setEventLink(boxOffice_brand_flux, '#msl-boxoffice-regevent-flux');
	boxOffice_setEventLink(boxOffice_brand_playon, '#msl-boxoffice-regevent-playon');
	boxOffice_setEventLink(boxOffice_brand_sinsavers, '#msl-boxoffice-regevent-sinsavers');
	boxOffice_setEventLink(boxOffice_brand_tooters, '#msl-boxoffice-regevent-tooters');
	boxOffice_setEventLink(boxOffice_brand_omg, '#msl-boxoffice-regevent-omg');
	boxOffice_setEventLink(boxOffice_brand_sink, '#msl-boxoffice-regevent-sink');
	boxOffice_setEventLink(boxOffice_brand_faceoff, '#msl-boxoffice-regevent-faceoff');
});

/*
 * Fetch the first event from the given API source and
 * apply the link to the anchors within the given selector.
 * eg.
 * boxOffice_setEventLink(boxOffice_brand_tooters, '#msl-boxoffice-regevent-tooters');
 */
function boxOffice_setEventLink(api_url, anchor_id) {
	// ajax call to api page containing event data
	$.ajax({
		url: api_url,
		success: function (data) {
			// test for invalid response
			if (data == null || data.length == 0) {
				boxOffice_updateBoxOfficeItem(anchor_id, '#', false);
				return;
			}
			// start to parse the dom, find event name link
			var events = $('.msl_eventlist', data).find('a.msl_event_name');
			// test for 0 length array, i.e. no events found
			if (events.length == 0) {
				boxOffice_updateBoxOfficeItem(anchor_id, '#', false);
				return;
			}
			// get link url
			var link = events.first().attr('href');
			var tickets = $('.msl_eventlist', data).find('dd.msl_event_tickets').length > 0;
			// return link if we have one
			if (link != null) {
				boxOffice_updateBoxOfficeItem(anchor_id, link, tickets);
				return;
			}
			// if all else fails
				boxOffice_updateBoxOfficeItem(anchor_id, '#', false);
			return;
		}		
	});
}

/*
 * Sets the href attribute of links within the given selector.
 * e.g. for Tooters we use the div id: '#msl-boxoffice-regevent-tooters'
 */
function boxOffice_updateBoxOfficeItem(anchor_id, link, tickets) {
	$(anchor_id).find('a').attr('href', link);
	if (tickets == true) {
		$(anchor_id).find('a span.smaller').text("Tickets Available");
	}
}