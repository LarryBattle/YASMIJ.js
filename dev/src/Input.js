/*
 * @project {{=it.name}}
 * @author Larry Battle
 * @license {{=it.license.overview}}
 * @date 07/02/2012
 */
var Input = function () {
	this.z = null;
	this.type = null;
	this.terms = null;
	this.constraints = null;
	this.isStandardMode = false;
};
Input.parse = function (type, z, constraints) {
	Input.checkForInputError(type, z, constraints);
	var obj = new Input();
	obj.type = type;
	obj.z = Expression.parse(z);
	obj.constraints = Input.getArrOfConstraints(constraints);
	obj.setTermNames();
	obj.checkConstraints();
	return obj;
};
Input.getArrOfConstraints = function (arr) {
	arr = (Matrix.isArray(arr)) ? arr : [arr];
	var constraints = [],
	i = arr.length;
	while (i--) {
		constraints[i] = Constraint.parse(arr[i]);
	}
	return constraints;
};
Input.getErrors = function (type, z, constraints) {
	var errMsgs = [];
	if (typeof z !== "string") {
		errMsgs.push("z must be a string.");
	}
	if (type !== "maximize" && type !== "minimize") {
		errMsgs.push("`maximize` and `minimize` are the only types that is currently supported.");
	}
	if (!Matrix.isArray(constraints) || !constraints.length) {
		errMsgs.push("Constraints must be an array with at least one element.");
	}
	return errMsgs;
};
Input.prototype.forEachConstraint = function (fn) {
	for (var i = 0, len = this.constraints.length; i < len; i++) {
		fn(i, this.constraints[i], this.constraints);
	}
};
Input.prototype.addNumbersToSlacks = function () {
	var c = this.constraints,
	slackI = 1;
	for (var i = 0, len = c.length; i < len; i++) {
		if (c[i].slack) {
			c[i].updateSlack("slack" + slackI);
			slackI++;
		}
	}
};
Input.prototype.getTermNames = function (onlyVariables) {
	var vars = [],
	i = this.constraints.length;
	while (i--) {
		vars = vars.concat(this.constraints[i].getTermNames(onlyVariables));
	}
	return mixin.getUniqueArray(vars).sort();
};
Input.prototype.setTermNames = function () {
	this.terms = this.getTermNames();
};
Input.prototype.getZTermNotInAnyOfTheConstraints = function () {
	var varMissing = "",
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
		errMsg.push("`" + missingZVar + "`, from the objective function, should appear least once in a constraint.");
	}
	return errMsg;
};
Input.checkForInputError = function (type, z, constraints) {
	var arr = Input.getErrors(type, z, constraints);
	if (arr && arr.length) {
		throw new Error("Input Error: " + arr.join('\n'));
	}
};
Input.prototype.toString = function () {
	return [this.type + " z = " + this.z, "where " + this.constraints.join(", ")].join(", ");
};
Input.prototype.convertConstraintsToMaxForm = function () {
	var c = this.constraints;
	for (var i = 0, len = c.length; i < len; i++) {
		c[i] = c[i].convertToStandardMaxForm();
	}
};
Input.prototype.convertToStandardForm = function () {
	if (this.isStandardMode) {
		return this;
	}
	if (/min/.test(this.type)) {
		this.z = this.z.inverse();
	}
	this.convertConstraintsToMaxForm();
	this.addNumbersToSlacks();
	this.setTermNames();
	this.isStandardMode = true;
	return this;
};
