/*
* @project {{=it.name}}
* @author Larry Battle
* @license {{=it.license.overview}}
* @date 07/02/2012
*/

/**
 *
 * @constructor Input
 * @param {String}
 * @returns {Object}
 * @example
 */
var Input = function(){
	this.z = null;
	this.raw = null;
	this.type = null;
	this.terms = null;
	this.constraints = null;
	this.isStandardMode = false;
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
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
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Input.prototype.convertConstraintsToStandardForm = function(){
	var i = this.constraints.length;
	this.z = Expression.parse( this.z );
	while( i-- ){
		this.constraints[ i ] = Constraint.parse( this.constraints[ i ] );
	}
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Input.prototype.setTermNames = function(){
	var vars = [], i = this.constraints.length, Constraint;
	while( i-- ){
		Constraint = this.constraints[ i ];		
		vars = vars.concat( Constraint.getTermNames() );		
	}
	this.terms = mixin.getUniqueArray(vars).sort();
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Input.prototype.getErrors = function(){
	var errMsgs = [];
	if( typeof this.z !== "string"){
		errMsgs.push( "z must be a string." );
	}
	if( this.type !== "maximize" && this.type !== "minimize" ){
		errMsgs.push( "Maximize and minimize are the only types that is currently supported." );
	}
	if( "[object Array]" !== Object.prototype.toString.call( this.constraints ) || !this.constraints ){
		errMsgs.push( "Constraints must be an array with at least one element." );
	}
	return errMsgs;
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Input.prototype.checkForInputError = function(){
	var arr = this.getErrors();
	if( arr && arr.length ){
		throw new Error( "Input Error: " + arr.join( '\n' ) );
	}
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Input.prototype.toString = function(){
	return [ 
		this.type + " z = " + this.z,
		"where " + this.constraints.join( ", " )
	].join( ", " );	
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Input.prototype.convertToStandardForm = function(){
	if( this.isStandardMode ){
		return this;
	}
	if( /min/.test(this.type) ){
		this.z = this.z.inverse();
	}
	this.isStandardMode = true;
	return this;
};