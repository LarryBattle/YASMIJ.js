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
