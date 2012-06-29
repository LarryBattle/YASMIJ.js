/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @date 06/29/2012
*/
 
/*
* Expands the string object to support trimming of a the trim.
*
* @returns {String}
* @example "  x  ".trim() == "x";
*/
String.prototype.trim = String.prototype.trim || function(){
	return (this||"").replace(/^\s+|\s+$/g, "");
};
/*
* Create an Equation Object
*
* @constructor
* @returns
* @example
*/
var Equation = function () {
	this.comparison = "";
	this.leftSide = {};
	this.rightSide = {};
	this.terms = [];
};
/*
* Checks to see if string has more than 1 >, < or =.
*
* @param {String}
* @returns {Boolean}
* @example Equation.hasManyCompares( "a < b < c" ) == true;
*/
Equation.hasManyCompares = function (str) {
	var RE_compares = /[<>]=?|=/g;
	var matches = ("" + str).replace(/\s/g, "").match(RE_compares) || [];
	return 1 < matches.length;
};
/*
* Checks to see if string has more than *, \, % character.
*
* @param {String}
* @returns {Boolean}
* @example Equation.hasOtherMathSigns( "a * b + c" ) == true;
*/
Equation.hasOtherMathSigns = function (str) {
	return (/[\*\/%]/).test(str);
};
/*
* Checks to see if string doesn't a left and right terms with each addition and subtraction operation.
*
* @param {String}
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
/*
* Checks to see if string comply with standards.
*
* @param {String}
* @returns {String} Error Message 
* @example Equation.getErrorMessage( "a + b" ) == null;
*/
Equation.getErrorMessage = function (str) {
	var errMsg;
	if (Equation.hasManyCompares(str)) {
		errMsg = "Only 1 comparision (<,>,=, >=, <=) is allow in a equation.";
	}
	if (!errMsg && Equation.hasOtherMathSigns(str)) {
		errMsg = "Only addition and subtraction is allowed. Get rid of math operators.";
	}
	if (!errMsg && Equation.hasIncompleteBinaryOperator(str)) {
		errMsg = "Math operators must be in between terms. Good:(a+b=c). Bad:(a b+=c)";
	}
	return errMsg;
};
/*
* Checks to see if string doesn't comply with standards.
*
* @param {String}
* @throws Error
* @example Equation.checkInput( "a / b" ); // throws Error();
*/
Equation.checkInput = function (str) {
	var errMsg = Equation.getErrorMessage(str);
	if (errMsg) {
		throw new Error(errMsg);
	}
};
/*
* Extracts coeffient and variable name from a variable.
*
* @param {String}
* @returns {Array[ Number, String ]} 
* @example Equation.convertStrToTermArray( "10cows" ); //returns [10, "cows"]
*/
Equation.convertStrToTermArray = function(str){
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
/*
* Split string by terms.
*
* @param {String}
* @returns {String[]} 
* @example Equation.convertStrToTermArray( "-a + 32c" ); //returns [ "-a", "32c"]
*/
Equation.getTermsFromStr = function(str){
	var RE_findSignForTerm = /([\+\-])\s+/g; 
	var RE_spaceOrPlus = /\s+[\+]?/;
	//var re = /(?=[^e\s])(-)(?=[^e])/gi;
	return (""+str).replace(/^\s*\+/,"").replace( RE_findSignForTerm, "$1").split( RE_spaceOrPlus );
};
/*
* Converts an linear algebraic expression into an object.
*
* @param {String}
* @returns {Object} 
* @example Equation.convertExpressionToObject( "13 + 3a -2b +5b -3" ); //returns {a:3,b:3,1:10}
*/
Equation.convertExpressionToObject = function (str) {
	var term, obj = {},
		matches = Equation.getTermsFromStr( (str||"").trim() ),
		i = matches.length;
	while (i--) {
		term = Equation.convertStrToTermArray( matches[i] );
		obj[term[1]] = (obj[term[1]]) ? (obj[term[1]]) + term[0] : term[0];
	}
	return obj;
};
/*
* 
*
* @param {String}
* @returns {Object} 
* @example 
*/
Equation.parse = function (str) {
	Equation.checkInput(str);
	var re = /[><]=?|=/;
	var arr = (""+str).split(re);
	var obj = {};
	obj.lhs = Equation.convertExpressionToObject(arr[0]);
	if( 1 < arr.length ){
		obj.rhs = Equation.convertExpressionToObject(arr[1]);
		obj.relation = "" + re.exec(str);
	}
	return obj;
};
/*
// Simplex Class
var Simplex = function(){
this.input = new Input();
this.output = new Output();
this.tableau = new Tableau();
this.state;
};
Simplex.prototype = {
toString:function(){
},
setInput:function( obj ){
this.input.parse( obj );
}
};
// Input Class
var Input = function(){
this.z;
this.raw;
this.type;
this.variables;
this.constraints;
};
Input.checkForRequirements = function( obj ){
var errMsg = "Input Object";
if( !obj || typeof obj !== "object" ){
errMsg = "must be an object with properies `z`, `constraints` and `type`.";
}
return errMsg;
}
Input.prototype = {
toString:function(){
},
parse:function( obj ){
this.raw = obj;
var zEquation = new Equation(obj.z);
this.z = obj.z;
}
};
// Matrix Class
var Matrix = function(){
this.columnLength;
this.rowLength;
this.matrix;
};
// Tableau Class
var Tableau = function(){
this.matrix;
this.limit;
this.state;
};

// Output Class
var Output = function(){
this.matrix;
this.result;
};
Output.prototype = {
toString:function(){
}
};
 */
