/*
 * @project YASMIJ.js, 'Yet another simplex method implementation in Javascript'
 * @author Larry Battle
 * @license MIT License <http://www.opensource.org/licenses/mit-license>
 */

'use strict';
// Matrix Class
/**
 * Represents a matrix.
 * The is constructed so that the last element in each row is considered the Right Hand Side(RHS).
 * This last row is the indicator row, which holds the coefficients from the objective function.
 * @constructor YASMIJ.Matrix
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4]]);
exampleMatrix.toString() === '[[1,2],[3,4]]';
 */

var YASMIJ = require('./YASMIJ.base.js');
var Matrix = function () {
	this.array = [];
};
/**
 * Checks if an object is an array.
 * @param {Object}
 * @return {Boolean}
 * @example
YASMIJ.Matrix.isArray({}) === false;
YASMIJ.Matrix.isArray([1,2]) === true;
 */
Matrix.isArray = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
};
/**
 * Converts an array to an matrix
 * @param {Array} input - single or two dimensional array
 * @return {Matrix}
 * @example
YASMIJ.Matrix.parse([[1,2,3],[1,2,3]]).toString() === '[[1,2,3],[1,2,3]]';
 */
Matrix.parse = function (input) {
	var obj = new Matrix(),
	isArray = Matrix.isArray(input);

	if (input !== undefined && !(isArray && !input.length)) {
		if (isArray && Matrix.isArray(input[0])) {
			obj.array = input;
		} else {
			input = isArray ? input : [input];
			obj.addRow(input);
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
Matrix.scaleRow = function (scale, row) {
	if (!Matrix.isArray(row)) {
		return row;
	}
	row = row.concat();
	for (var i = 0, len = row.length; i < len; i++) {
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
Matrix.addRows = function (rowA, rowB) {
	return Matrix.scaleThenAddRows(1, rowA, 1, rowB);
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
YASMIJ.Matrix.scaleThenAddRows( 2, [1,2], 3, [4,5] ); // returns [14, 19]
 */
Matrix.scaleThenAddRows = function (scaleA, rowA, scaleB, rowB) {
	rowA = (Matrix.isArray(rowA)) ? rowA.concat() : [];
	rowB = (Matrix.isArray(rowB)) ? rowB.concat() : [];
	var len = Math.max(rowA.length, rowB.length);
	for (var i = 0; i < len; i++) {
		rowA[i] = (scaleA * (rowA[i] || 0)) + (scaleB * (rowB[i] || 0));
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
Matrix.inverseArray = function (arr) {
	if (!Matrix.isArray(arr)) {
		return arr;
	}
	var i = arr.length;
	while (i--) {
		arr[i] = -arr[i];
	}
	return arr;
};
/**
 * Returns the transposed array of an array
 * @param {Array} arr - multi dimensional array
 * @return {Array} returns null if not supplied a multi-dimensional arrays
 * @example
YASMIJ.Matrix.transpose([[1,2],[3,4]]); // returns [[1,3],[2,4]];
 */
Matrix.transpose = function (arr) {
	if (!Matrix.isArray(arr) || !arr.length || !Matrix.isArray(arr[0])) {
		return null;
	}
	var result = [],
	iLen = arr.length,
	info = Matrix.getMaxArray(arr),
	jLen = info ? info.max : 0;

	for (var i = 0; i < jLen; i++) {
		result[i] = [];
		for (var j = 0; j < iLen; j++) {
			result[i][j] = arr[j][i];
		}
	}
	return result;
};
/**
 * Find the index and value of the largest positive or negative number in an array.
 * @param {Boolean} findPositive - if true, looks for the largest positive number, otherwise searches for largest negative.
 * @param {Number} excludeIndex - index to
 * @param {Array} arr - single dimensional array
 * @return {Object} - Object with value and index of the largest number found.
 * @example
YASMIJ.Matrix.getGreatestElementInRow([-1,0,1], 1, false ); // return {value: -1, index: 0}
YASMIJ.Matrix.getGreatestElementInRow([-1,0,1], 2, true ); // return {value: 0, index: 1}
 */
Matrix.getGreatestElementInRow = function (arr, excludeIndex, findPositive) {
	if (!arr || !Matrix.isArray(arr)) {
		return null;
	}
	var obj = {
		value : Infinity * (findPositive ? -1 : 1),
		index : -1
	};

	for (var i = 0, len = arr.length; i < len; i++) {
		if (excludeIndex === i) {
			continue;
		}
		if ((findPositive && obj.value < arr[i]) || (!findPositive && arr[i] < obj.value)) {
			obj.index = i;
			obj.value = arr[i];
		}
	}
	return obj;
};
/**
 * Adds a new single dimensional array
 * @param {Array} - single dimensional array
 * @return {Matrix} self
 * @chainable
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4]]);
exampleMatrix.addRow([5,6]);
exampleMatrix.toString() === '[[1,2],[3,4],[5,6]]';
 */
Matrix.prototype.addRow = function (arr) {
	arr = Matrix.isArray(arr) ? arr : [arr];
	this.array.push(arr);
	return this;
};
/**
 * Transpose the matrix
 * @return {Matrix} self
 * @see YASMIJ.Matrix.transpose()
 * @chainable
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4]]);
exampleMatrix.transpose();
exampleMatrix.toString() === '[[1,3],[2,4]]';
 */
Matrix.prototype.transpose = function () {
	this.array = Matrix.transpose(this.array);
	return this;
};
/**
 * Checks if the current instance has the same values as other matrix.
 * @parma {Matrix} - Instance of YASMIJ.Matrix
 * @return {Boolean}
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4]]);
exampleMatrix.equals([[1,2]]) === false;
exampleMatrix.equal( exampleMatrix ) === true;
 */
Matrix.prototype.equals = function (obj) {
	return obj && obj instanceof Matrix && this.toString() === obj.toString();
};
/**
 * Returns an element specified by a row and column.
 * @param {Number} i - row index
 * @param {Number} j - column index
 * @return {Object} - should be a number but can be an object.
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4]]);
exampleMatrix.getElement( 1, 1 ) === 4;
 */
Matrix.prototype.getElement = function (i, j) {
	return this.array[i][j];
};
/**
 * Returns the column of an array
 * @param {Number} j - column index
 * @return {Array} single dimensional array
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4]]);
exampleMatrix.getColumn(1); // returns [2,4]
 */
Matrix.prototype.getColumn = function (j) {
	var arr = [];
	this.forEachRow(function (i, row) {
		arr.push(row[j]);
	});
	return arr;
};
/**
 * Returns the row of an array
 * @param {Number} i - row index
 * @return {Array} single dimensional array
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4]]);
exampleMatrix.getRow(0); // returns [1,2]
 */
Matrix.prototype.getRow = function (i) {
	return this.array[i];
};
/**
 * Returns the column, row or element of an array
 * @param {Number} i - row index
 * @param {Number} j - column index
 * @return {Array|Object}
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4]]);
exampleMatrix.get(1,1); // returns 4
exampleMatrix.get(1); // returns [3,4]
exampleMatrix.get(null, 1); // returns [2,4]
 */
Matrix.prototype.get = function (row, col) {
	if (!col && col !== 0) {
		return this.getRow(row);
	} else if (row || row === 0) {
		return this.getElement(row, col);
	} else {
		return this.getColumn(col);
	}
};
/**
 * For each row of the matrix, calls an callback.
 * The arguments are `fn( index, row, matrix )`
 * @param {Function} fn - callback, called on each row
 * @return {Matrix}
 * @chainable
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4]]);
exampleMatrix.forEachRow(function(i, row){
console.log(i);
});
// prints 0,1
 */
Matrix.prototype.forEachRow = function (fn) {
	if (typeof fn === 'function') {
		for (var i = 0, len = this.array.length; i < len; i++) {
			fn(i, this.array[i], this.array);
		}
	}
	return this;
};
/**
 * For each row of the matrix, calls an callback.
 * If the callback returns an array, then the current row is replaced that.
 * The arguments are `fn( index, row, matrix )`
 * @param {Function} fn - callback, called on each row
 * @return {Matrix} - self
 * @chainable
 */
Matrix.prototype.replaceEachRow = function (fn) {
	var newRow;
	if (typeof fn === 'function') {
		for (var i = 0, len = this.array.length; i < len; i++) {
			newRow = fn(i, this.array[i], this.array);
			if (newRow && Matrix.isArray(newRow)) {
				this.array[i] = newRow;
				newRow = null;
			}
		}
	}
	return this;
};
/**
 * Returns the matrix as an array.
 * @return {Array} - multi-dimensional array
 */
Matrix.prototype.toArray = function () {
	return this.array;
};
/**
 * Returns the index of the element in the last row with the greatest negativity or positivity.
 * Note: This excludes the last element in the row. The last element in each row is reserved as 'Right Hand Side'.
 * @param {Boolean} isPositive - true:largest positive, false:largest negative
 * @return {Number}
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[-1,-2],[-3,-4,-5]]);
exampleMatrix.getGreatestValueFromLastRow() === 1; // represents -4
 */
Matrix.prototype.getGreatestValueFromLastRow = function (isPositive) {
	if (!this.array || this.array.length < 1) {
		return -1;
	}
	var row = this.array[this.array.length - 1];
	var obj = Matrix.getGreatestElementInRow(row, row.length - 1, !!isPositive);

	if (isPositive) {
		return -1 < obj.value ? obj.index : -1;
	} else {
		return obj.value < 0 ? obj.index : -1;
	}
};
/**
 * Returns the row index of the
 * @param {Number} colI - column index
 * @param {Boolean} excludeLastRow - excludes the last row
 * @return {Object} - {'rowIndex':Number, 'minValue':Number}
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[10,2]]);
exampleMatrix.getRowIndexWithPosMinColumnRatio(0); // returns `{rowIndex: 1, minValue: 0.2}`
 */
Matrix.prototype.getRowIndexWithPosMinColumnRatio = function (colI, excludeLastRow) {
	var obj = {
		rowIndex : -1,
		minValue : Infinity
	},
	len = this.array.length + (excludeLastRow ? -1 : 0),
	val,
	row;

	if (colI < 0 || this.array[0].length <= colI) {
		return null;
	}
	for (var i = 0; i < len; i++) {
		row = this.array[i];
		val = row[row.length - 1] / row[colI];
		if (0 <= val && val < obj.minValue) {
			obj.rowIndex = i;
			obj.minValue = val;
		}
	}
	return obj;
};
/**
 * Sets all rows to the width of the longest row
 * @return {Matrix} - self
 * @chainable
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4,5]]);
exampleMatrix.setUniformedWidth().toString() === '[[1,2,],[3,4,5]]';
 */
Matrix.prototype.setUniformedWidth = function () {
	var info = Matrix.getMaxArray(this.array);
	for (var i = 0, len = this.array.length; i < len; i++) {
		this.array[i].length = info.max;
	}
	return this;
};
/**
 * Returns the matrix as a string
 * @return {String}
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4]]);
exampleMatrix.toString() === '[[1,2],[3,4]]';
 */
Matrix.prototype.toString = function () {
	var str = '';
	this.forEachRow(function (i, row) {
		if (i) {
			str += ',';
		}
		str += '[' + row.toString() + ']';
	});
	str = '[' + str + ']';
	return str;
};
/**
 * Returns the size of the matrix
 * @return {Array} [columns, rows]
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4],[5,6]]);
exampleMatrix.getSize(); // [2,3]
 */
Matrix.prototype.getSize = function () {
	var columns = 0,
	rows = this.array.length,
	i = rows,
	x;
	while (i--) {
		x = this.array[i].length;
		columns = columns < x ? x : columns;
	}
	return [columns, rows];
};
/**
 * Multiplies a row by a factor.
 * @param {Number} scaleA - factor
 * @param {Number} rowI - row index
 * @return {Matrix} - self
 * @chainable
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4]]);
exampleMatrix.scaleRow(3, 1);
exampleMatrix.toString() === '[[1,2],[9,12]]';
 */
Matrix.prototype.scaleRow = function (scaleA, rowI) {
	var row = this.array[rowI] || [];
	for (var i = 0, len = row.length; i < len; i++) {
		row[i] *= scaleA;
	}
	return this;
};
/**
 * Appends element(s) to the end of a row in the matrix.
 * Or adds a new row to the matrix.
 * @param {Number} iRow - row index
 * @param {Array|Number} els - element or array
 * @return {Matrix} - self
 * @chainable
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4]]);
exampleMatrix.addToRow(1,5);
exampleMatrix.toString() === '[[1,2],[3,4,5]]';
 */
Matrix.prototype.addToRow = function (iRow, els) {
	if (this.array[iRow]) {
		this.array[iRow] = (this.array[iRow] || []).concat(els);
	} else {
		this.addRow(els);
	}
	return this;
};
/**
 * Returns the index and max length of the longest row in an array.
 * @param {Array} arrays - single or multi dimensional
 * @return {Object} {index: Number, 'max': Number }
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4]]);
 */
Matrix.getMaxArray = function (arrays) {
	var obj = {
		index : 0,
		max : 0
	};
	if (!Matrix.isArray(arrays)) {
		return null;
	}
	if (!Matrix.isArray(arrays[0])) {
		obj.max = arrays.length;
		return obj;
	}
	var i = arrays.length;
	while (i--) {
		if (obj.max < arrays[i].length) {
			obj.index = i;
			obj.max = arrays[i].length;
		}
	}
	return obj;
};
/**
 * Pivots the matrix at the specified row and column.
 * Pivoting forces a specified row and column element to 1,
 * with the rest of the column elements to zero through basic row operations.
 * @param {Number} rowI - row index
 * @param {Number} colI - column index
 * @return {Matrix} - self
 * @chainable
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4]]);
exampleMatrix.pivot(0,0);
exampleMatrix.toString() === '[[1,2],[0,-2]]';
 */
Matrix.prototype.pivot = function (rowI, colI) {
	if (!this.array[rowI]) {
		return this;
	}
	var x = this.getElement(rowI, colI),
	val,
	pRow;

	// force element at (rowI, colI) to 1
	this.scaleRow(1 / x, rowI);
	pRow = this.array[rowI];

	// force element at (i, colI) to 0, this works because (rowI, colI) == 1,
	// so just multiply by the negative -1 and add to the current row.
	for (var i = 0, len = this.array.length; i < len; i++) {
		if (i === rowI) {
			continue;
		}
		val = this.getElement(i, colI);
		this.array[i] = Matrix.scaleThenAddRows(-val, pRow, 1, this.array[i]);
	}
	return this;
};
/**
 * Return the unit value for a column.
 * If a column has only one non-zero value then
 * the last element in the row (RHS element) is returned.
 * Otherwise, 0 is returned.
 * @param {Number} colI - column Index
 * @return {Number}
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[0,3],[1,4]]);
exampleMatrix.getUnitValueForColumn(0) === 4;
 */
Matrix.prototype.getUnitValueForColumn = function (colI) {
	var nonZeroValues = 0,
	val = 0;

	this.forEachRow(function (i, row) {
		if (row[colI] === 1) {
			// get value in the Right Hand Side(RHS)
			val = row[row.length - 1];
		}
		if (row[colI]) {
			nonZeroValues++;
		}
	});
	val = (nonZeroValues === 1) ? val : 0;
	return val;
};
/**
 * Returns the last element in the last row of the matrix.
 * @return {Object} should be a number
 * @example
var exampleMatrix = YASMIJ.Matrix.parse([[1,2],[3,4]]);
exampleMatrix.getLastElementOnLastRow() === 4;
 */
Matrix.prototype.getLastElementOnLastRow = function () {
	var row = this.array[this.array.length - 1];
	return row[row.length - 1];
};
YASMIJ.Matrix = Matrix;
