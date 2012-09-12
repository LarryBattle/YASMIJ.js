/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/

// Tableau Class
var Tableau = function(){
	this.input = null;
	this.colNames = null;
	this.matrix = null;
	this.limit = 1e4;
	//this.state = null;
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
	obj.setMatrixFromInput();
	//obj.state = "created";
	return obj;
};
Tableau.prototype.addConstraintsToMatrix = function( termNames ){
	var constraints = this.input.constraints;
	for( var i = 0, len = constraints.length; i < len; i++ ){
		this.matrix.addRow( constraints[i].createRowOfValues( termNames ) );
	}
};
Tableau.prototype.addZToMatrix = function( termNames ){
	var row = this.input.z.createRowOfValues( termNames );
	this.matrix.addRow( Matrix.inverseArray( row ) );
};
Tableau.prototype.setMatrixFromInput = function(){
	this.matrix = new Matrix();
	this.colNames = this.input.getTermNames(true);
	var termNames = this.colNames.concat("1");
	
	this.addConstraintsToMatrix( termNames );
	this.addZToMatrix( termNames );
};
Tableau.prototype.getRow = function( names, constraintI ){
	var row;
	return row;
};
Tableau.prototype.toString = function(){
	var result = "";
	if( this.matrix ){
		result += "[" + this.colNames.concat("Constant").toString() + "]";
		result += this.matrix.toString();
	}
	return result;
};
Tableau.prototype.solve = function(){
	var point = this.getPivotPoint();
};
Tableau.prototype.getPivotPoint = function(){
	var point = {};
	point.column = this.matrix.getMostNegIndexFromLastRow();
	point.row = this.matrix.getRowIndexWithPosMinColumnRatio( point.column );
	return point;
};











