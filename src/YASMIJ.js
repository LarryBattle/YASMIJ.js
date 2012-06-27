/*
 * @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
 */
String.prototype.trim = String.prototype.trim || function(){
	return (this||"").replace(/^\s+|\s+$/g, "");
};
// Equation Class
var Equation = function () {
	this.comparison = "";
	this.leftSide = {};
	this.rightSide = {};
	this.terms = [];
};
Equation.hasManyCompares = function (str) {
	var RE_compares = /[<>]=?|=/g;
	var matches = ("" + str).replace(/\s/g, "").match(RE_compares) || [];
	return 1 < matches.length;
};
Equation.hasOtherMathSigns = function (str) {
	return (/[\*\/%]/).test(str);
};
Equation.hasIncompleteBinaryOperator = function (str) {
	var hasError,
	noSpaceStr = ("" + str).replace(/\s/g, ""),
	RE_hasNoPlusOrMinus = /^[^\+\-]+$/,
	RE_noLeftAndRightTerms = /[\+\-][><=\+\-]|[><=\+\-]$/;
	hasError = /\s/.test(("" + str).trim()) && RE_hasNoPlusOrMinus.test(noSpaceStr);
	hasError = hasError || RE_noLeftAndRightTerms.test(noSpaceStr);
	return hasError;
};
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
Equation.checkInput = function (str) {
	var errMsg = Equation.getErrorMessage(str);
	if (errMsg) {
		throw new Error(errMsg);
	}
};
Equation.convertStrToTermArray = function(str){
	var coeff = parseFloat(str) || (/^\s*-/.test(str)?-1:1);
	var term = ""+((/[^\d\-]+$/).exec(str)||"");
    return [ coeff, term ];
};
// @returns {array}
Equation.getTermsFromStr = function(str){
	var RE_findSignForTerm = /([\+\-])\s+/g; 
	return (""+str).replace(/^\s*\+/,"").replace( RE_findSignForTerm, "$1").split(/\s+[\+]?/);
};
Equation.convertExpressionToObject = function (str) {
	var term, obj = {},
		matches = Equation.getTermsFromStr( str ),
		i = matches.length;
	while (i--) {
		term = Equation.convertStrToTermArray( matches[i] );
		obj[term[1]] = term[0];
	}
	return obj;
};
Equation.parse = function (str) {
	Equation.checkInput(str);
	str = (""+(str||"")).trim();
	var obj;
	if (!str) {
		obj = {
			0 : 1
		};
	}else if ( !obj && !isNaN(str)) {
		obj = {
			1 : parseFloat(str)
		};		
	}else{
		obj = Equation.convertExpressionToObject(str);
	}
	return {lhs:obj};
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
