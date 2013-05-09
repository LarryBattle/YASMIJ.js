/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/
(function(root){
	// Tableau Class
	var Tableau = function(){
		this.input = null;
		this.colNames = null;
		this.matrix = null;
		this.limit = 1e4;
		this.cycles = 0;
		//this.state = null;
	};
	Tableau.getErrorMessage = function( input ){
		if( !(input instanceof YASMIJ.Input) ){
			return "Must pass an instance of the Input class.";
		}
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
		return obj;
	};
	Tableau.getPivotPoint = function( matrix ){
		if( !(matrix instanceof YASMIJ.Matrix ) ){
			return null;
		}
		var point = {};
		point.column = matrix.getMostNegIndexFromLastRow();
		point.row = matrix.getRowIndexWithPosMinColumnRatio( point.column );
		if( point.column < 0 || point.row < 0 ){
			return null;
		}
		return point;
	};
	Tableau.prototype.addConstraintsToMatrix = function( termNames ){
		var constraints = this.input.constraints;
		for( var i = 0, len = constraints.length; i < len; i++ ){
			this.matrix.addRow( constraints[i].createRowOfValues( termNames ) );
		}
	};
	/**
	 * Appends the objective function to the end of the matrix.
	 */
	Tableau.prototype.addZToMatrix = function( termNames ){
		var row = this.input.z.createRowOfValues( termNames );
		this.matrix.addRow( YASMIJ.Matrix.inverseArray( row ) );
	};
	Tableau.prototype.setMatrixFromInput = function(){
		this.matrix = new YASMIJ.Matrix();
		this.colNames = this.input.getTermNames(true);
		var termNames = this.colNames.concat("1");
		
		this.addConstraintsToMatrix( termNames );
		this.addZToMatrix( termNames );
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
		var getPoint = Tableau.getPivotPoint,
			point = getPoint( this.matrix ),
			limit = this.limit;
			
		while( point && limit-- ){
			this.matrix.pivot( point.row, point.column );	
			point = getPoint( this.matrix );
			this.cycles++;
		}
		return this;
	};
	Tableau.prototype.getOutput = function(){
		var obj = {}, names = this.colNames.concat();
		for(var i = 0, len = names.length; i < len; i++ ){
			obj[ names[i] ] = this.matrix.getUnitValueForColumn( i );
		}
		obj.z = this.matrix.getLastElementOnLastRow();
		return YASMIJ.Output.parse(obj,this.matrix);
	};
	root.Tableau = Tableau;
}(YASMIJ));










