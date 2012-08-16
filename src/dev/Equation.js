/**
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
* - The standard will be (variables, ...) (comparison) (constants)
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
/*
* Checks to see if an object equals the current instance of Equation.
*/
Equation.equals = function( obj ){
	return mixin.areObjectsSame( this, obj );
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
	var noSpaceStr = ("" + str).replace(/\s/g, ""),		
		hasNoOperatorBetweenValues = /[^+\-><=]\s+[^+\-><=]/.test( (""+str) ),
		RE_noLeftAndRightTerms = /[+\-][><=+\-]|[><=+\-]$/;
		
	return RE_noLeftAndRightTerms.test(noSpaceStr) || hasNoOperatorBetweenValues;
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
};
/**
* Converts to the standard form.
* Standard form - [coeff of vars, ... , "comparison", constants ]
* returns {Array}
*/
Equation.prototype.setToStandardForm = function(){
	return [this.leftSide, this.relation, this.rightSide];
	return this;
};