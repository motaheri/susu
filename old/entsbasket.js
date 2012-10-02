function qs(key) {
    key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
    var match = location.search.match(new RegExp("[?&]"+key+"=([^&]+)(&|$)"));
    return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}

$(document).ready(function(){
	var qty = parseInt(qs('addBasketQty'));
	var type = qs('addBasketType');
	if($('.msl_info').length>0){
		window.location = "/shop/reviewbasket/";
	} else {
	if(type.length>0 && $('.error').length==0){
		console.log(type);
		if(qty>0){
			$('#' + type).val(qty);
			type = type.replace('ddQty', 'btnAddTicket');
			$('#' + type).trigger('click');
		}
	}
	}
});
