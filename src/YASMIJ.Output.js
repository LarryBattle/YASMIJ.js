/*
 * @project YASMIJ.js, 'Yet another simplex method implementation in Javascript'
 * @author Larry Battle
 * @license MIT License <http://www.opensource.org/licenses/mit-license>
 */

var YASMIJ = require('./YASMIJ.base.js');
/**
 * Output Class
 * @constructor
 */
var Output = function (obj) {
	this.result = obj;
	this.checkForError();
	return this;
};
/**
 * Checks object for errors.
 * @return {String}
 */
Output.getErrorMessage = function (obj) {
	var errMsg;
	if (typeof obj !== 'object') {
		errMsg = 'An object must be passed.';
	}
	return errMsg;
};
/**
 * Returns an new instance of YASMIJ.Output
 * @param {Object} obj -
 * @return {YASMIJ.Output}
 */
Output.parse = function (obj) {
	return new Output(obj);
};
/**
 * Checks the results for any errors.
 * @throws Error
 */
Output.prototype.checkForError = function () {
	var errMsg = Output.getErrorMessage(this.result);
	if (errMsg) {
		throw new Error(errMsg);
	}
};
/**
 * Returns the current instance as string.
 * @return {String}
 */
Output.prototype.toString = function () {
	return JSON.stringify(this);
};
YASMIJ.Output = Output;
