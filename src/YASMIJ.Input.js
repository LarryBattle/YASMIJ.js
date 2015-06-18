/*
 * @author Larry Battle
 */

var YASMIJ = require('./YASMIJ.base.js');

var Input = function () {
	this.z = null;
	this.type = null;
	this.terms = null;
	this.constraints = null;
	this.isStandardMode = false;
};
// Holds constants
Input.parse = function (type, z, constraints) {
	Input.checkForInputError(type, z, constraints);
	var obj = new Input();
	obj.type = type;
	obj.z = YASMIJ.Expression.parse(z);
	obj.constraints = YASMIJ.Input.getArrOfConstraints(constraints);
	obj.setTermNames();
	obj.checkConstraints();
	return obj;
};
Input.getArrOfConstraints = function (arr) {
	arr = (YASMIJ.Matrix.isArray(arr)) ? arr : [arr];
	var constraints = [],
	i = arr.length;
	while (i--) {
		constraints[i] = YASMIJ.Constraint.parse(arr[i]);
	}
	return constraints;
};
Input.getErrors = function (type, z, constraints) {
	var errMsgs = [];
	if (typeof z !== 'string') {
		errMsgs.push('z must be a string.');
	}
	if (type !== 'maximize' && type !== 'minimize') {
		errMsgs.push('`maximize` and `minimize` are the only types that is currently supported.');
	}
	if (!YASMIJ.Matrix.isArray(constraints) || !constraints.length) {
		errMsgs.push('Constraints must be an array with at least one element.');
	}
	return errMsgs;
};
/**
 * Returns the problem type.
 * @note this function assume all the constraints have
 * variables on the left and constants on the right.
 * @return {String}
 */
Input.prototype.computeType = function () {
	var hasLessThan = this.doAnyConstrainsHaveRelation(/<=?/);
	var hasGreaterThan = this.doAnyConstrainsHaveRelation(/>=?/);

	if (/max/.test(this.type)) {
		return hasGreaterThan ? YASMIJ.CONST.NONSTANDARD_MAX : YASMIJ.CONST.STANDARD_MAX;
	}
	if (/min/.test(this.type)) {
		return hasLessThan ? YASMIJ.CONST.NONSTANDARD_MIN : YASMIJ.CONST.STANDARD_MIN;
	}
};
/**
 * Checks if any constraints the same comparison.
 * @param {String|RegExp} comparison
 * @return {Boolean}
 */
Input.prototype.doAnyConstrainsHaveRelation = function (comparison) {
	if (!comparison) {
		return false;
	}
	comparison = new RegExp(comparison);
	return this.anyConstraints(function (i, constraint) {
		return comparison.test(constraint.comparison);
	});
};
/**
 * Checks if all constraints the same comparison.
 * @param {String|RegExp} comparison
 * @return {Boolean}
 */
Input.prototype.doAllConstrainsHaveRelation = function (comparison) {
	comparison = new RegExp(comparison);
	return this.allConstraints(function (i, constraint) {
		return comparison.test(constraint.comparison);
	});
};
/**
 * Checks if the callback returns a truthy value for any constraints.
 * @param {Function} fn - callback
 * @return {Boolean}
 */
Input.prototype.anyConstraints = function (fn) {
	for (var i = 0, len = this.constraints.length; i < len; i++) {
		if (fn(i, this.constraints[i], this.constraints)) {
			return true;
		}
	}
	return false;
};
/**
 * Checks if the callback returns a truthy value for all constraints.
 * @param {Function} fn - callback
 * @return {Boolean}
 */
Input.prototype.allConstraints = function (fn) {
	var result = true;
	for (var i = 0, len = this.constraints.length; i < len; i++) {
		result = result && !!fn(i, this.constraints[i], this.constraints);
	}
	return result;
};
/**
 * Iterates over a the constraints, executing the callback for each element.
 * @param {Function} fn - callback
 * @return {Boolean}
 */
Input.prototype.forEachConstraint = function (fn) {
	for (var i = 0, len = this.constraints.length; i < len; i++) {
		fn(i, this.constraints[i], this.constraints);
	}
};
Input.prototype.getAllArtificalNames = function () {
	var names = [];
	this.forEachConstraint(function (i, constraint) {
		var name = constraint.getArtificalName();
		if (name) {
			names.push(name);
		}
	});
	return names;
};
Input.prototype.addNumbersToSpecialTerms = function () {
	var c = this.constraints,
	slackI = 1,
	artificalI = 1;
	for (var i = 0, len = c.length; i < len; i++) {
		if (c[i].hasSpecialTerm('slack')) {
			c[i].renameSlack('slack' + slackI);
			slackI++;
		}
		if (c[i].hasSpecialTerm('artifical')) {
			c[i].renameArtificial('artifical' + artificalI);
			artificalI++;
		}
	}
};
/**
 * Returns a list of term names
 * @param {Boolean} onlyVariables - only include variables names, no numbers.
 * @return {Array} list of term names
 */
Input.prototype.getTermNames = function (onlyVariables) {
	var vars = [],
	i = this.constraints.length;
	while (i--) {
		vars = vars.concat(this.constraints[i].getTermNames(onlyVariables));
	}
	return YASMIJ.getUniqueArray(vars).sort();
};
Input.prototype.getAllSpecialTermNames = function () {
	var names = [];
	this.forEachConstraint(function (i, constraint) {
		names = names.concat(
				constraint.getSpecialTermNames());
	});
	return names;
};
Input.prototype.setTermNames = function () {
	this.terms = this.getTermNames();
};
Input.prototype.getZTermNotInAnyOfTheConstraints = function () {
	var varMissing = '',
	terms = this.z.getTermNames(),
	term,
	i = 0,
	iLen = terms.length;

	for (; !varMissing && i < iLen; i++) {
		term = terms[i];
		for (var j = 0, jLen = this.constraints.length; j < jLen; j++) {
			if (this.constraints[j].leftSide.terms[term]) {
				break;
			}
		}
		if (j === jLen) {
			varMissing = term;
		}
	}
	return varMissing;
};
Input.prototype.checkConstraints = function () {
	var errMsg = [],
	missingZVar = this.getZTermNotInAnyOfTheConstraints();
	if (missingZVar) {
		errMsg.push('`' + missingZVar + '`, from the objective function, should appear least once in a constraint.');
	}
	return errMsg;
};
Input.checkForInputError = function (type, z, constraints) {
	var arr = Input.getErrors(type, z, constraints);
	if (arr && arr.length) {
		throw new Error('Input Error: ' + arr.join('\n'));
	}
};
Input.prototype.toString = function () {
	return [this.type + ' z = ' + this.z, 'where ' + this.constraints.join(', ')].join(', ');
};
Input.prototype.convertConstraintsToMaxForm = function () {
	var c = this.constraints;
	for (var i = 0, len = c.length; i < len; i++) {
		c[i] = c[i].convertToEquation();
	}
};
Input.prototype.convertToStandardForm = function () {
	if (this.isStandardMode) {
		return this;
	}
	this.convertConstraintsToMaxForm();
	this.addNumbersToSpecialTerms();
	this.setTermNames();
	this.isStandardMode = true;
	return this;
};
YASMIJ.Input = Input;

