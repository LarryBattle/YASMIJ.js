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
	var obj = new Matrix();
	if( Matrix.isArray( input ) && Matrix.isArray( input[0] )){
		obj.array = input;
	}else{
		input = Matrix.isArray( input ) ? input : [ input ];
		obj.addRow( input );
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
	rowA = (Matrix.isArray(rowA)) ? rowA.concat() : [];
	rowB = (Matrix.isArray(rowB)) ? rowB.concat() : [];
	var len = Math.max( rowA.length, rowB.length );
	for(var i = 0; i < len; i++ ){
		rowA[i] = (rowA[i]||0) + (rowB[i]||0);
	}
	return rowA;
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
Matrix.prototype.addRow = function(arr){
	arr = (typeof arr !== "object") ? [ arr ] : arr;
	this.array.push( arr );
	this.columns = Math.max( arr.length, this.columns );
	this.rows += 1;
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
Matrix.prototype.getMinElementInRow = function( rowI ){
	var row = this.array[rowI] || [];
	var arr = [ 0, row[0] ];
	for( var i = 0, len = row.length; i < len; i++ ){
		if( row[ i ] < arr[1] ){
			arr[0] = i;
			arr[1] = row[i];
		}
	}
	return arr;
};
Matrix.prototype.toString = function( input ){
	var str = "";
	this.forEachRow( function( i, row ){
		if(0 < i){
			str += "\n";
		}
		str += row.join(', ');
	});
	return str;
};
Matrix.prototype.getSize = function(){
	return [ this.columns, this.rows ];
};
Matrix.prototype.scaleRow = function(scaleA, rowI ){
	var row = this.array[ rowI ] || [];
	for(var i = 0, len = row.length; i < len; i++ ){
		row[i] *= scaleA;
	}
	return this;
};




