/*
* @project {{=it.name}}
* @author Larry Battle
* @license {{=it.license.overview}}
*/
/**
* Expands the string object to support trimming of a the trim.
*
* @returns {String}
* @example "  x  ".trim() == "x";
*/
String.prototype.trim = String.prototype.trim || function(){
	return (this||"").replace(/^\s+|\s+$/g, "");
};
var mixin = {};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
mixin.getUniqueArray = function( arr ){
	var result = [], hash = {};
	if( typeof arr !== "object" || !arr.length ){
		return result;
	}
	for( var i = 0, len = arr.length; i < len; i++ ){
		if(!hash[ arr[i] ]){
			result.push( arr[i] );
			hash[ arr[i] ] = 1;
		}
	}
	return result;
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
mixin.areObjectsSame = function(obj1, obj2){
	var a, b;
	if( obj1 === obj2 ){
		return true;
	}
	if( !(obj1 instanceof obj2.constructor) ){
		return false;
	}
	for(var prop in obj1 ){
		if( !obj1.hasOwnProperty( prop ) ){
			continue;
		}
		a = obj1[ prop ];
		b = obj2[ prop ];
		if( typeof a === "object" ){
			if( typeof a !== typeof b){
				return false;
			}
			if( !mixin.areObjectsSame( a, b )){
				return false;
			}
		}else{
			if( a.toString() !== b.toString() ){
				return false;
			}
		}
	}
	return true;
};