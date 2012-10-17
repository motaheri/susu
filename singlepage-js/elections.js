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
		// Title is within first H3
		var title = $(this).find('h3').first().text();
		// Generate fake ID if none exists
		if ($(this).attr('id') == null) {
			//$(this).attr('id', 10000 + Math.floor(Math.random()*1001));
			$(this).attr('id', title.hashCode());
		}
		// Each election has a unique ID number
		var id = $(this).attr('id');
		title = title.replace('Edit ', '');
		tabElement.append('<li><a href="#vote' + id + '">' + title + '</a></li>');
		$(this).parent().addClass('tab-pane fade');
		$(this).parent().attr('id', 'vote' + $(this).attr('id'));
	});
	
	$('#electiontabs li a').click(function (e) {
		e.preventDefault();
		$(this).tab('show');
		changeAnchorHash($(this).attr('href'));
	});
	
	var jumpHash = window.location.hash;
	if (jumpHash != null) {
		$(document).scrollTop(0);
		if ($('#electiontabs a[href="' + jumpHash + '"]').length > 0) {
			$('#electiontabs a[href="' + jumpHash + '"]').tab('show');
		}
		else {
			$('#electiontabs a:first').tab('show');
		}
	}
	else {
		$('#electiontabs a:first').tab('show');
	}
});

function changeAnchorHash(hash) {
	hash = hash.replace(/^#/, '');
	var fx, node = $( '#' + hash );
	if ( node.length ) {
	  node.attr('id', '');
	  fx = $('<div></div>')
			  .css({
				  position: 'absolute',
				  visibility: 'hidden',
				  top: $(document).scrollTop() + 'px'
			  })
			  .attr('id', hash)
			  .appendTo(document.body);
	}
	document.location.hash = hash;
	if (node.length) {
	  fx.remove();
	  node.attr('id', hash);
	}
}

/*
 * Reimplementation of Java's hashCode function for strings.
 */
String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}
