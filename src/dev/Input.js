/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/

// Input Class
var Input = function(){
	this.z = null;
	this.raw = null;
	this.type = null;
	this.terms = null;
	this.constraints = null;
};
Input.parse = function( type, z, constraints ){
	var obj = new Input();
	obj.type = type;
	obj.z = z;
	obj.constraints = constraints;
	obj.checkForInputError();
	obj.convertConstraintsToStandardForm();
	obj.setTermNames();
	return obj;
};
Input.prototype.toString = function(){
};
Input.prototype.convertConstraintsToStandardForm = function(){
	var i = this.constraints.length;
	this.z = Expression.parse( this.z );
	while( i-- ){
		this.constraints[ i ] = Equation.parse( this.constraints[ i ] );
	}
};
Input.prototype.setTermNames = function(){
	var vars = [], i = this.constraints.length, equation;
	while( i-- ){
		equation = this.constraints[ i ];		
		vars = vars.concat( equation.getTermNames() );		
	}
	this.terms = mixin.getUniqueArray(vars).sort();
};
Input.prototype.getErrors = function(){
	var errMsgs = [];
	if( typeof this.z !== "string"){
		errMsgs.push( "z must be a string." );
	}
	if( this.type !== "maximize" ){
		errMsgs.push( "Maximize is the only type that is currently supported." );
	}
	if( "[object Array]" !== Object.prototype.toString.call( this.constraints ) || !this.constraints ){
		errMsgs.push( "Constraints must be an array with at least one element." );
	}
	return errMsgs;
};
Input.prototype.checkForInputError = function(){
	var arr = this.getErrors();
	if( arr && arr.length ){
		throw new Error( "Input Error: " + arr.join( '\n' ) );
	}
};