'use strict';
/*
 * @project YASMIJ.js, 'Yet another simplex method implementation in Javascript'
 * @author Larry Battle
 * @license MIT License <http://www.opensource.org/licenses/mit-license>
 */
var YASMIJ = require('./YASMIJ.base.js');

/**
 * Simplex Class - not sure if this class is needed.
 * @constructor
 */
var Simplex = function () {
	this.input = new YASMIJ.Input();
	this.output = new YASMIJ.Output();
	this.tableau = new YASMIJ.Tableau();
	this.state = null;
};
Simplex.Phrase1 = function (obj) {
	// add slack and artifical variables
	obj.convertToEquationForm();
	// solve the tableau such that you min z = sum of artificial variables.
	// checkForFeasibility( obj.getSolutionValue() ); something like `if( 0 < z ) return not feasibile`
	//
	// remove artificial variables from tableau
	// solve original problem using simplex method
};
Simplex.Phrase2 = function () {};
Simplex.TwoPhraseMethod = function () {
	// Simplex.Pharase1(obj);
	// check(obj);
	// Simplex.Pharase2(obj);
	// return result;
};
/*
 * @todo Create this function
 */
Simplex.prototype.toString = function () {};
/**
 * Sets the input for the current instance
 * @param {Object}
 * @return {YASMIJ.Input}
 */
Simplex.prototype.setInput = function (obj) {
	this.input.parse(obj);
};
Simplex.parse = function () {
	//input
};
/**
 * Checks if input to `Simplex.solve()` is correct.
 * @param {Object} obj -
 * @return {String} error message to display
 */
Simplex.getErrors = function (obj) {
	if (typeof obj !== 'object') {
		return 'An object must be passed to YASMIJ.solve()';
	}
	if (!obj.type || !obj.objective || !obj.constraints) {
		return 'The object must have the properties `type`, `objective` and `constraints`.';
	}
};
/**
 * Checks if input to `YASMIJ.solve()` is correct.
 * Throws an error if there's a problem.
 * @param {Object} obj
 */
Simplex.checkForErrors = function (obj) {
	var errMsg = Simplex.getErrors(obj);
	if (errMsg) {
		throw new Error(errMsg);
	}
};
Simplex.solve = function (input) {
	Simplex.checkForErrors(input);
	return YASMIJ.Tableau.parse(
		YASMIJ.Input.parse(input.type, input.objective, input.constraints)).solve().getOutput();
};
YASMIJ.Simplex = Simplex;
