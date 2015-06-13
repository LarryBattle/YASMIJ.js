/*
 * @project YASMIJ.js, 'Yet another simplex method implementation in Javascript'
 * @author Larry Battle
 * @license MIT License <http://www.opensource.org/licenses/mit-license>
 */
var YASMIJ = require('./YASMIJ.base.js');
/**
 * The tableau is modeled after this `http://math.uww.edu/~mcfarlat/simplexf.htm`.
 * @constructor Tableau
 */
var Tableau = function () {
	this.input = null;
	this.colNames = null;
	this.matrix = null;
	this.limit = 1e4;
	this.cycles = 0;
	//this.state = null;
};
/**
 * Checks the input for errors.
 * @param {YASMIJ.Input} input -
 */
Tableau.getErrorMessage = function (input) {
	if (!(input instanceof YASMIJ.Input)) {
		return 'Must pass an instance of the Input class.';
	}
};
/**
 * Checks the input for errors.
 * @param {YASMIJ.Input} input -
 */
Tableau.checkForError = function (input) {
	var errMsg = Tableau.getErrorMessage(input);
	if (errMsg) {
		throw new Error(errMsg);
	}
};
/**
 * Parse the input and returns new instance of YASMIJ.Tableau
 * @param {YASMIJ.Input} input -
 * @return {YASMIJ.Tableau}
 */
Tableau.parse = function (input) {
	var obj = new Tableau();
	Tableau.checkForError(input);
	obj.input = input.convertToStandardForm();
	obj.setMatrixFromInput();
	return obj;
};
/**
 * Returns the pivot point of a Tableau
 * @param {YASMIJ.Matrix} matrix -
 * @param {Boolean} isMin - true: minimization, false:maximization
 * @return {Object}
 */
Tableau.getPivotPoint = function (matrix, isMin) {
	if (!(matrix instanceof YASMIJ.Matrix)) {
		return null;
	}
	var point = {};
	point.column = matrix.getGreatestValueFromLastRow(!!isMin);
	var obj = matrix.getRowIndexWithPosMinColumnRatio(point.column, true) || {};
	point.row = obj.rowIndex;
	if (point.column < 0 || point.row < 0) {
		return null;
	}
	return point;
};
Tableau.prototype.addConstraintsToMatrix = function (termNames) {
	var constraints = this.input.constraints;
	for (var i = 0, len = constraints.length; i < len; i++) {
		this.matrix.addRow(constraints[i].getCoefficients(termNames));
	}
};
Tableau.prototype.getSortedTermNames = function () {
	var termNames = this.input.getTermNames(true);
	var specialNames = this.input.getAllSpecialTermNames();
	return YASMIJ.sortArrayWithSubsetAtEnd(termNames, specialNames);
};
/**
 * Appends the objective function to the end of the matrix.
 */
Tableau.prototype.addZToMatrix = function (termNames) {
	var b = YASMIJ.Constraint.parse('0 = ' + this.input.z.toString());
	b.moveTypeToOneSide('left', 'right');
	var row = b.leftSide.getCoefficients(termNames);
	row = row.concat(b.rightSide.getTermValue('1') || 0);
	this.matrix.addRow(row);
};
Tableau.prototype.setMatrixFromInput = function () {
	this.matrix = new YASMIJ.Matrix();
	this.colNames = this.getSortedTermNames();
	this.addConstraintsToMatrix(this.colNames.concat('1'));
	this.addZToMatrix(this.colNames);
};
Tableau.prototype.toString = function () {
	var result = '';
	if (this.matrix) {
		result += '[' + this.colNames.concat('Constant').toString() + '],';
		result += this.matrix.toString();
	}
	return result;
};
Tableau.prototype.solve = function (isMin) {
	var getPoint = Tableau.getPivotPoint,
	point = getPoint(this.matrix, isMin),
	limit = this.limit;
	while (point && limit--) {
		this.matrix.pivot(point.row, point.column);
		point = getPoint(this.matrix, isMin);
		this.cycles++;
	}
	return this;
};
Tableau.prototype.getOutput = function () {
	var obj = {},
	names = this.colNames.concat();
	for (var i = 0, len = names.length; i < len; i++) {
		obj[names[i]] = this.matrix.getUnitValueForColumn(i);
	}
	obj.z = this.matrix.getLastElementOnLastRow();
	return YASMIJ.Output.parse(obj, this.matrix);
};
YASMIJ.Tableau = Tableau;
