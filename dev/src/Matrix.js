/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/

// Matrix Class
var Matrix = function(){
	this.array = [];
	this.rows = 0;
	this.columns = 0;
};
Matrix.isArray = function( obj ){
	return Object.prototype.toString.call(obj) === "[object Array]";
};
Matrix.parse = function( input ){
	var obj = new Matrix(), isArray = Matrix.isArray( input );
	if( input !== undefined && !( isArray && !input.length) ){	
		if( isArray && Matrix.isArray( input[0] )){
			obj.array = input;
		}else{
			input = isArray ? input : [ input ];
			obj.addRow( input );
		}
	}
	return obj;
};
Matrix.scaleRow = function(scale, row){
	if( !Matrix.isArray(row) ){
		return row;
	}
	row = row.concat();
	for(var i = 0, len = row.length; i < len; i++ ){
		row[i] *= scale;
	}
	return row;
};
Matrix.addRows = function(rowA, rowB){
	return Matrix.scaleAndAddRows(1, rowA, 1, rowB );
};
Matrix.scaleAndAddRows = function( scaleA, rowA, scaleB, rowB){
	rowA = (Matrix.isArray(rowA)) ? rowA.concat() : [];
	rowB = (Matrix.isArray(rowB)) ? rowB.concat() : [];
	var len = Math.max( rowA.length, rowB.length );
	for(var i = 0; i < len; i++ ){
		rowA[i] = (scaleA*(rowA[i]||0)) + (scaleB*(rowB[i]||0));
	}
	return rowA;
};
Matrix.inverseArray = function( arr ){
	if( !Matrix.isArray( arr ) ){
		return arr;
	}
	var i = arr.length;
	while( i-- ){
		arr[i] = -arr[i];
	}
	return arr;
};
Matrix.prototype.addRow = function(arr){
	arr = Matrix.isArray(arr) ? arr : [arr];
	this.array.push( arr );
	return this;
};
Matrix.prototype.getElement = function( i, j ){
	return this.array[i][j];
};
Matrix.prototype.getColumn = function( j ){
	var arr = [];
	this.forEachRow(function(i, row){
		arr.push( row[ j ] );
	});
	return arr;
};
Matrix.prototype.getRow = function( i ){
	return this.array[i];
};
Matrix.prototype.get = function( row, col ){
	if( !col && col !== 0 ){
		return this.getRow( row );
	}else if( row || row === 0 ){
		return this.getElement( row, col );
	}else{
		return this.getColumn( col );
	}
};
Matrix.prototype.forEachRow = function(fn){
	if( typeof fn === "function"){
		for( var i = 0, len = this.array.length; i < len; i++){
			fn( i, this.array[i], this.array );
		}
	}
	return this;
};
Matrix.prototype.getMinElementInRow = function( rowI, excludeLastElement ){
	var row = (this.array[rowI] || []),
		arr = [ 0, row[0] ], 
		i = 0, 
		len = (excludeLastElement ? row.length - 1 : row.length);
	
	for( ; i < len; i++ ){
		if( row[ i ] < arr[1] ){
			arr[0] = i;
			arr[1] = row[i];
		}
	}
	return arr;
};
Matrix.prototype.getMostNegIndexFromLastRow = function(){
	var result = this.getMinElementInRow( this.array.length - 1, true );
	return result[1] < 0 ? result[0] : -1;
};
Matrix.prototype.getRowIndexWithPosMinColumnRatio = function( colI ){
	var rowI = -1, minVal = Infinity, i = 0, len = this.array.length - 1, val, arr;
	if( colI < 0 || len <= colI ){
		return rowI;
	}
	for(; i < len; i++ ){
		arr = this.array[i];
		val = arr[ arr.length - 1 ] / arr[colI];
		if( 0 <= val && val < minVal ){
			rowI = i;
			minVal = val;
		}
	}
	return rowI;
};
Matrix.prototype.toString = function( input ){
	var str = "";
	this.forEachRow( function( i, row ){
		if(i){
			str += ",";
		}
		str += "[" + row.toString() + "]";
	});
	if(this.array.length != 1 ){
		str = "[" + str + "]";
	}
	return str;
};
Matrix.prototype.getSize = function(){
	var columns = 0, rows = this.array.length, i = rows, x;
	while( i-- ){
		x = this.array[i].length;
		columns = columns < x ? x : columns;
	}
	return [ columns, rows ];
};
Matrix.prototype.scaleRow = function(scaleA, rowI ){
	var row = this.array[ rowI ] || [];
	for(var i = 0, len = row.length; i < len; i++ ){
		row[i] *= scaleA;
	}
	return this;
};
Matrix.prototype.addToRow = function(iRow, els){
	if( this.array[iRow] ){
		this.array[iRow] = (this.array[iRow] || []).concat(els);
	}else{
		this.addRow(els);
	}
	return this;
};
Matrix.getMaxArray = function(arrays){
	var index = 0, max = 0;
	if( !Matrix.isArray( arrays ) || !Matrix.isArray( arrays[0] ) ){
		return null;
	}
	var i = arrays.length;
	while( i-- ){
		if( max < arrays[i].length ){
			index = i;
			max = arrays[i].length;
		}
	}
	return [ index, max ];
};
Matrix.prototype.pivot = function( rowI, colI ){
	var i = this.array.length, val, pRow = this.array[ rowI ];
	if( !pRow ){
		return this;
	}
	this.scaleRow( (1/this.getElement( rowI, colI )), rowI );
	
	while( i-- ){
		if( i !== rowI ){
			val = this.getElement( i, colI );
			this.array[ i ] = Matrix.scaleAndAddRows( -val, pRow, 1, this.array[ i ] );
		}
	}
	return this;
};
Matrix.prototype.getUnitValueForColumn = function( colI ){
	var nonZeroValues = 0, val = 0;
	
	this.forEachRow(function(i, row, rows){
		if (row[colI] === 1) {
			val = row[row.length - 1];
		}
		if( row[ colI ] ){
			nonZeroValues++;		
		}
	});
	val = ( nonZeroValues === 1 ) ? val : 0; 
	return val;
};
Matrix.prototype.getLastElementOnLastRow = function(){
	var row = this.array[this.array.length - 1];
	return row[ row.length - 1];
};
