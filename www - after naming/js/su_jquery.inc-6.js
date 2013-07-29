/*

inc v6

A super-tiny client-side include JavaScript jQuery plugin

<http://johannburkard.de/blog/programming/javascript/inc-a-super-tiny-client-side-include-javascript-jquery-plugin.html>
<p class="inc:footer.html">This text will be replaced
    with footer.html</p>

<p class="small inc:footer.html inactive">This text will
    be replaced with footer.html as well</p>

MIT license.

Johann Burkard
<http://johannburkard.de>
<mailto:johann@johannburkard.de>

*/

jQuery.fn.inc = function(url, transform, post, t, f, transfer) {
 return this.length ? this.each(function() {
  t = $(this);

  transfer = function(txt) {
   t.html($.isFunction(transform) ? transform(txt) : txt);
   post && post();
  };

  if (navigator.appName == 'Microsoft Internet Explorer') {

   $('<iframe>').hide().bind('readystatechange', function() {
    if (/m/.test(this.readyState)) {
     transfer(this.contentWindow.document.body.innerHTML);
     $(this).remove();
    }
   }).attr('src', url).appendTo(document.body);

  }
  else {
   $.ajax({
    url: url,
    complete: function(res, status) {
     /c/.test(status) && transfer(res.responseText);
    }
   });
  }
 }) : this;
};

$(function() {
 $('[class*="inc"]').each(function() {
  $(this).inc(unescape(this.className.replace(/.*inc:([^ $]+)/, '$1')));
 });
});

