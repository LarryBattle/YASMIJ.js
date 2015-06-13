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
