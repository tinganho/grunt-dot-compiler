if( typeof define !== "function" ) {
define = require( "amdefine" )( module )
}
define(function() {
var tmpl=tmpl|| {};
 tmpl['tmpl']=function anonymous(it) {
var out='<li class="something"><a>'+(it.something)+'</a></li>';return out;
}
return tmpl;});
