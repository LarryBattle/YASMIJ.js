/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/
String.prototype.trim = String.prototype.trim || function(){
	return (this||"").replace(/^\s+|\s+$/g, "");
};
var YASMIJ = {};
YASMIJ.CONST = {
	STANDARD_MAX : "standardMax",
	STANDARD_MIN : "standardMin",
	NONSTANDARD_MIN : "nonstandardMin",
	NONSTANDARD_MAX : "nonstandardMax"
};
YASMIJ.getUniqueArray = function( arr ){
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
YASMIJ.areObjectsSame = function(obj1, obj2){
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
			if( !YASMIJ.areObjectsSame( a, b )){
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
YASMIJ.getErrors = function(obj){
	if(typeof obj !== "object" ){
		return "An object must be passed to YASMIJ.solve()";
	}
	if(!obj.type || !obj.objective || !obj.constraints ){
		return "The object must have the properties `type`, `objective` and `constraints`."
	}
};
YASMIJ.checkForErrors = function(obj){
	var errMsg = YASMIJ.getErrors(obj);
	if(errMsg){
		throw new Error(errMsg);
	}
};
YASMIJ.solve = function( input ){
	YASMIJ.checkForErrors( input );
	return YASMIJ.Tableau.parse( 
			YASMIJ.Input.parse( input.type, input.objective, input.constraints )
		).solve().getOutput();
};


