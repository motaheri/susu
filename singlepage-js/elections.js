/*
 * Create tabs for each of the election widgets
 */
$(document).ready(function () {
	// Tab UL element
	var tabElement = $('#electiontabs');
	// Get each of the election/referendum widgets
	var widgets = $('div.election, div.referendum');
	// Test for empty list
	if (widgets.length == 0)
		return;
	// Add appropriate classes to each widget and append a tab header
	$.each(widgets, function () {
		if ($(this).attr('id') == null) {
			$(this).attr('id', 10000 + Math.floor(Math.random()*1001));
		}
		// Each election has a unique ID number
		var id = $(this).attr('id');
		// Title is within first H3
		var title = $(this).find('h3').first().text();
		title = title.replace('Edit ', '');
		tabElement.append('<li><a href="#vote' + id + '">' + title + '</a></li>');
		$(this).parent().addClass('tab-pane fade');
		$(this).parent().attr('id', 'vote' + $(this).attr('id'));
	});
	$('#electiontabs li a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
	});
	$('#electiontabs a:first').tab('show');
});