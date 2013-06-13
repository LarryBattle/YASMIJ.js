/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
*/
(function(root){
	"use strict";
	// Matrix Class
	/**
	* Represents a matrix.
	* @constructor YASMIJ.Matrix
	*/
	var Matrix = function(){
		this.array = [];
	};
	/**
	* Checks if an object is an array.
	* @param {Object}
	* @return {Boolean}
	* @example
	Matrix.isArray({}) === false;
	Matrix.isArray([1,2]) === true;
	*/
	Matrix.isArray = function( obj ){
		return Object.prototype.toString.call(obj) === "[object Array]";
	};
	/**
	* Converts an array to an matrix
	* @param {Array} input - single or two dimensional array
	* @return {Matrix}
	* @example
	YASMIJ.Matrix.parse([[1,2,3],[1,2,3]]).toString() === "[[1,2,3],[1,2,3]]";
	*/
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
	/**
	* Returns a copy of a single dimensional array multiplied by factor
	* @param {Number} scale - constant value
	* @param {Array} row - single dimensional array 
	* @return {Array}
	* @example
	YASMIJ.Matrix.scaleRow(3, [1,2,3] ); // returns [3,6,9]
	*/
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
	/**
	* Adds two single dimensional arrays together
	* @param {Array} rowA - single dimensional
	* @param {Array} rowB - single dimensional
	* @return {Array} rowA + rowB
	* @example
	YASMIJ.Matrix.addRows( [1,2], [2,3] ); // returns [3,5]
	*/
	Matrix.addRows = function(rowA, rowB){
		return Matrix.scaleAndAddRows(1, rowA, 1, rowB );
	};
	/**
	* Scales two single dimensional arrays then adds them together.
	* Same as ((scaleA * rowA) + (scaleB * rowB))
	* @param {Number} scaleA - constant
	* @param {Array} rowA - single dimensional
	* @param {Number} scaleB - constant
	* @param {Array} rowB - single dimensional
	* @return {Array}
	* @example 
	YASMIJ.Matrix.scaleAndAddRows( 2, [1,2], 3, [4,5] ); // returns [14, 19]
	*/
	Matrix.scaleAndAddRows = function( scaleA, rowA, scaleB, rowB){
		rowA = (Matrix.isArray(rowA)) ? rowA.concat() : [];
		rowB = (Matrix.isArray(rowB)) ? rowB.concat() : [];
		var len = Math.max( rowA.length, rowB.length );
		for(var i = 0; i < len; i++ ){
			rowA[i] = (scaleA*(rowA[i]||0)) + (scaleB*(rowB[i]||0));
		}
		return rowA;
	};
	/**
	* Negates all elements in a single dimensional array.
	* @param {Array} - single dimensional array
	* @return {Array}
	* @example 
	YASMIJ.Matrix.inverseArray([-1,0,3]); // returns [1,0,-3]
	*/
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
	/**
	* Adds a new single dimensional array 
	* @param {Array} - single dimensional array
	* @return {Matrix} self
	* @chainable
	* @example
	
	*/
	Matrix.prototype.addRow = function(arr){
		arr = Matrix.isArray(arr) ? arr : [arr];
		this.array.push( arr );
		return this;
	};
	/**
	* 
	* @param {}
	* @return {}
	*/
	Matrix.prototype.getElement = function( i, j ){
		return this.array[i][j];
	};
	/**
	* 
	* @param {}
	* @return {}
	*/
	Matrix.prototype.getColumn = function( j ){
		var arr = [];
		this.forEachRow(function(i, row){
			arr.push( row[ j ] );
		});
		return arr;
	};
	/**
	* 
	* @param {}
	* @return {}
	*/
	Matrix.prototype.getRow = function( i ){
		return this.array[i];
	};
	/**
	* 
	* @param {}
	* @return {}
	*/
	Matrix.prototype.get = function( row, col ){
		if( !col && col !== 0 ){
			return this.getRow( row );
		}else if( row || row === 0 ){
			return this.getElement( row, col );
		}else{
			return this.getColumn( col );
		}
	};
	/**
	* 
	* @param {}
	* @return {}
	*/
	Matrix.prototype.forEachRow = function(fn){
		var newRow;
		if( typeof fn === "function"){
			for( var i = 0, len = this.array.length; i < len; i++){
				newRow = fn( i, this.array[i], this.array );
				if(newRow){
					this.array[i] = newRow;
					newRow = null;
				}
			}
		}
		return this;
	};
	/**
	 * Returns the mininum value in a row.
	 * @param{Number} rowI - index of the row
	 * @param{Boolean} excludeLastElement - exclude the last element in each row
	 * @return{Array} - Array[ "index of min value", "min value" ]
	 */
	Matrix.prototype.getMinElementInRow = function( rowI, excludeLastElement ){
		var row = (this.array[rowI] || []),
			arr = [ 0, row[0] ], 
			i = 0, 
			len = row.length + (excludeLastElement ? -1 : 0);
		
		for( ; i < len; i++ ){
			if( row[ i ] < arr[1] ){
				arr[0] = i;
				arr[1] = row[i];
			}
		}
		return arr;
	};
	/**
	* 
	* @param {}
	* @return {}
	*/
	Matrix.prototype.getMostNegIndexFromLastRow = function(){
		var result = this.getMinElementInRow( this.array.length - 1, true );
		return result[1] < 0 ? result[0] : -1;
	};
	/**
	* 
	* @param {}
	* @return {}
	*/
	Matrix.prototype.getRowIndexWithPosMinColumnRatio = function( colI ){
		var rowI = -1, minVal = Infinity, i = 0, len = this.array.length - 1, val, arr;
		if( colI < 0 || this.array[0].length <= colI ){
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
	/**
	* 
	* @param {}
	* @return {}
	*/
	Matrix.prototype.toString = function(){
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
	/**
	 * Returns the size of the matrix
	 * @return{Array} [columns, rows]
	 */
	Matrix.prototype.getSize = function(){
		var columns = 0, rows = this.array.length, i = rows, x;
		while( i-- ){
			x = this.array[i].length;
			columns = columns < x ? x : columns;
		}
		return [ columns, rows ];
	};
	/**
	* 
	* @param {}
	* @return {}
	*/
	Matrix.prototype.scaleRow = function(scaleA, rowI ){
		var row = this.array[ rowI ] || [];
		for(var i = 0, len = row.length; i < len; i++ ){
			row[i] *= scaleA;
		}
		return this;
	};
	/**
	* 
	* @param {}
	* @return {}
	*/
	Matrix.prototype.addToRow = function(iRow, els){
		if( this.array[iRow] ){
			this.array[iRow] = (this.array[iRow] || []).concat(els);
		}else{
			this.addRow(els);
		}
		return this;
	};
	/**
	 * Returns the longest row
	 * @return{Array} [index, max length]
	 */
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
	/**
	* 
	* @param {}
	* @return {}
	*/
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
	/**
	* 
	* @param {}
	* @return {}
	*/
	Matrix.prototype.getUnitValueForColumn = function( colI ){
		var nonZeroValues = 0, val = 0;
		
		this.forEachRow(function(i, row){
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
	/**
	* 
	* @param {}
	* @return {}
	*/
	Matrix.prototype.getLastElementOnLastRow = function(){
		var row = this.array[this.array.length - 1];
		return row[ row.length - 1];
	};
	root.Matrix = Matrix;
}(YASMIJ));
