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
	Input.checkForInputError( type, z, constraints );
	var obj = new Input();
	obj.type = type;
	obj.z = Expression.parse( this.z );
	obj.constraints = Input.getArrOfConstraints(constraints);
	obj.setTermNames();
	obj.checkConstraints();
	return obj;
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Input.getArrOfConstraints = function(arr){
	arr = ( Matrix.isArray( arr ) ) ? arr : [arr];
	var constraints = [], 
		i = arr.length;
	while( i-- ){
		constraints[ i ] = Constraint.parse( arr[ i ] );
	}
	return constraints;
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
 Input.getErrors = function(type, z, constraints){
	var errMsgs = [];
	if( typeof z !== "string"){
		errMsgs.push( "z must be a string." );
	}
	if( type !== "maximize" && type !== "minimize" ){
		errMsgs.push( "`maximize` and `minimize` are the only types that is currently supported." );
	}
	if( !Matrix.isArray( constraints ) || !constraints.length ){
		errMsgs.push( "Constraints must be an array with at least one element." );
	}	
	return errMsgs;
};
Input.prototype.addNumbersToSlacks = function(){
	var c = this.constraints;
	var slackI = 1;
	for( var i = 0, len = c.length; i < len; i++){
		if( c[ i ].slackValue ){
			value = c[ i ].leftSide.getTermValue( "slack" );
			c[ i ].leftSide.removeTerm( "slack" );
			c[ i ].leftSide.addTerm( "slack"+slackI, value );
			slackI++;
		}
	}
};
Input.prototype.setTermNames = function(){
	var vars = [], i = this.constraints.length, c;
	while( i-- ){
		c = this.constraints[ i ];		
		vars = vars.concat( c.getTermNames() );		
	}
	this.terms = mixin.getUniqueArray(vars).sort();
};
Input.prototype.isAnyZTermNotInAnyConstraints = function(){	
	var varMissing = false,
		terms = this.z.getTermNames();

	for( var i = 0, iLen = terms.length; !varMissing && i < iLen; i++ ){
		for( var j = 0, jLen = this.constraints.length; j < jLen; j++ ){
			if( this.constraints[j].leftSide[ terms[i] ] ){
				break;
			}
			if( j == jLen - 1 ){
				varMissing = true;
			}
		}
	}
	return varMissing;
};
Input.prototype.checkConstraints = function(){
	if( this.isAnyZTermNotInAnyConstraints() ){
		errMsgs.push( "All variables in `z` must appear at least once in a constraint." );
	}
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Input.checkForInputError = function(type, z, constraints ){
	var arr = Input.getErrors(type, z, constraints);
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
Input.prototype.convertConstraintsToMaxForm = function(){
	var c = this.constraints;
	for( var i = 0, len = c.length; i < len; i++){
		c[i] = c[i].getStandardMaxForm();
	}
};
Input.prototype.convertToStandardForm = function(){
	if( this.isStandardMode ){
		return this;
	}
	if( /min/.test(this.type) ){
		this.z = this.z.inverse();
	}
	this.convertConstraintsToMaxForm();
	this.addNumbersToSlacks();
	this.setTermNames();
	this.isStandardMode = true;
	return this;
};
