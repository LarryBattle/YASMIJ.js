/**
* Expands the string object to support trimming of a the trim.
*
* @returns {String}
* @example "  x  ".trim() == "x";
*/
String.prototype.trim = String.prototype.trim || function(){
	return (this||"").replace(/^\s+|\s+$/g, "");
};