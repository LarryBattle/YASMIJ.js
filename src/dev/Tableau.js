/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/

// Tableau Class
var Tableau = function(){
	this.input = null;
	this.matrix = null;
	this.limit = 1e4;
	this.state = null;
};
Tableau.getErrorMessage = function( input ){
	var errMsg = "";
	if( !(input instanceof Input) ){
		errMsg = "Must pass an instance of the Input class.";
	}
	return errMsg;
};
Tableau.checkForError = function( input ){
	var errMsg = Tableau.getErrorMessage( input );
	if( errMsg ){
		throw new Error( errMsg );
	}
};
Tableau.parse = function( input ){
	var obj = new Tableau();
	Tableau.checkForError( input );
	obj.input = input.convertToStandardForm();
	//obj.setMatrixFromInput();
	obj.state = "created";
	return obj;
};
Tableau.prototype.setMatrixFromInput = function(){
	this.matrix = new Matrix();
	var names = this.input.getTermNames();
	for( var i = 0, len = this.input.constraints.length; i < len; i++){
		this.matrix.addRow( this.getRow( names, i ) );
	}
};
Tableau.prototype.getRow = function( names, constraintI ){
	var row;
	return row;
};
Tableau.prototype.toString = function(){
	if( this.matrix ){
		return this.matrix.toString();
	}
	return "Matrix is empty.";
};



/* test 
var x = Input( "maximize", "a + b - 10", ["a<34", "b <= 4", "a + b > 2"] );
var y = Tableau.parse(x);
*/












