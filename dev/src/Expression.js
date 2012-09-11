/**
* @project {{=it.name}}
* @author Larry Battle
* @license {{=it.license.overview}}
* @date 07/08/2012
*/

/**
* Goals for the Expression Object:
* - Convert String to Object such that the terms, constants and sign and be easily accessed.
*
* @constructor
* @returns {Expression}
*/
var Expression = function () {
	this.terms = {};
};
/**
* Converts a string to a Expression Object.
*
* @returns {Expression} 
*/
Expression.parse = function(str){
	var obj = new Expression();
	if( typeof str !== "string" || !str.length ){
		return obj;
	}
	Expression.checkString(str);
	str = Expression.addSpaceBetweenTerms( str );
	obj.terms = Expression.convertExpressionToObject(str);
	return obj;
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Expression.encodeE = function( str ){
	str = ( str || "" ).toString();
	str = str.replace( /(\de)([+])(\d)/gi, "$1_plus_$3" );
	str = str.replace( /(\de)([\-])(\d)/gi, "$1_sub_$3" );
	return str;
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Expression.decodeE = function( str ){
	str = ( str || "" ).toString();
	str = str.replace( /_plus_/g, "+" );
	str = str.replace( /_sub_/g, "-" );
	return str;
};
/**
* Checks to see if a string has more than one of these symbols; ">", "<", ">=", "<=", "=".
*
* @param {String} str
* @returns {Boolean}
* @example Expression.hasManyCompares( "a < b < c" ) == true;
*/
Expression.hasManyCompares = function (str) {
	var RE_compares = /[<>]=?|=/g;
	var matches = ("" + str).replace(/\s/g, "").match(RE_compares) || [];
	return 1 < matches.length;
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Expression.addSpaceBetweenTerms = function(str){	
	str = Expression.encodeE( str );
	str = str.replace( /([\+\-])/g, " $1 " );
	str = str.replace( /\s{2,}/g, " " );
	str = str.trim();
	str = Expression.decodeE( str );
	return str;
};
/**
* Checks to see if a string has any of the these symbols; "*", "\", "%".
*
* @param {String} str
* @returns {Boolean}
* @example Expression.hasExcludedOperations( "a * b + c" ) == true;
*/
Expression.hasExcludedOperations = function (str) {
	return (/[\*\/%]/).test(str);
};
/**
* Checks to see if a string doesn't have a left and right terms with each addition and subtraction operation.
*
* @param {String} str
* @returns {Boolean}
* @example Expression.hasIncompleteBinaryOperator( "a + b +" ) == true;
*/
Expression.hasIncompleteBinaryOperator = function (str) {
	var hasError,
	noSpaceStr = ("" + str).replace(/\s/g, ""),
	RE_hasNoPlusOrMinus = /^[^\+\-]+$/,
	RE_noLeftAndRightTerms = /[\+\-]{2}|[\+\-]$/,
	hasMoreThanOneTerm = /\S+\s+\S+/.test(str);
	hasError = hasMoreThanOneTerm && RE_hasNoPlusOrMinus.test(noSpaceStr);
	hasError = hasError || RE_noLeftAndRightTerms.test(noSpaceStr);
	return hasError;
};
/**
* Checks to see if string has a comparison.
*
* @param {String} str
* @returns {Boolean} 
* @example Expression.hasComparison( "a = b" ) == true;
*/
Expression.hasComparison = function(str){
	return (/[><=]/).test(str);
};
/**
* Checks to see if string comply with standards.
*
* @param {String} str
* @returns {String} Error message 
* @example Expression.getErrorMessage( "a + b" ) == null;
*/
Expression.getErrorMessage = function (str) {
	var errMsg;
	if (Expression.hasComparison(str)) {
		errMsg = "Comparison are not allowed within an expression.";
	}
	if (!errMsg && Expression.hasExcludedOperations(str)) {
		errMsg = "Addition and subtraction are only supported.";
	}
	if (!errMsg && Expression.hasIncompleteBinaryOperator(str)) {
		errMsg = "Exactly one math operators must be between terms.\n Good:(a+b). Bad:(a++ b+).";
	}
	if(errMsg){
		errMsg += "\n Input: `" + str + "`";
	}
	return errMsg;
};
/**
* Checks to see if string doesn't comply with standards.
*
* @param {String} str
* @throws Error
* @example Expression.checkString( "a / b" ); // throws Error();
*/
Expression.checkString = function (str) {
	var errMsg = Expression.getErrorMessage(str);
	if (errMsg) {
		throw new Error(errMsg);
	}
};
/**
* Extracts coeffient and variable name from a variable.
*
* @param {String} str
* @example Expression.extractComponentsFromVariable( "10cows" ); //returns [10, "cows"]
* @returns {Array[ Number, String ]} 
*/
Expression.extractComponentsFromVariable = function(str){
	str = ""+str;
	var re = /^[\+\-]?\d+(\.\d+)?(e[\+\-]?\d+)?/i;
    var coeff = ""+(str.match(re)||[""])[0];
    var term = str.replace( re, '') || "1";
	if( +str === 0){
		coeff = 0;
	}
	if(coeff === ""){
		coeff = /^\-/.test(term) ? -1 : 1;
		term = term.replace( /^[\+\-]/, "" );
	}
    return [ +coeff, term ];
};
/**
* Split string by terms.
*
* @param {String} str
* @returns {String[]} 
* @example Expression.splitStrByTerms( "-a + 32c" ); //returns [ "-a", "32c"]
*/
Expression.splitStrByTerms = function(str){
	var RE_findSignForTerm = /([\+\-])\s+/g; 
	var RE_spaceOrPlus = /\s+[\+]?/;
	return (""+str).replace(/^\s*\+/,"").replace( RE_findSignForTerm, "$1").split( RE_spaceOrPlus );
};
/**
* Converts an linear algebraic expression into an object.
*
* @param {String} str
* @returns {Object} 
* @example Expression.convertExpressionToObject( "13 + 3a -2b +5b -3 + 0b" ); //returns {a:3,b:3,1:10}
*/
Expression.convertExpressionToObject = function (str) {
	var term, obj = {},
		matches = Expression.splitStrByTerms( (str||"").trim() ),
		i = matches.length;
	while (i--) {
		term = Expression.extractComponentsFromVariable( matches[i] );
		if(!term[0]){
			term = [0,1];
		}
		obj[term[1]] = (obj[term[1]]) ? (obj[term[1]]) + term[0] : term[0];
	}
	return obj;
};
/**
* Returns the proper string representation for a term.
*
* @see Expression.prototype.toString
*/
Expression.termAtIndex = function( i, name, value ){
	var result = "";
	if(value){
		if( value < 0 ){
			result += value==-1 ? "-":value;
		}else{
			if( i ){
				result += "+";
			}
			result += value==1 ? "":value;
		}
		result += name;
	}else{
		result += 0 < name && i ? "+" : "";
		result += name;
	}
	return result;
};
/**
* Returns an array of alphanumeric sorted variables without the coefficients.
*
* @returns {Array}
* @example Expression.parse( "a + 2cats + 30" ).getTermNames(); // returns ["a", "cats", "30" ]
*/
Expression.prototype.getTermNames = function (excludeNumbers, excludeSlack){
	var obj = this.terms, terms = [], key, RE_slack = /^slack\d*$/i;
	for (key in obj) {
		if (!obj.hasOwnProperty(key) || (excludeSlack && RE_slack.test(key) ) ) {
			continue;
		}
		if( isNaN( key ) ){
			terms.push( key );
		}
	}
	terms = terms.sort();
	if( !excludeNumbers && obj && obj[1] ){
		terms.push( obj[1].toString() );
	}
	return terms;
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Expression.prototype.forEachTerm = function(fn){	
	if(typeof fn !== "function"){
		return;
	}
	for( var prop in this.terms ){
		if( this.terms.hasOwnProperty( prop ) ){
			fn( prop, this.terms[ prop ], this.terms );
		}
	}
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Expression.prototype.forEachConstant = function(fn){
	if(typeof fn !== "function"){
		return;
	}
	for( var prop in this.terms ){
		if( this.terms.hasOwnProperty( prop ) && prop === "1" ){
			fn( prop, this.terms[ prop ], this.terms );
		}
	}
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Expression.prototype.forEachVariable = function(fn){
	if(typeof fn !== "function"){
		return;
	}
	for( var prop in this.terms ){
		if( this.terms.hasOwnProperty( prop ) && prop !== "1" ){
			fn( prop, this.terms[ prop ], this.terms );
		}
	}
};
/**
* Convers the Expression object a string by turning the terms property to a expression.
*
* @returns {String}
*/
Expression.prototype.toString = function(){
	var arr = [], obj = this.terms,	terms = this.getTermNames(), i, prop, len, func = Expression.termAtIndex;
	if( !terms.length ){
		return "0";
	}
	for( i = 0, len = terms.length; i < len; i++ ){
		prop = terms[i];
		arr.push( func( i, prop, obj[prop] ) );
	}
	return arr.join( " " ).replace(/\s[\+\-]/g, "$& ");
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Expression.prototype.inverse = function(){
	this.forEachTerm(function( termName, value, terms ){
		terms[ termName ] = -value;
	});
	return this;
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Expression.prototype.addTerm = function( name, value ){
	value += this.terms[ name ] || 0;
	if(value){
		this.terms[ name ] = value;
	}else{
		this.removeTerm( name );
	}
	return this;
};
/**
 *
 *
 * @param {String}
 * @returns {Object}
 * @example
 */
Expression.prototype.removeTerm = function( name ){
	delete this.terms[ name ];
	return this;
};
Expression.prototype.scale = function( factor ){
	factor = +factor;
	this.forEachTerm( function( name, value, terms ){
		terms[ name ] = ( factor * value );
	});
	return this;
};
Expression.prototype.hasTerm = function( name ){
	return !!this.terms[name];
};
Expression.prototype.getTermValue = function( name ){
	return this.terms[name];
};
Expression.prototype.getCoeffients = function( excludeNumbers, excludeSlack ){
	var arr = [];
	var names = this.getTermNames( excludeNumbers, excludeSlack );
	for( var i = 0, len = names.length; i < len; i++ ){
		arr.push(  +( this.terms[ names[ i ] ] || names[ i ] ) );
	}
	return arr;
};