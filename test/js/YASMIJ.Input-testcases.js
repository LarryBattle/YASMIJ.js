/*
 * @author Larry Battle
 */

tests.runInputTests = function () {
	module("YASMIJ.Input Class");
	test("test YASMIJ.Input.prototype.addNumbersToSpecialTerms", function () {
		var func = function (str, eqs) {
			return YASMIJ.Input.parse("maximize", str, eqs).convertToStandardForm();
		};
		var x = func("x1 + 2x2 - x3", [
					"a < 14",
					"a + b <=28"
				]);
		var c = x.constraints.join(", ");
		equal(/slack1/.test(c), true, "Has a term named slack1");
		equal(/slack2/.test(c), true, "Has a term named slack2");
	});
	test("test YASMIJ.Input.prototype.getZTermNotInAnyOfTheConstraints", function () {
		var func = function (str, eqs) {
			return YASMIJ.Input.parse("maximize", str, eqs).getZTermNotInAnyOfTheConstraints();
		};
		equal(func("a", ["a < 1", "b < 3"]), "");
		equal(func("c + d", ["c < 1", "d < 1"]), "");

		equal(func("a", ["b < 3"]), "a");
		equal(func("c + d", ["c < 1"]), "d");
	});
	test("test YASMIJ.Input.prototype.checkConstraints", function () {
		var func = function (str, eqs) {
			return YASMIJ.Input.parse("maximize", str, eqs).checkConstraints();
		};
		ok(func("a", ["a < 1", "b < 3"]));
		ok(func("c + d", ["d < 1"]));

	});
	test("test YASMIJ.Input.prototype.convertConstraintsToMaxForm", function () {

		var func = function (str) {
			var obj = {
				constraints : [YASMIJ.Constraint.parse(str)]
			};
			YASMIJ.Input.prototype.convertConstraintsToMaxForm.call(obj);
			return obj.constraints[0].toString();
		};
		var testThis = function (str) {
			var x = YASMIJ.Constraint.parse(str).convertToEquation().toString();
			equal(func(str), x);
		};
		testThis("a + b < 4");
	});
	test("test YASMIJ.Input.prototype.convertToStandardForm", function () {
		var func = function (str, eqs) {
			return YASMIJ.Input.parse("maximize", str, eqs);
		};
		var testThis = function (str, eqs) {
			var x = func(str, eqs);
			equal(x.isStandardMode, false);
			x.convertToStandardForm();
			equal(x.isStandardMode, true);
		};
		testThis("a + b", ["a + b < 1"]);
	});
	test("test YASMIJ.Input.prototype.toString()", function () {
		var x = YASMIJ.Input.parse("maximize", "x1 + 2x2 - x3", [
					"2x1+x2+x3 <= 14",
					"4x1+2x2+3x3<=28",
					"2x1+5x2+5x3<=30"
				]);
		var expected = [
			"maximize z = x1 + 2x2 - x3",
			"where 2x1 + x2 + x3 <= 14, 4x1 + 2x2 + 3x3 <= 28, 2x1 + 5x2 + 5x3 <= 30"
		].join(", ");
		equal(x.toString(), expected);
	});
	test("test YASMIJ.Input.prototype.getTermNames()", function () {
		var func = function (str, eqs, onlyVariables) {
			return YASMIJ.Input.parse("maximize", str, eqs).getTermNames(onlyVariables).join(", ");
		};
		equal(func("x1 + 2x2 - x3", [
					"2x1+x2+x3 <= 14",
					"4x1+2x2+3x3<=28",
					"2x1+5x2+5x3<=30"
				]), ["x1", "x2", "x3", "14", "28", "30"].sort().join(", "));

		equal(func("x1 + 2x2 - x3", [
					"2x1+x2+x3 <= 14",
					"4x1+2x2+3x3<=28",
					"2x1+5x2+5x3<=30"
				], true), ["x1", "x2", "x3"].sort().join(", "));
	});
	test("test YASMIJ.Input.parse", function () {
		var x = YASMIJ.Input.parse("maximize", "x1 + 2x2 - x3", [
					"2x1+x2+x3 <= 14",
					"4x1+2x2+3x3<=28",
					"2x1+5x2+5x3<=30"
				]);
		equal(x.type, "maximize");
		equal(x.z.toString(), "x1 + 2x2 - x3");
		equal(x.constraints.length, 3);
		deepEqual(x.terms.join(", "), "14, 28, 30, x1, x2, x3");
	});
	test("test YASMIJ.Input.prototype.doAnyConstrainsHaveRelation()", function () {
		var fn = function (arr, comparison) {
			var x = YASMIJ.Input.parse("maximize", "x1 + 2x2 - x3", arr);
			return x.doAnyConstrainsHaveRelation(comparison);
		};
		equal(fn([
					"a < 14",
					"a + b < 28"
				], /^<$/), true);
		equal(fn([
					"a > 14",
					"a + b > 28"
				], /^>$/), true);
		equal(fn([
					"a > 14",
					"a + b >= 28"
				], /^>=$/), true);

		equal(fn([
					"a < 14",
					"a + b <= 28"
				], /^>$/), false);
		equal(fn([
					"a > 14",
					"a + b >= 28"
				], /^<=$/), false);
	});
	test("test YASMIJ.Input.prototype.doAllConstrainsHaveRelation()", function () {
		var fn = function (arr, comparison) {
			var x = YASMIJ.Input.parse("maximize", "x1 + 2x2 - x3", arr);
			return x.doAllConstrainsHaveRelation(comparison);
		};
		equal(fn([
					"a < 14",
					"a + b < 28"
				], /^<$/), true);
		equal(fn([
					"a < 14",
					"a + b <= 28"
				], /^<$/), false);

		equal(fn([
					"a > 14",
					"a + b > 28"
				], /^>$/), true);
		equal(fn([
					"a > 14",
					"a + b >= 28"
				], /^>$/), false);
	});
	test("test YASMIJ.Input.prototype.computeType() with (non)standard max", function () {
		var t = YASMIJ.CONST;
		var fn = function (type, arr) {
			var x = YASMIJ.Input.parse(type, "a + 2b - c", arr);
			return x.computeType();
		};
		// standard
		equal(fn("maximize", [
					"a <= 14",
					"a + b <= 28"
				]), t.STANDARD_MAX);
		equal(fn("maximize", [
					"a <= 14",
					"a + b < 28"
				]), t.STANDARD_MAX);
		equal(fn("maximize", [
					"a < 14",
					"a + b < 28"
				]), t.STANDARD_MAX);

		// non-standard
		equal(fn("maximize", [
					"a > 14",
					"a + b < 28"
				]), t.NONSTANDARD_MAX);
		equal(fn("maximize", [
					"a <= 14",
					"a + b > 28"
				]), t.NONSTANDARD_MAX);
	});
	test("test YASMIJ.Input.prototype.computeType() with (non)standard min", function () {
		var t = YASMIJ.CONST;
		var fn = function (type, arr) {
			var x = YASMIJ.Input.parse(type, "a + 2b - c", arr);
			return x.computeType();
		};
		equal(fn("minimize", [
					"a >= 14",
					"a + b >= 28"
				]), t.STANDARD_MIN);
		equal(fn("minimize", [
					"a >= 14",
					"a + b > 28"
				]), t.STANDARD_MIN);
		equal(fn("minimize", [
					"a > 14",
					"a + b > 28"
				]), t.STANDARD_MIN);

		equal(fn("minimize", [
					"a > 14",
					"a + b < 28"
				]), t.NONSTANDARD_MIN);
		equal(fn("minimize", [
					"a <= 14",
					"a + b > 28"
				]), t.NONSTANDARD_MIN);
	});
	test("test YASMIJ.Input.prototype.getAllArtificalNames()", function () {
		var fn = function (arr) {
			return YASMIJ.Input.parse("maximize", "a+b", arr).convertToStandardForm().getAllArtificalNames();
		};
		deepEqual(fn(["a >= 2"]), ["artifical1"]);
		deepEqual(fn(["a >= 2", "b >= 2"]), ["artifical1", "artifical2"]);
	});
};
