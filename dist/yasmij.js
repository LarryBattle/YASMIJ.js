(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.YASMIJ = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
var YASMIJ = require('./src/YASMIJ.base.js');
require('./src/YASMIJ.Expression.js');
require('./src/YASMIJ.Constraint.js');
require('./src/YASMIJ.Input.js');
require('./src/YASMIJ.Matrix.js');
require('./src/YASMIJ.Tableau.js');
require('./src/YASMIJ.Output.js');
require('./src/YASMIJ.Simplex.js');
module.exports = YASMIJ;

},{"./src/YASMIJ.Constraint.js":2,"./src/YASMIJ.Expression.js":3,"./src/YASMIJ.Input.js":4,"./src/YASMIJ.Matrix.js":5,"./src/YASMIJ.Output.js":6,"./src/YASMIJ.Simplex.js":7,"./src/YASMIJ.Tableau.js":8,"./src/YASMIJ.base.js":9}],2:[function(require,module,exports){
/**
 * @author Larry Battle
 */

var YASMIJ = require('./YASMIJ.base.js');
/**
 * Create an Constraint Object.
 * Goals for the Constraint Object:
 * - Convert String to Object such that the terms, constants and sign and be easily accessed.
 * - Allow for terms to be moved from one side to the other.
 * - The standard will be (variables, ...) (comparison) (constants)
 * @constructor
 * @chainable
 * @returns {Constraint}
 */
var Constraint = function () {
	this.comparison = '';
	this.leftSide = {};
	this.rightSide = {};
	this.specialTerms = {};
	return this;
};
/**
 * Used to convert strict inequalities to non-strict.
 */
Constraint.EPSILON = 1e-6;
/**
 * Checks to see if an object equals the current instance of Constraint.
 * @param {Object} obj -
 * @return {Boolean}
 */
Constraint.equals = function (obj) {
	return YASMIJ.areObjectsSame(this, obj);
};
/**
 * Checks to see if a string has more than one of these symbols; '>', '<', '>=', '<=', '='.
 * @param {String} str
 * @returns {Boolean}
 * @example Constraint.hasManyCompares( 'a < b < c' ) == true;
 */
Constraint.hasManyCompares = function (str) {
	var RE_compares = /[<>]=?|=/g;
	var matches = ('' + str).replace(/\s/g, '').match(RE_compares) || [];
	return 1 < matches.length;
};
/**
 * Checks to see if a string doesn't have a left and right terms with each addition and subtraction operation.
 * @param {String} str
 * @returns {Boolean}
 * @example Constraint.hasIncompleteBinaryOperator( 'a + b +' ) == true;
 */
Constraint.hasIncompleteBinaryOperator = function (str) {
	str = str.replace(/\s{2,}/g, '');
	var noSpaceStr = ('' + str).replace(/\s/g, ''),
	hasNoOperatorBetweenValues = /[^+\-><=]\s+[^+\-><=]/.test(('' + str)),
	RE_noLeftAndRightTerms = /[+\-][><=+\-]|[><=+\-]$/;

	return RE_noLeftAndRightTerms.test(noSpaceStr) || hasNoOperatorBetweenValues;
};
/**
 * Checks to see if string comply with standards.
 * @param {String} str
 * @returns {String} Error message
 * @example Constraint.getErrorMessage( 'a + b' ) == null;
 */
Constraint.getErrorMessage = function (str) {
	var errMsg;
	if (Constraint.hasManyCompares(str)) {
		errMsg = 'Only 1 comparision (<,>,=, >=, <=) is allow in a Constraint.';
	}
	if (!errMsg && Constraint.hasIncompleteBinaryOperator(str)) {
		errMsg = 'Math operators must be in between terms. Good:(a+b=c). Bad:(a b+=c)';
	}
	return errMsg;
};
/**
 * Checks to see if string doesn't comply with standards.
 * @param {String} str
 * @throws Error
 * @example Constraint.checkInput( 'a / b' ); // throws Error();
 */
Constraint.checkInput = function (str) {
	var errMsg = Constraint.getErrorMessage(str);
	if (errMsg) {
		throw new Error(errMsg);
	}
};
/**
 * For all the term types in sideA, move them over to sideB using the provided function.
 * @param {YASMIJ.Expression} sideA -
 * @param {YASMIJ.Expression} sideB -
 * @param {Function} forEachTermFunc - callback
 */
Constraint.switchSides = function (sideA, sideB, forEachTermFunc) {
	forEachTermFunc.call(sideA, function (name, value) {
		sideB.addTerm(name, -value);
		sideA.removeTerm(name);
	});
};
/**
 * Returns an array of variables without the coefficients.
 * @param {Boolean} excludeNumbers - only include variables in the result
 * @returns {Array}
 * @example Constraint.parse('a = cats + 30').getTermNames(); // returns ['a', 'cats', '30' ]
 */
Constraint.prototype.getTermNames = function (excludeNumbers) {
	var arr = [].concat(this.leftSide.getTermNames(excludeNumbers), this.rightSide.getTermNames(excludeNumbers));
	return YASMIJ.getUniqueArray(arr);
};
/**
 * Converts a string to an Constraint object literal.
 * @todo Join this with `YASMIJ.Constraint.parse()`
 * @param {String} str -
 * @returns {Object}
 */
Constraint.parseToObject = function (str) {
	str = str.replace(/([><])(\s+)(=)/g, '$1$3');
	Constraint.checkInput(str);
	var RE_comparison = /[><]=?|=/;
	var arr = ('' + str).split(RE_comparison);
	var obj = {
		rhs : YASMIJ.Expression.parse('0'),
		comparison : '='
	};
	obj.lhs = YASMIJ.Expression.parse(arr[0]);
	if (1 < arr.length) {
		obj.rhs = YASMIJ.Expression.parse(arr[1]);
		obj.comparison = '' + RE_comparison.exec(str);
	}
	return obj;
};
/**
 * Converts a string to an Constraint Object.
 * @param {String}
 * @returns {Constraint}
 */
Constraint.parse = function (str) {
	var obj = Constraint.parseToObject(str),
	e;
	if (obj) {
		e = new Constraint();
		e.comparison = obj.comparison;
		e.leftSide = obj.lhs;
		e.rightSide = obj.rhs;
	}
	return e;
};
/**
 * Returns a string representation of the Constraint Object.
 * @return {String}
 */
Constraint.prototype.toString = function () {
	return [this.leftSide, this.comparison, this.rightSide].join(' ');
};
/**
 * Return an object that represents the sides left to right or vice versa.
 * @param {String} side - `left` or `right`
 * @returns {Object} sides
 * @see Constraint.prototype.switchSides
 */
Constraint.prototype.getSwappedSides = function (doSwap) {
	return {
		a : (!doSwap ? this.leftSide : this.rightSide),
		b : (doSwap ? this.leftSide : this.rightSide)
	};
};
/**
 * Designates which side the variables and numbers should be located at.
 * @param {String} varSide - `left` or `right` side
 * @param {String} numSide - `left` or `right` side
 * @returns {YASMIJ.Constraint} - self
 * @chainable
 * @example
 */
Constraint.prototype.moveTypeToOneSide = function (varSide, numSide) {
	var varSides,
	numSides;

	if (/left|right/.test(varSide)) {
		varSides = this.getSwappedSides(/left/.test(varSide));
		Constraint.switchSides(varSides.a, varSides.b, varSides.a.forEachVariable);
	}
	if (/left|right/.test(numSide)) {
		numSides = this.getSwappedSides(/left/.test(numSide));
		Constraint.switchSides(numSides.a, numSides.b, numSides.a.forEachConstant);
	}
	return this;
};
/**
 * Multiplies the constraint by -1
 * @returns {YASMIJ.Constraint} - self
 * @chainable
 * @example
 */
Constraint.prototype.inverse = function () {
	// @todo moves to outside to constants on the YASMIJ.Constraint.CONST
	var oppositeCompare = {
		'=' : '=',
		'>=' : '<',
		'>' : '<=',
		'<=' : '>',
		'<' : '>='
	};
	if (oppositeCompare[this.comparison]) {
		this.comparison = oppositeCompare[this.comparison];
		this.leftSide.inverse();
		this.rightSide.inverse();
	}
	return this;
};
/**
 * Changes the strict relationship from '<' or '>' to '<=' and '>=' correspondingly.
 * @returns {YASMIJ.Constraint} - self
 * @chainable
 */
Constraint.prototype.removeStrictInequality = function () {
	var eps;
	if (/^[<>]$/.test(this.comparison)) {
		eps = Constraint.EPSILON * ('>' === this.comparison ? 1 : -1);
		this.rightSide.addTerm('1', eps);
		this.comparison += '=';
	}
	return this;
};
/**
 * Places the constants on the right and the variables on the left hand side.
 * @returns {YASMIJ.Constraint} - self
 * @chainable
 */
Constraint.prototype.normalize = function () {
	this.moveTypeToOneSide('left', 'right');
	if (this.rightSide.getTermValue('1') < 0) {
		this.inverse();
	}
	return this.removeStrictInequality();
};
/**
 * Adds a new slack variable to the constraint.
 * Note: A constraint can only contain one slack variable.
 * @param {Number} val - value of slack
 * @returns {YASMIJ.Constraint} - self
 * @chainable
 * @example
 */
Constraint.prototype.addSlack = function (val) {
	this.setSpecialTerm({
		key : 'slack',
		name : 'slack',
		value : val
	});
	return this;
};
/**
 * Sets the value of a special term to the left side of constraint and on the constraint object itself.
 * @param {Object} obj - object must have `name`, `key` and `value` as properties.
 * @return {YASMIJ.Constraint} - self
 * @chainable
 */
Constraint.prototype.setSpecialTerm = function (obj) {
	if (!obj || typeof obj !== 'object' || !obj.name || !obj.key) {
		return this;
	}
	this.specialTerms[obj.key] = this.specialTerms[obj.key] || {};
	var oldName = this.specialTerms[obj.key].name;
	if (oldName) {
		if (typeof obj.value === 'undefined') {
			// get old value
			obj.value = this.leftSide.getTermValue(oldName);
		}
		// remove old value
		this.leftSide.removeTerm(oldName);
	}
	this.specialTerms[obj.key].name = obj.name;
	this.leftSide.setTerm(this.specialTerms[obj.key].name, +obj.value);
	return this;
};
/**
 * Adds a new artifical variable to the constraint.
 * Note: A constraint can only contain one artifical variable.
 * @param {Number} val - value
 * @returns {YASMIJ.Constraint} - self
 * @chainable
 * @example
 */
Constraint.prototype.addArtificalVariable = function (val) {
	this.setSpecialTerm({
		key : 'artifical',
		name : 'artifical',
		value : val
	});
	return this;
};
/**
 * Returns if a special term
 * @param {String} name - name of the special term
 * @return {Boolean}
 */
Constraint.prototype.hasSpecialTerm = function (name) {
	return !!this.specialTerms[name];
};
/**
 * Renames the slack variable
 * @param {String} name - new name
 * @return {YASMIJ.Constraint} - self
 * @chainable
 */
Constraint.prototype.renameSlack = function (name) {
	this.setSpecialTerm({
		key : 'slack',
		name : name
	});
	return this;
};
/**
 * Renames the artifical variable
 * @param {String} name - new name
 * @return {YASMIJ.Constraint} - self
 * @chainable
 */
Constraint.prototype.renameArtificial = function (name) {
	this.setSpecialTerm({
		key : 'artifical',
		name : name
	});
	return this;
};
/**
 * Converts a constraint to standard maximization form
 * @return {YASMIJ.Constraint} self
 * @chainable
 */
Constraint.prototype.convertToEquation = function () {
	this.normalize();
	switch (this.comparison) {
	case '<=':
		this.addSlack(1);
		break;
	case '>=':
		this.addSlack(-1);
		this.addArtificalVariable(1);
		break;
	}
	this.comparison = '=';
	return this;
};
/**
 * Returns
 * @return {Array}
 */
Constraint.prototype.getSpecialTermNames = function () {
	var names = [];

	for (var prop in this.specialTerms) {
		if (this.specialTerms.hasOwnProperty(prop) && this.specialTerms[prop]) {
			names.push(this.specialTerms[prop].name);
		}
	}
	return names.length ? names : null;
};
Constraint.prototype.getSpecialTermValue = function (name) {
	var obj = this.specialTerms[name];
	if (!obj) {
		return null;
	}
	return this.getCoefficients([obj.name])[0];
};
Constraint.prototype.getArtificalName = function () {
	var obj = this.specialTerms.artifical;
	if (!obj) {
		return null;
	}
	return obj.name;
};
/**
 * Multiplies the left and right side of a constraint by a factor
 * @param {Number} factor -
 * @return {YASMIJ.Constraint} self
 * @chainable
 */
Constraint.prototype.scale = function (factor) {
	this.leftSide.scale(factor);
	this.rightSide.scale(factor);
	return this;
};
/**
 * Moves a variable to the left or right side of a comparison
 * @param {String} name - variable name
 * @param {String} moveTo - `left` or `right` side
 * @return {YASMIJ.Constraint} self
 * @chainable
 */
Constraint.prototype.varSwitchSide = function (name, moveTo) {
	if (!/left|right/.test(moveTo)) {
		return this;
	}
	name = (isNaN(name)) ? name : '1';
	var sideA = ('left' === moveTo) ? this.rightSide : this.leftSide,
	sideB = ('left' !== moveTo) ? this.rightSide : this.leftSide;

	if (sideA.hasTerm(name)) {
		sideB.addTerm(name, -sideA.getTermValue(name));
		sideA.removeTerm(name);
	}
	return this;
};
/**
 * Returns an list of coeffients of terms.
 * @param {Array} termNames - names of terms
 * @return {Array} - Array of numbers
 */
Constraint.prototype.getCoefficients = function (termNames) {
	if (!termNames) {
		return null;
	}
	var arr = new Array(termNames.length),
	val,
	i = arr.length;
	// Note: a term should only be on one side after normilized.
	while (i--) {
		val = this.leftSide.getTermValue(termNames[i]);
		if (val === undefined) {
			val = this.rightSide.getTermValue(termNames[i]);
		}
		arr[i] = val || 0;
	}
	return arr;
};
/**
 * Returns an list of coeffients of terms from the left side.
 * Note: The terms should only be on one side after normilized.
 * @param {Array} termNames - names of terms
 * @return {Array} - Array of numbers
 */
Constraint.prototype.getTermValuesFromLeftSide = function (termNames) {
	if (!termNames) {
		return null;
	}
	var arr = new Array(termNames.length),
	val,
	i = arr.length;
	while (i--) {
		val = this.leftSide.getTermValue(termNames[i]);
		if (val === undefined) {
			val = -this.rightSide.getTermValue(termNames[i]);
		}
		arr[i] = val || 0;
	}
	return arr;
};
YASMIJ.Constraint = Constraint;

},{"./YASMIJ.base.js":9}],3:[function(require,module,exports){
/**
 * @author Larry Battle
 */

var YASMIJ = require('./YASMIJ.base.js');
/**
 * Goals for the Expression Object:
 * - Convert String to Object such that the terms, constants and sign and be easily accessed.
 * @constructor
 * @returns {Expression}
 */
var Expression = function () {
	this.terms = {};
};
/**
 * Converts a string to a Expression Object.
 * @returns {Expression}
 */
Expression.parse = function (str) {
	var obj = new Expression();
	if (typeof str !== 'string' || !str.length) {
		return obj;
	}
	Expression.checkString(str);
	str = Expression.addSpaceBetweenTerms(str);
	obj.terms = Expression.convertExpressionToObject(str);
	return obj;
};
/**
 * Converts scientific notated values to special characters.
 * This is needed so the `e` and power aren't treated as a varible.
 * @param {String} str - linear algebraic expression
 * @returns {String}
 * @example
 */
Expression.encodeE = function (str) {
	str = (str || '').toString();
	str = str.replace(/(\de)([+])(\d)/gi, '$1_plus_$3');
	str = str.replace(/(\de)([\-])(\d)/gi, '$1_sub_$3');
	return str;
};
/**
 * Converts special characters for scientific notated values back to original.
 * @param {String} str - linear algebraic expression
 * @returns {String}
 * @example
 */
Expression.decodeE = function (str) {
	str = (str || '').toString();
	str = str.replace(/_plus_/g, '+');
	str = str.replace(/_sub_/g, '-');
	return str;
};
/**
 * Checks to see if a string has more than one of these symbols; '>', '<', '>=', '<=', '='.
 * @param {String} str
 * @returns {Boolean}
 * @example Expression.hasManyCompares( 'a < b < c' ) == true;
 */
Expression.hasManyCompares = function (str) {
	var RE_compares = /[<>]=?|=/g;
	var matches = ('' + str).replace(/\s/g, '').match(RE_compares) || [];
	return 1 < matches.length;
};
/**
 * Adds spaces in between terms
 * @param {String} str - linear algebraic expression
 * @returns {String}
 * @example
 */
Expression.addSpaceBetweenTerms = function (str) {
	str = Expression.encodeE(str);
	str = str.replace(/([\+\-])/g, ' $1 ');
	str = str.replace(/\s{2,}/g, ' ');
	str = str.trim();
	str = Expression.decodeE(str);
	return str;
};
/**
 * Checks to see if a string has any of the these symbols; '*', '\', '%'.
 *
 * @param {String} str
 * @returns {Boolean}
 * @example Expression.hasExcludedOperations( 'a * b + c' ) == true;
 */
Expression.hasExcludedOperations = function (str) {
	return (/[\*\/%]/).test(str);
};
/**
 * Checks to see if a string doesn't have a left and right terms with each addition and subtraction operation.
 *
 * @param {String} str
 * @returns {Boolean}
 * @example Expression.hasIncompleteBinaryOperator( 'a + b +' ) == true;
 */
Expression.hasIncompleteBinaryOperator = function (str) {
	var hasError,
	noSpaceStr = ('' + str).replace(/\s/g, ''),
	RE_hasNoPlusOrMinus = /^[^\+\-]+$/,
	RE_noLeftAndRightTerms = /[\+\-]{2}|[\+\-]$/,
	hasMoreThanOneTerm = /\S+\s+\S+/.test(str);
	hasError = hasMoreThanOneTerm && RE_hasNoPlusOrMinus.test(noSpaceStr);
	hasError = hasError || RE_noLeftAndRightTerms.test(noSpaceStr);
	return hasError;
};
/**
 * Checks to see if string has a comparison.
 *
 * @param {String} str
 * @returns {Boolean}
 * @example Expression.hasComparison( 'a = b' ) == true;
 */
Expression.hasComparison = function (str) {
	return (/[><=]/).test(str);
};
/**
 * Checks to see if string comply with standards.
 *
 * @param {String} str
 * @returns {String} Error message
 * @example Expression.getErrorMessage( 'a + b' ) == null;
 */
Expression.getErrorMessage = function (str) {
	var errMsg;
	if (Expression.hasComparison(str)) {
		errMsg = 'Comparison are not allowed within an expression.';
	}
	if (!errMsg && Expression.hasExcludedOperations(str)) {
		errMsg = 'Addition and subtraction are only supported.';
	}
	if (!errMsg && Expression.hasIncompleteBinaryOperator(str)) {
		errMsg = 'Exactly one math operators must be between terms.\n Good:(a+b). Bad:(a++ b+).';
	}
	if (errMsg) {
		errMsg += '\n Input: `' + str + '`';
	}
	return errMsg;
};
/**
 * Checks to see if string doesn't comply with standards.
 *
 * @param {String} str
 * @throws Error
 * @example Expression.checkString( 'a / b' ); // throws Error();
 */
Expression.checkString = function (str) {
	var errMsg = Expression.getErrorMessage(str);
	if (errMsg) {
		throw new Error(errMsg);
	}
};
/**
 * Extracts coeffient and variable name from a variable.
 *
 * @param {String} str
 * @example Expression.extractComponentsFromVariable( '10cows' ); //returns [10, 'cows']
 * @returns {Array[ Number, String ]}
 */
Expression.extractComponentsFromVariable = function (str) {
	str = '' + str;
	var re = /^[\+\-]?\d+(\.\d+)?(e[\+\-]?\d+)?/i;
	var coeff = '' + (str.match(re) || [''])[0];
	var term = str.replace(re, '') || '1';
	if (+str === 0) {
		coeff = 0;
	}
	if (coeff === '') {
		coeff = /^\-/.test(term) ? -1 : 1;
		term = term.replace(/^[\+\-]/, '');
	}
	return [+coeff, term];
};
/**
 * Split string by terms.
 *
 * @param {String} str
 * @returns {String[]}
 * @example Expression.splitStrByTerms( '-a + 32c' ); //returns [ '-a', '32c']
 */
Expression.splitStrByTerms = function (str) {
	var RE_findSignForTerm = /([\+\-])\s+/g;
	var RE_spaceOrPlus = /\s+[\+]?/;
	return ('' + str).replace(/^\s*\+/, '').replace(RE_findSignForTerm, '$1').split(RE_spaceOrPlus);
};
/**
 * Converts an linear algebraic expression into an object.
 *
 * @param {String} str
 * @returns {Object}
 * @example Expression.convertExpressionToObject( '13 + 3a -2b +5b -3 + 0b' ); //returns {a:3,b:3,1:10}
 */
Expression.convertExpressionToObject = function (str) {
	var term,
	obj = {},
	matches = Expression.splitStrByTerms((str || '').trim()),
	i = matches.length;
	while (i--) {
		term = Expression.extractComponentsFromVariable(matches[i]);
		if (!term[0]) {
			term = [0, 1];
		}
		obj[term[1]] = (obj[term[1]]) ? (obj[term[1]]) + term[0] : term[0];
	}
	return obj;
};
/**
 * Returns the proper string representation for a term.
 *
 * @param {Number} i - position of term in expression from left to right
 * @param {String} name - name of the term
 * @param {Number} value - value of the term
 * @see Expression.prototype.toString
 * @return {String}
 * @example
YASMIJ.Expression.termAtIndex(0, 'a') === 'a'
YASMIJ.Expression.termAtIndex(0, 'a', 1) === 'a'
YASMIJ.Expression.termAtIndex(0, 'a', -1) === '-a'
YASMIJ.Expression.termAtIndex(0, 'a', -12) === '-12a'
YASMIJ.Expression.termAtIndex(0, 'a', 12) === '12a'
YASMIJ.Expression.termAtIndex(2, 'a', 12) === '+12a'
 */
Expression.termAtIndex = function (i, name, value) {
	var result = '';
	if (value) {
		if (value < 0) {
			result += value == -1 ? '-' : value;
		} else {
			if (i) {
				result += '+';
			}
			result += value == 1 ? '' : value;
		}
		result += name;
	} else {
		result += 0 < name && i ? '+' : '';
		result += name;
	}
	return result;
};
/**
 * Returns an array of alphanumeric sorted variables without the coefficients.
 *
 * @param {Boolean} excludeNumbers -
 * @param {Boolean} excludeSlack -
 * @returns {Array}
 * @example Expression.parse( 'a + 2cats + 30' ).getTermNames(); // returns ['a', 'cats', '30' ]
 */
Expression.prototype.getTermNames = function (excludeNumbers, excludeSlack) {
	var obj = this.terms,
	terms = [],
	key,
	RE_slack = /^slack\d*$/i;
	for (key in obj) {
		if (!obj.hasOwnProperty(key) || (excludeSlack && RE_slack.test(key))) {
			continue;
		}
		if (isNaN(key)) {
			terms.push(key);
		}
	}
	terms = terms.sort();
	if (!excludeNumbers && obj && obj[1]) {
		terms.push(obj[1].toString());
	}
	return terms;
};
/**
 * Iterates through each term in the expression.
 * Each call passes the 'term name', 'term value', and 'term object holder'
 * @param {Function} fn - callback
 * @example
 */
Expression.prototype.forEachTerm = function (fn) {
	if (typeof fn !== 'function') {
		return;
	}
	for (var prop in this.terms) {
		if (this.terms.hasOwnProperty(prop)) {
			fn(prop, this.terms[prop], this.terms);
		}
	}
};
/**
 * Iterates through each constant in the expression.
 * Each call passes the 'term name', 'term value', and 'term object holder'
 * @param {Function} fn - callback
 * @example
 */
Expression.prototype.forEachConstant = function (fn) {
	if (typeof fn !== 'function') {
		return;
	}
	var prop = '1';
	if (this.terms[prop]) {
		fn(prop, this.terms[prop], this.terms);
	}
};
/**
 * Iterates through each varaible in the expression.
 * Each call passes the 'term name', 'term value', and 'term object holder'
 * @param {Function} fn - callback
 * @example
 */
Expression.prototype.forEachVariable = function (fn) {
	if (typeof fn !== 'function') {
		return;
	}
	for (var prop in this.terms) {
		if (this.terms.hasOwnProperty(prop) && prop !== '1') {
			fn(prop, this.terms[prop], this.terms);
		}
	}
};
/**
 * Convers the Expression object a string by turning the terms property to a expression.
 * @returns {String}
 */
Expression.prototype.toString = function () {
	var arr = [],
	names = this.getTermNames(),
	i,
	name,
	len,
	func = Expression.termAtIndex;

	if (!names.length) {
		return '0';
	}
	for (i = 0, len = names.length; i < len; i++) {
		name = names[i];
		arr.push(func(i, name, this.terms[name]));
	}
	return arr.join(' ').replace(/\s[\+\-]/g, '$& ');
};
/**
 * Multiplies the expression by -1
 * @returns {YASMIJ.Expression} - self
 * @example
 */
Expression.prototype.inverse = function () {
	this.forEachTerm(function (termName, value, terms) {
		terms[termName] = -value;
	});
	return this;
};
/**
 * Adds a new term to the expression.
 * @param {String} name - name of term
 * @param {Number} val - value of term
 * @returns {YASMIJ.Expression} - self
 */
Expression.prototype.addTerm = function (name, value) {
	if(typeof value !== 'undefined'){
		value += this.terms[name] || 0;
		if (value) {
			this.terms[name] = value;
		} else {
			this.removeTerm(name);
		}
	}else{
		this.addExpression(name);
	}
	return this;
};
/**
 * Updates the value of a term
 * @param {String} name - name of term
 * @param {Number} val - value of term
 * @returns {YASMIJ.Expression} - self
 */
Expression.prototype.setTerm = function (name, value) {
	if (value) {
		this.terms[name] = value;
	} else {
		this.removeTerm(name);
	}
	return this;
};
/**
 * Adds an expression to the current expression
 * @param {YASMIJ.Expression|String} obj - YASMIJ.Expression or string representing an expression
 * @return {YASMIJ.Expression} - self
 */
Expression.prototype.addExpression = function (obj) {
	if (!(obj instanceof Expression)) {
		obj = Expression.parse(obj);
	}
	this.addTerms(obj.toTermValueArray());
	return this;
};
/**
 * @return {Array} - array of String[]
 */
Expression.prototype.toTermValueArray = function () {
	var arr = [];
	for (var name in this.terms) {
		if (this.terms.hasOwnProperty(name)) {
			arr.push([name, this.terms[name]]);
		}
	}
	return arr;
};
/**
 * Add multiple terms to the expression
 * @param {Array} arr - array of an array of names and values. Ex. `[[name, value],...]`
 * @return {YASMIJ.Expression} - self
 */
Expression.prototype.addTerms = function (arr) {
	if (!arr || typeof arr !== 'object') {
		return this;
	}
	for (var i = 0, len = arr.length; i < len; i++) {
		if (arr[i] && typeof arr[i] === 'object') {
			this.addTerm(arr[i][0], arr[i][1]);
		}
	}
	return this;
};
/**
 * Removes a term from the expression.
 * @param {String} name - name of term
 * @returns {YASMIJ.Expression} - self
 * @example
 */
Expression.prototype.removeTerm = function (name) {
	delete this.terms[name];
	return this;
};
/**
 * Multiples all terms by a factor
 * @param {String} factor - factor
 * @returns {YASMIJ.Expression} - self
 * @example
 */
Expression.prototype.scale = function (factor) {
	factor = +factor;
	this.forEachTerm(function (name, value, terms) {
		terms[name] = (factor * value);
	});
	return this;
};
/**
 * Checks if a term exist within an expression.
 * @param {String} name - name of term
 * @returns {Boolean}
 * @example
 */
Expression.prototype.hasTerm = function (name) {
	return !!this.terms[name];
};
/**
 * Returns the value of a term
 * @note undefined is returned if the term doesn't exist.
 * @param {String} name - name of term
 * @returns {Number}
 * @example
 */
Expression.prototype.getTermValue = function (name) {
	return this.terms[name];
};
/**
 * Returns a list of coeffients for each term
 * @param {Boolean} excludeNumbers - do not include numbers/constants
 * @param {Boolean} excludeSlack - do not include slack variables
 * @returns {Array}
 * @example
 */
Expression.prototype.getAllCoeffients = function (excludeNumbers, excludeSlack) {
	var arr = [];
	var names = this.getTermNames(excludeNumbers, excludeSlack);
	for (var i = 0, len = names.length; i < len; i++) {
		arr.push( + (this.terms[names[i]] || names[i]));
	}
	return arr;
};
/**
 *
 * @param {Array} termNames - list of term names
 * @returns {Array}
 * @example
 */
Expression.prototype.getCoefficients = function (termNames) {
	var arr = [],
	i = termNames.length;
	while (i--) {
		arr[i] = this.terms[termNames[i]] || 0;
	}
	return arr;
};
/**
* Returns a copy of the expression.
* @return {YASMIJ.Expression}
*/
Expression.prototype.clone = function(){
	return Expression.parse( this.toString() );
};
YASMIJ.Expression = Expression;

},{"./YASMIJ.base.js":9}],4:[function(require,module,exports){
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


},{"./YASMIJ.base.js":9}],5:[function(require,module,exports){
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

},{"./YASMIJ.base.js":9}],6:[function(require,module,exports){
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

},{"./YASMIJ.base.js":9}],7:[function(require,module,exports){
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

},{"./YASMIJ.base.js":9}],8:[function(require,module,exports){
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

},{"./YASMIJ.base.js":9}],9:[function(require,module,exports){
/*
 * @project YASMIJ.js, 'Yet another simplex method implementation in Javascript'
 * @author Larry Battle
 * @license MIT License <http://www.opensource.org/licenses/mit-license>
 */
// Removes spaces before and after a string.
// Singleton to everything
var _YASMIJ;
String.prototype.trim = String.prototype.trim || function () {
    return (this || '').replace(/^\s+|\s+$/g, '');
};

if (!JSON) {
    return 'JSON is required. Please update your browser or JS engine.';
}

module.exports = _YASMIJ || (function() {
    var YASMIJ = {};
    // Holds the constants
    YASMIJ.CONST = {
    	STANDARD_MAX : 'standardMax',
    	STANDARD_MIN : 'standardMin',
    	NONSTANDARD_MIN : 'nonstandardMin',
    	NONSTANDARD_MAX : 'nonstandardMax'
    };
    /**
     * Returns an unique array.
     * @param {Array} arr - array of primitive types(booleans, numbers, strings).
     * @return Array
     */
    YASMIJ.getUniqueArray = function (arr) {
    	var result = [],
    	hash = {};
    	if (typeof arr !== 'object' || !arr.length) {
    		return result;
    	}
    	for (var i = 0, len = arr.length; i < len; i++) {
    		if (!hash[arr[i]]) {
    			result.push(arr[i]);
    			hash[arr[i]] = 1;
    		}
    	}
    	return result;
    };
    /**
     * Returns the elements of an array as the keys for a hash object.
     * @param {Array} arr -
     * @return {Object}
     */
    YASMIJ.convertArrayValuesToHashMap = function (arr) {
    	if (!arr || typeof arr !== 'object') {
    		return {};
    	}
    	var obj = {};
    	for (var i = 0, len = arr.length; i < len; i++) {
    		obj[arr[i]] = 1;
    	}
    	return obj;
    };
    /**
     * Returns a sorted array, where the elements in a subset are sorted and grouped towards the end of the array.
     * @param {Array} arr - the main array that contains elements from `subset`
     * @param {Array} subset - an array whose elements are contained within `arr`
     * @return {Array}
     * @example
    YASMIJ.sortArrayWithSubsetAtEnd(['a','1','b','2'],['1','2']); // returns ['a', 'b', '1', '2']
     */
    YASMIJ.sortArrayWithSubsetAtEnd = function (arr, subset) {
    	if (!arr || typeof arr !== 'object' || !subset || typeof subset !== 'object') {
    		return [];
    	}
    	var list = [];
    	var hash = YASMIJ.convertArrayValuesToHashMap(subset);
    	for (var i = 0, len = arr.length; i < len; i++) {
    		if (!hash[arr[i]]) {
    			list.push(arr[i]);
    		}
    	}
    	return list.sort().concat(subset.sort());
    };

    /**
     * Checks to see if two objects are identical.
     * @param {Object} obj1 -
     * @param {Object} obj2 -
     * @return {Boolean}
     */
    YASMIJ.areObjectsSame = function (obj1, obj2) {
    	var a,
    	b;
    	if (obj1 === obj2) {
    		return true;
    	}
    	if (!(obj1 instanceof obj2.constructor)) {
    		return false;
    	}
    	for (var prop in obj1) {
    		if (!obj1.hasOwnProperty(prop)) {
    			continue;
    		}
    		a = obj1[prop];
    		b = obj2[prop];
    		if (typeof a === 'object') {
    			if (typeof a !== typeof b) {
    				return false;
    			}
    			if (!YASMIJ.areObjectsSame(a, b)) {
    				return false;
    			}
    		} else {
    			if (a.toString() !== b.toString()) {
    				return false;
    			}
    		}
    	}
    	return true;
    };
    /**
     * Sovles a Linear Programming Problem, LPP
     * @param {Object} input - description of the LPP
     * @return {YASMIJ.Output}
     */
    YASMIJ.solve = function (input) {
    	return YASMIJ.Simplex.solve(input);
    };
    _YASMIJ = YASMIJ; // set singleton
    return YASMIJ;
})();

},{}]},{},[1])(1)
});