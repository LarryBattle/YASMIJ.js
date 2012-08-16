/**
* Expands the string object to support trimming of a the trim.
*
* @returns {String}
* @example "  x  ".trim() == "x";
*/
String.prototype.trim = String.prototype.trim || function(){
	return (this||"").replace(/^\s+|\s+$/g, "");
};/**
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
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
	if( !str.length ){
		return null;
	}
	Expression.checkString(str);
	var obj = new Expression();
	obj.terms = Expression.convertExpressionToObject(str);
	return obj;
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
* @example Expression.hasCompares( "a = b" ) == true;
*/
Expression.isEquation = function(str){
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
	if (Expression.hasCompares(str)) {
		errMsg = "An expression shouldn't have a comparison in it.";
	}
	if (!errMsg && Expression.hasExcludedOperations(str)) {
		errMsg = "Only addition and subtraction is allowed. Get rid of math operators.";
	}
	if (!errMsg && Expression.hasIncompleteBinaryOperator(str)) {
		errMsg = "Math operators must be in between terms.\n Good:(a+b). Bad:(a b+=c).";
	}
	if(errMsg){
		errMsg += "\n str = " + str;
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
Expression.prototype.getTermNames = function () {
	var obj = this.terms, terms = [], key;
	for (key in obj) {
		if (!obj.hasOwnProperty(key)) {			
			continue;
		}
		if( isNaN( key ) ){
			terms.push( key );
		}
	}
	terms = terms.sort();
	if( obj[1] ){
		terms.push( obj[1].toString() );
	}
	return terms;
};
/**
* Convers the Expression object a string by turning the terms property to a expression.
*
* @returns {String}
*/
Expression.prototype.toString = function(){
	var arr = [], obj = this.terms,	terms = this.getTermNames(),
		i, prop, len;
	for( i = 0, len = terms.length; i < len; i++ ){
		prop = terms[i];
		arr.push( Expression.termAtIndex( i, prop, obj[prop] ) );
	}
	return arr.join( " " ).replace(/\s[\+\-]/g, "$& ");
};/**
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/08/2012
*/
 
/**
* Create an Equation Object.
* Goals for the Equation Object:
* - Convert String to Object such that the terms, constants and sign and be easily accessed.
* - Allow for terms to be moved from one side to the other.
*
* @constructor
* @returns {Equation}
*/
var Equation = function () {
	this.comparison = "";
	this.leftSide = {};
	this.rightSide = {};
	this.terms = {};
	return this;
};
/**
* Checks to see if a string has more than one of these symbols; ">", "<", ">=", "<=", "=".
*
* @param {String} str
* @returns {Boolean}
* @example Equation.hasManyCompares( "a < b < c" ) == true;
*/
Equation.hasManyCompares = function (str) {
	var RE_compares = /[<>]=?|=/g;
	var matches = ("" + str).replace(/\s/g, "").match(RE_compares) || [];
	return 1 < matches.length;
};
/**
* Checks to see if a string doesn't have a left and right terms with each addition and subtraction operation.
*
* @param {String} str
* @returns {Boolean}
* @example Equation.hasIncompleteBinaryOperator( "a + b +" ) == true;
*/
Equation.hasIncompleteBinaryOperator = function (str) {
	var hasError,
	noSpaceStr = ("" + str).replace(/\s/g, ""),
	RE_hasNoPlusOrMinus = /^[^\+\-]+$/,
	RE_noLeftAndRightTerms = /[\+\-][><=\+\-]|[><=\+\-]$/;
	hasError = /\s/.test(("" + str).trim()) && RE_hasNoPlusOrMinus.test(noSpaceStr);
	hasError = hasError || RE_noLeftAndRightTerms.test(noSpaceStr);
	return hasError;
};
/**
* Checks to see if string comply with standards.
*
* @param {String} str
* @returns {String} Error message 
* @example Equation.getErrorMessage( "a + b" ) == null;
*/
Equation.getErrorMessage = function (str) {
	var errMsg;
	if (Equation.hasManyCompares(str)) {
		errMsg = "Only 1 comparision (<,>,=, >=, <=) is allow in a equation.";
	}
	if (!errMsg && Equation.hasIncompleteBinaryOperator(str)) {
		errMsg = "Math operators must be in between terms. Good:(a+b=c). Bad:(a b+=c)";
	}
	return errMsg;
};
/**
* Checks to see if string doesn't comply with standards.
*
* @param {String} str
* @throws Error
* @example Equation.checkInput( "a / b" ); // throws Error();
*/
Equation.checkInput = function (str) {
	var errMsg = Equation.getErrorMessage(str);
	if (errMsg) {
		throw new Error(errMsg);
	}
};


/**
* Returns an array of variables without the coefficients.
*
* @param {Object} obj
* @returns {Array} 
* @example Equation.parse("a = cats + 30").getVariableNames(); // returns ["a", "cats", "30" ]
*/
Equation.prototype.getVariableNames = function () {
	var terms = this.leftSide.getTermNames().concat( this.rightSide.getTermNames() );
	return terms.unique();
};
/**
* 
*
* @param {String}
* @returns {Object} 
* @example 
*/
Equation.parseToObject = function (str) {
	Equation.checkInput(str);
	var RE_relation = /[><]=?|=/;
	var arr = (""+str).split(RE_relation);
	var obj = {};
	obj.lhs = Expression.parse(arr[0]);
	if( 1 < arr.length ){
		obj.rhs = Expression.parse(arr[1]);
		obj.relation = "" + RE_relation.exec(str);
	}
	return obj;
};
/**
* Converts a string to an Equation Object.
*
* @param {String}
* @returns {Equation} 
* @example 
*/
Equation.parse = function(str){
	var obj = Equation.parseToObject(str), e;
	if( obj ){
		e = new Equation();
		this.relation = obj.relation;
		this.leftSide = obj.lhs;
		this.rightSide = obj.rhs;
		this.terms = {
			lhs: Equation.getVariableNames(obj.lhs),
			rhs: Equation.getVariableNames(obj.rhs)
		};
	}
	return e;
};
/**
* Returns a string representation of the Equation Object.
*/
Equation.prototype.toString = function(){
	return [this.leftSide, this.relation, this.rightSide].join("");
};/*
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
	this.variables = null;
	this.constraints = null;
};
Input.checkForRequirements = function( obj ){
	var errMsg = "Input Object";
	if( !obj || typeof obj !== "object" ){
		errMsg = "must be an object with properies `z`, `constraints` and `type`.";
	}
	return errMsg;
};
Input.prototype.toString = function(){
};
Input.prototype.parse = function( obj ){
	this.raw = obj;
	var zEquation = new Equation(obj.z);
	this.z = obj.z;
};
/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/
 
// Matrix Class
var Matrix = function(){
	this.columnLength = null;
	this.rowLength = null;
	this.matrix = null;
};

var row = function(el){
    this.el = (typeof el === "object" ) ? el : [];
};
row.prototype.toString = function(){
    return this.el.join(',');
};
a = [];
a.push( new row([11,12,13,14]) );
a.push( new row([21,22,23,24]) );
a.push( new row([31,32,33,34]) );
a.push( new row([41,42,43,44]) );
console.log( a.join('\n') );
/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/

// Tableau Class
var Tableau = function(){
	this.matrix = null;
	this.limit = null;
	this.state = null;
};
/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/
/*
* @todo Use create a fuction for objectToString since JSON.stringify isn't supported by older browsers.
*/
// Output Class
var Output = function(){
	this.matrix = null;
	this.result = null;
};
Output.prototype.toString = function(){
	var str = "";
	str += "matrix = " + ( this.matrix instanceof Matrix ? this.matrix.toString() : [] );
	str += "\n result = " + JSON.stringify(result);
	return str;
};/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/
 
// Simplex Class
var Simplex = function(){
	this.input = new Input();
	this.output = new Output();
	this.tableau = new Tableau();
	this.state = null;
};
Simplex.prototype.toString = function(){
};
Simplex.prototype.setInput = function( obj ){
	this.input.parse( obj );
};/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/
var YASMIJ = function(){};