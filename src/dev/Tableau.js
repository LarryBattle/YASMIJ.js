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
Tableau.prototype.checkForError = function(){
	if( !(this.input instanceof Input) ){
		return "Must pass an instance from the Input class.";
	}
};
Tableau.parse = function( input ){
	var obj = new Tableau();
	obj.input = input;
	obj.checkForError();
	obj.input.convertToStandardForm();
	obj.setMatrixFromInput();
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
	return this.matrix.toString();
};



/* test 
var x = Input( "maximize", "a + b - 10", ["a<34", "b <= 4", "a + b > 2"] );
var y = Tableau.parse(x);
*/












