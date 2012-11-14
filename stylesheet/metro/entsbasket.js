function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

// data transmission object for use with window.postMessage - matches the one in SU_Data
var messageObj = function() {
	this.Message = null;
	this.Data = null;
	this.Type = 'SU_Data postMessage';
};

/**
 * Handler for postMessages sent while this page is a child iframe.
 * Used for silently calling add-to-basket functionality from other pages.
 * Snippet is linked to the SU_Data class and needs to be moved to a more suitable permenant location.
 * -- Mike Nicholas
 */
var basketListener = function(e) {
	if (e.source == window) return;
	if (e.data == null || e.data.Type != 'SU_Data postMessage') return;
	var msg = e.data;
	if (msg.Message == 'EventBasketData') {
		var pId = msg.Data.PurchaseID;
		var qId = msg.Data.QuantityID;
		var quantity = msg.Data.Quantity;
		$('#' + qId).val(quantity);
		$('#' + pId).trigger('click');
		e.source.postMessage('EventBasketCallback', e.origin);
	}
}

$(document).ready(function(){
	/* BEGIN - Mike's basket code */
	if (parent != window) {
		if (window.addEventListener){
			addEventListener("message", basketListener, false);
		} else {
			attachEvent("onmessage", basketListener);
		}
		var msg = new messageObj();
		msg.Message = 'EventBasketRequest';
		msg.Data = $('#msl-basket').html();
		parent.postMessage(msg, "http://www.swansea-union.co.uk/");
	}
	/* END - Mike's basket code */
	
	/* BEGIN - Toby's basket code */
	var qty = parseInt(qs('addBasketQty'));
	var type = qs('addBasketType');
	if ($('.msl_info').length > 0) {
		window.location = "/shop/reviewbasket/";
	} 
	else {
		// this was throwing type == null error, so added a check
		if (type == null) return;
		if (type.length > 0 && $('.error').length == 0){
			console.log(type);
			if (qty > 0) {
				$('#' + type).val(qty);
				type = type.replace('ddQty', 'btnAddTicket');
				$('#' + type).trigger('click');
			}
		}
	}
	/* END - Toby's basket code */
});
