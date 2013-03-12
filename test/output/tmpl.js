if(typeof define !== "function") {
define = require( "amdefine")(module)
}
function encodeHTMLSource() {var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': '&#34;', "'": '&#39;', "/": '&#47;' },matchHTML = /&(?!#?w+;)|<|>|"|'|\//g;return function() {return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;};};
String.prototype.encodeHTML=encodeHTMLSource();
define(function() {
var tmpl=tmpl|| {};
 tmpl['arrays']=function anonymous(it) {
var out='';var arr1=it.array;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+='<div>'+(value)+'</div>';} } return out;
}
 tmpl['hashMap']=function anonymous(it) {
var out=''; for(var prop in it) { out+='<div>'+(prop)+'</div>'; } return out;
}
 tmpl['regular']=function anonymous(it) {
var out='<div></div>';return out;
}
 tmpl['variables']=function anonymous(it) {
var out='<div>'+(it.var)+'</div>';return out;
}
return tmpl;});
