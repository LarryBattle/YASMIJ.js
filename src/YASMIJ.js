/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
*/
// Equation Class
var Equation = function(){
	this.comparison;
	this.leftSide;
	this.rightSide;
	this.terms;
};
Equation.hasManyCompares = function(str){
	var RE_compares = /[<>]=?|=/g;
	var matches = (""+str).replace(/\s/g,"").match(RE_compares) || [];
	return 1 < matches.length;
};
Equation.hasOtherMathSigns = function( str ){
	return /[\*\/%]/.test(str);
};
Equation.hasIncompleteBinaryOperator = function( str ){
	var noSpaceStr = (""+str).replace( /\s/g, "" );
	var RE_hasNoPlusOrMinus = /^[^\+\-\d]+$/, RE_noLeftAndRightTerms = /[\+\-][><=\+\-]|[><=\+\-]$/;	
	return RE_hasNoPlusOrMinus.test(noSpaceStr) || RE_noLeftAndRightTerms.test(noSpaceStr);
};
Equation.getErrorMessage = function( str ){
	var errMsg;
	if( Equation.hasManyCompares( str ) ){
		errMsg = "Only 1 comparision (<,>,=, >=, <=) is allow in a equation.";
	}
	if( !errMsg && Equation.hasOtherMathSigns( str ) ){
		errMsg = "Only addition and subtraction is allowed. Get rid of math operators.";
	}
	if( !errMsg && Equation.hasIncompleteBinaryOperator( str ) ){
		errMsg = "Math operators must be in between terms. Good:(a+b=c). Bad:(a b+=c)";
	}
	return errMsg;
};
Equation.checkInput = function( str ){
	var errMsg = Equation.getErrorMessage( str );
	if( errMsg ){
		throw new Error( errMsg );
	}
};
Equation.parse = function( str ){
	Equation.checkInput( str );
	if( !str ){
		return {lhs:{0:1}};
	}
	if( !isNaN( str ) ){
		return { lhs: {1: parseFloat(str) } }
	}
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















