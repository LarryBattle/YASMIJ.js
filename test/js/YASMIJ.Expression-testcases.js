/*
 * @author Larry Battle
 */
tests.runExpressionTests = function () {
	module("YASMIJ.Expression Class: Checking input");
	test("test YASMIJ.Expression.hasComparison() with 1 compare", function () {
		var fn = YASMIJ.Expression.hasComparison;
		equal(fn("a < b"), true);
		equal(fn("a > b"), true);
		equal(fn("a = b"), true);
		equal(fn("a => b"), true);
		equal(fn("a << b"), true);
	});
	test("test YASMIJ.Expression.hasExcludedOperations() with valid YASMIJ.Expressions.", function () {
		var fn = YASMIJ.Expression.hasExcludedOperations;

		equal(fn(""), false);
		equal(fn("-a"), false);
		equal(fn("+a"), false);
		equal(fn("+a - b"), false);
		equal(fn("a + b"), false);
	});
	test("test YASMIJ.Expression.hasExcludedOperations() with invalid YASMIJ.Expressions.", function () {
		var fn = YASMIJ.Expression.hasExcludedOperations;

		equal(fn("a * b"), true);
		equal(fn("a / b + c"), true);
		equal(fn("a % b"), true);
	});
	test("test YASMIJ.Expression.hasIncompleteBinaryOperator() with valid YASMIJ.Expressions.", function () {
		var fn = YASMIJ.Expression.hasIncompleteBinaryOperator;

		equal(fn(""), false);
		equal(fn("-1"), false);
		equal(fn("1"), false);
		equal(fn("+1"), false);
		equal(fn("+1003"), false);
		equal(fn(" +13.23 "), false);
		equal(fn("-a"), false);
		equal(fn("+a"), false);
		equal(fn("a"), false);
		equal(fn("+a - b"), false);
		equal(fn("a + b"), false);
	});
	test("test YASMIJ.Expression.hasIncompleteBinaryOperator() with invalid YASMIJ.Expressions.", function () {
		var fn = YASMIJ.Expression.hasIncompleteBinaryOperator;

		equal(fn("a b"), true);
		equal(fn("a b-"), true);
		equal(fn("a b+"), true);
		equal(fn("++a b"), true);
		equal(fn("+a+"), true);
	});
	test("test that YASMIJ.Expression.getErrorMessage() ", function () {
		var fn = YASMIJ.Expression.getErrorMessage;
		ok(!fn("a+b"));
		ok(fn("a b"));
		ok(fn("a * b"));
		ok(fn("a + b+"));
	});
	module("YASMIJ.Expression Class: input conversion");
	test("test YASMIJ.Expression.extractComponentsFromVariable() with positive terms", function () {
		var fn = YASMIJ.Expression.extractComponentsFromVariable;

		deepEqual(fn(""), [0, "1"]);
		deepEqual(fn("0"), [0, "1"]);
		deepEqual(fn("1"), [1, "1"]);
		deepEqual(fn("110"), [110, "1"]);

		deepEqual(fn("0a"), [0, "a"]);
		deepEqual(fn("a"), [1, "a"]);
		deepEqual(fn("1a2"), [1, "a2"]);
		deepEqual(fn("143a2"), [143, "a2"]);
		deepEqual(fn("var"), [1, "var"]);

		deepEqual(fn("4.4var"), [4.4, "var"]);
		deepEqual(fn("1.23e-32var"), [1.23e-32, "var"]);
		deepEqual(fn("1.23e32var"), [1.23e32, "var"]);

		deepEqual(fn("1.23e+32var"), [1.23e32, "var"]);
	});
	test("test YASMIJ.Expression.extractComponentsFromVariable() with negative terms", function () {
		var fn = YASMIJ.Expression.extractComponentsFromVariable;

		deepEqual(fn("-0"), [0, "1"]);
		deepEqual(fn("-1"), [-1, "1"]);
		deepEqual(fn("-110"), [-110, "1"]);
		deepEqual(fn("-a"), [-1, "a"]);
		deepEqual(fn("-1a2"), [-1, "a2"]);
		deepEqual(fn("-143a2"), [-143, "a2"]);
		deepEqual(fn("-var"), [-1, "var"]);

		deepEqual(fn("-4.4var"), [-4.4, "var"]);
		deepEqual(fn("-1.23e-32var"), [-1.23e-32, "var"]);
		deepEqual(fn("-1.23e32var"), [-1.23e32, "var"]);

		deepEqual(fn("-1.23e+32var"), [-1.23e32, "var"]);
	});
	test("test YASMIJ.Expression.extractComponentsFromVariable() with positive 'e' terms", function () {
		var fn = YASMIJ.Expression.extractComponentsFromVariable;

		deepEqual(fn("e"), [1, "e"]);
		deepEqual(fn("1e"), [1, "e"]);
		deepEqual(fn("23e"), [23, "e"]);

		deepEqual(fn("4.4e"), [4.4, "e"]);
		deepEqual(fn("1.23e-32e"), [1.23e-32, "e"]);
		deepEqual(fn("1.23e32e"), [1.23e32, "e"]);

		deepEqual(fn("1.23e+32e"), [1.23e32, "e"]);
	});
	test("test YASMIJ.Expression.extractComponentsFromVariable() with negative 'e' terms", function () {
		var fn = YASMIJ.Expression.extractComponentsFromVariable;

		deepEqual(fn("-e"), [-1, "e"]);
		deepEqual(fn("-1e"), [-1, "e"]);
		deepEqual(fn("-44e"), [-44, "e"]);

		deepEqual(fn("-4.4e"), [-4.4, "e"]);
		deepEqual(fn("-1.23e-32e"), [-1.23e-32, "e"]);
		deepEqual(fn("-1.23e32e"), [-1.23e32, "e"]);

		deepEqual(fn("-1.23e+32e"), [-1.23e32, "e"]);
	});
	test("test YASMIJ.Expression.splitStrByTerms() with positive terms", function () {
		var fn = YASMIJ.Expression.splitStrByTerms;

		deepEqual(fn("a"), ["a"]);
		deepEqual(fn("+a + b + c"), ["a", "b", "c"]);
		deepEqual(fn("3a + 34b + 2.3c + 1.3e23d"), ["3a", "34b", "2.3c", "1.3e23d"]);
		deepEqual(fn("3e3a + 1e+34b + 2.3e+30c + 1.3e+23d"), ["3e3a", "1e+34b", "2.3e+30c", "1.3e+23d"]);
		deepEqual(fn("3e-3a + 1e-34b + 2.3e-30c + 1.3e-23d"), ["3e-3a", "1e-34b", "2.3e-30c", "1.3e-23d"]);
	});
	test("test YASMIJ.Expression.splitStrByTerms() with negative terms", function () {
		var fn = YASMIJ.Expression.splitStrByTerms;

		deepEqual(fn("-a"), ["-a"]);
		deepEqual(fn("-a - b -c"), ["-a", "-b", "-c"]);
		deepEqual(fn("-3a -34b -2.3c -1.3e23d"), ["-3a", "-34b", "-2.3c", "-1.3e23d"]);
		deepEqual(fn("-3e3a -1e+34b -2.3e+30c -1.3e+23d"), ["-3e3a", "-1e+34b", "-2.3e+30c", "-1.3e+23d"]);
		deepEqual(fn("-3e-3a -1e-34b -2.3e-30c -1.3e-23d"), ["-3e-3a", "-1e-34b", "-2.3e-30c", "-1.3e-23d"]);
	});
	test("test YASMIJ.Expression.splitStrByTerms() with numbers", function () {
		var fn = YASMIJ.Expression.splitStrByTerms;

		deepEqual(fn("-a + b -c +d"), ["-a", "b", "-c", "d"]);
	});
	test("test YASMIJ.Expression.convertExpressionToObject() with valid input", function () {
		var fn = YASMIJ.Expression.convertExpressionToObject;

		deepEqual(fn("a + 20b + 10"), {
			"1" : 10,
			"b" : 20,
			"a" : 1
		});
		deepEqual(fn("a + b -c + 4e"), {
			"e" : 4,
			"c" : -1,
			"b" : 1,
			"a" : 1
		});
		deepEqual(fn("-a - 1b -20c - 1.23e43d -1e-13e"), {
			"e" : -1e-13,
			"d" : -1.23e+43,
			"c" : -20,
			"b" : -1,
			"a" : -1
		});
		deepEqual(fn("+a + 1b +20c + 1.23e43d +1e-13e"), {
			"e" : 1e-13,
			"d" : 1.23e+43,
			"c" : 20,
			"b" : 1,
			"a" : 1
		});
	});
	test("test YASMIJ.Expression.convertExpressionToObject() for single number", function () {
		var fn = YASMIJ.Expression.convertExpressionToObject;
		deepEqual(fn(""), {
			1 : 0
		});
		deepEqual(fn("1"), {
			1 : 1
		});
		deepEqual(fn("-20"), {
			1 : -20
		});
		deepEqual(fn("-423.12345"), {
			1 : -423.12345
		});
		deepEqual(fn("-1.23e-34"), {
			1 : -1.23e-34
		});
	});
	test("test YASMIJ.Expression.convertExpressionToObject() for single variables", function () {
		var fn = YASMIJ.Expression.convertExpressionToObject;
		deepEqual(fn("0x"), {
			1 : 0
		});

		deepEqual(fn("x"), {
			x : 1
		});
		deepEqual(fn("-x"), {
			x : -1
		});
		deepEqual(fn("+x"), {
			x : 1
		});
		deepEqual(fn("1x"), {
			x : 1
		});
		deepEqual(fn("-1x"), {
			x : -1
		});
		deepEqual(fn("-2x"), {
			x : -2
		});
		deepEqual(fn("-20.2x"), {
			x : -20.2
		});
		deepEqual(fn("-20.000042x"), {
			x : -20.000042
		});
		deepEqual(fn("-20e34x"), {
			x : -20e34
		});
		deepEqual(fn("-1.23e-34x"), {
			x : -1.23e-34
		});
	});

	test("test YASMIJ.Expression.convertExpressionToObject() for numbers and variables", function () {
		var fn = YASMIJ.Expression.convertExpressionToObject;
		deepEqual(fn("1 + x"), {
			x : 1,
			1 : 1
		});
		deepEqual(fn("x + 1"), {
			x : 1,
			1 : 1
		});
		deepEqual(fn("-x - 1"), {
			x : -1,
			1 : -1
		});
		deepEqual(fn("-1 -x"), {
			x : -1,
			1 : -1
		});
		deepEqual(fn("-20.2x + 2.4y +10e30"), {
			x : -20.2,
			y : 2.4,
			1 : 10e30
		});
		deepEqual(fn("-20e34x + 23 - 4 - 4x + 1"), {
			x : -2e+35,
			1 : 20
		});
	});
	test("test YASMIJ.Expression.encodeE", function () {
		var fn = YASMIJ.Expression.encodeE;
		equal(fn("-1e+4-1.1e+4"), "-1e_plus_4-1.1e_plus_4");
		equal(fn("1e-4+1.1e-4"), "1e_sub_4+1.1e_sub_4");

		equal(fn("1e -4+1.1e-4"), "1e -4+1.1e_sub_4");
		equal(fn("1e-4+ 1.1e-4"), "1e_sub_4+ 1.1e_sub_4");
	});
	test("test YASMIJ.Expression.addSpaceBetweenTerms() with terms without spaces", function () {
		var fn = YASMIJ.Expression.addSpaceBetweenTerms;

		equal(fn("1"), "1");
		equal(fn("1-a"), "1 - a");
		equal(fn("1+a"), "1 + a");
		equal(fn("a+b"), "a + b");
		equal(fn("a+1e3+e5"), "a + 1e3 + e5");
		equal(fn("-1e-4+e4+a4-d3"), "- 1e-4 + e4 + a4 - d3");
		equal(fn("-1.4e+4+23.9e4+a4-d3-3e+49"), "- 1.4e+4 + 23.9e4 + a4 - d3 - 3e+49");
	});
	test("test YASMIJ.Expression.addSpaceBetweenTerms() with terms with spaces", function () {
		var fn = YASMIJ.Expression.addSpaceBetweenTerms;

		equal(fn(" 1 "), "1");
		equal(fn(" 1 - a "), "1 - a");
		equal(fn("  1 + a  "), "1 + a");
		equal(fn(" a +    b "), "a + b");
		equal(fn("  1e + 5 "), "1e + 5");
		equal(fn("  a + 1e3+e5"), "a + 1e3 + e5");
		equal(fn(" - 1e-4   + e4+a4-d3"), "- 1e-4 + e4 + a4 - d3");
		equal(fn("-1.4e+ 4 +23.9e4+a4 -d3    -3e+49"), "- 1.4e + 4 + 23.9e4 + a4 - d3 - 3e+49");
	});
	test("test YASMIJ.Expression.getErrorMessage() with invalid input", function () {
		var fn = YASMIJ.Expression.getErrorMessage;

		ok(fn("a < b < c"), "Error because there can only be one comparison.");
		ok(fn("a == b"), "Error because == is not supported.");
		ok(fn("a += b"), "Error because += is not supported.");

		ok(fn("a <= b * -1"), "Error because * is not supported.");
	});
	test("test YASMIJ.Expression.parse() with valid YASMIJ.Expressions", function () {
		var fn = function (str) {
			return YASMIJ.Expression.parse(str).terms;
		};
		deepEqual(fn("10x1 -2x2 - 10"), {
			"x1" : 10,
			"x2" : -2,
			"1" : -10
		});
	});
	test("test the YASMIJ.Expression constructor", function () {
		var a = new YASMIJ.Expression();
		ok(a.terms);
	});
	test("test YASMIJ.Expression.prototype.getTermNames()", function () {
		var fn = function (str) {
			return YASMIJ.Expression.parse(str).getTermNames();
		};
		deepEqual(fn("10e-4x1"), ["x1"]);
		deepEqual(fn("10x1 -2x2 - 10"), ["x1", "x2", "-10"]);
		deepEqual(fn("a + b -c - 10"), ["a", "b", "c", "-10"]);
	});
	test("test YASMIJ.Expression.prototype.getTermNames(true) to exclude numbers", function () {
		var fn = function (str) {
			return YASMIJ.Expression.parse(str).getTermNames(true);
		};
		deepEqual(fn("10e-4x1"), ["x1"]);
		deepEqual(fn("10x1 -2x2 - 10"), ["x1", "x2"]);
		deepEqual(fn("a + b -c - 10"), ["a", "b", "c"]);
	});
	test("test YASMIJ.Expression.termAtIndex() with variables", function () {
		var fn = YASMIJ.Expression.termAtIndex;
		equal(fn(0, "a", 1), "a");
		equal(fn(0, "a", 3), "3a");
		equal(fn(2, "a", 1), "+a");
		equal(fn(2, "a", 2), "+2a");
		equal(fn(4, "a", 40), "+40a");

		equal(fn(0, "a", -1), "-a");
		equal(fn(2, "a", -3), "-3a");
		equal(fn(2, "a", -2), "-2a");
		equal(fn(4, "a", -40), "-40a");
	});
	test("test YASMIJ.Expression.termAtIndex() with constants", function () {
		var fn = YASMIJ.Expression.termAtIndex;
		equal(fn(0, 10), "10");
		equal(fn(0, -10), "-10");
		equal(fn(2, 10), "+10");
		equal(fn(4, -10), "-10");
	});
	test("test YASMIJ.Expression.prototype.toString()", function () {
		var fn = function (str) {
			return YASMIJ.Expression.parse(str).toString();
		};
		equal(fn("-a + 10"), "-a + 10");
		equal(fn("a + 10"), "a + 10");
		equal(fn("a -b + 10"), "a - b + 10");
		equal(fn("4c + c4"), "4c + c4");
	});
	test("test YASMIJ.Expression.prototype.inverse()", function () {
		var fn = function (str) {
			return YASMIJ.Expression.parse(str).inverse().toString();
		};
		equal(fn("-a + 10"), "a - 10");
		equal(fn("a + 10"), "-a - 10");
		equal(fn("a -b + 10"), "-a + b - 10");
		equal(fn("4c + c4"), "-4c - c4");
	});
	test("test YASMIJ.Expression.prototype.addTerm()", function () {
		var fn = function (str, name, value) {
			return YASMIJ.Expression.parse(str).addTerm(name, value).toString();
		};
		equal(fn("a", "a"), "2a");
		equal(fn("a", "a", 1), "2a");
		equal(fn("a", "a", -1), "0");
		equal(fn("a", "b", 1), "a + b");

		equal(fn("a", "a", 3), "4a");
		equal(fn("a", "b", 4), "a + 4b");
		equal(fn("a + b", "b", -4), "a - 3b");
	});
	test("test YASMIJ.Expression.prototype.addTerms()", function () {
		var fn = function (str, arr) {
			return YASMIJ.Expression.parse(str).addTerms(arr).toString();
		};
		equal(fn("a", [["b", 1]]), "a + b");
		equal(fn("a", [["a", 1], ["b", 1], ["b", 1]]), "2a + 2b");
		equal(fn("a", [["b", 4]]), "a + 4b");
	});
	test("test YASMIJ.Expression.prototype.removeTerm()", function () {
		var fn = function (str, name) {
			return YASMIJ.Expression.parse(str).removeTerm(name).toString();
		};
		equal(fn("a - 1", "a"), "-1");
		equal(fn("a - 1", 1), "a");
		equal(fn("a - 1", "b"), "a - 1");
	});
	test("test YASMIJ.Expression.prototype.addExpression() with string expressions", function () {
		var fn = function (a, b) {
			return YASMIJ.Expression.parse(a).addExpression(b).toString();
		};
		equal(fn(), "0");
		equal(fn(null, "0"), "0");
		equal(fn("1", "-1"), "0");
		equal(fn("1", "-1"), "0");
		equal(fn("a + 1", "-a - 1"), "0");

		equal(fn("a + 1", "a - 1"), "2a");
		equal(fn("a", "b + c + d -d"), "a + b + c");
	});
	test("test YASMIJ.Expression.prototype.addExpression() with YASMIJ.Expression objects", function () {
		var fn = function (a, b) {
			return YASMIJ.Expression.parse(a).addExpression(YASMIJ.Expression.parse(b)).toString();
		};
		equal(fn(), "0");
		equal(fn(null, "0"), "0");
		equal(fn("1", "-1"), "0");
		equal(fn("1", "-1"), "0");
		equal(fn("a + 1", "-a - 1"), "0");

		equal(fn("a + 1", "a - 1"), "2a");
		equal(fn("a", "b + c + d -d"), "a + b + c");
	});
	test("test YASMIJ.Expression.prototype.forEachTerm", function () {
		var fn = function (str, fn) {
			return YASMIJ.Expression.parse(str).forEachTerm(fn);
		};
		var arr = [];
		fn("a + 10 - c", function (name) {
			arr.push(name);
		});
		equal(3, arr.length);
	});
	test("test YASMIJ.Expression.prototype.forEachVariable", function () {
		var fn = function (str, fn) {
			return YASMIJ.Expression.parse(str).forEachVariable(fn);
		};
		var arr = [];
		fn("a + 10 - c", function (name) {
			arr.push(name);
		});
		equal(2, arr.length);
	});
	test("test YASMIJ.Expression.prototype.forEachConstant", function () {
		var fn = function (str, fn) {
			return YASMIJ.Expression.parse(str).forEachConstant(fn);
		};
		var arr = [];
		fn("a + 10 - c", function (name) {
			arr.push(name);
		});
		equal(1, arr.length);
	});
	test("test YASMIJ.Expression.prototype.getAllCoeffients()", function () {
		var fn = function (str, excludeNumbers, excludeSlack) {
			return YASMIJ.Expression.parse(str).getAllCoeffients(excludeNumbers, excludeSlack);
		};
		deepEqual(fn("a + b + slack + 10"), [1, 1, 1, 10]);
		deepEqual(fn("a + b + slack + 10", true), [1, 1, 1]);
		deepEqual(fn("a + b + slack + 10", true, true), [1, 1]);
	});
	test("test YASMIJ.Expression.prototype.getCoefficients()", function () {
		var fn = function (str, termNames) {
			return YASMIJ.Expression.parse(str).getCoefficients(termNames);
		};
		deepEqual(fn("a + b + 5", ["a"]), [1]);
		deepEqual(fn("a + b + 5", ["b", "a"]), [1, 1]);
		deepEqual(fn("a + b + 5", ["f", "a", "b", "1"]), [0, 1, 1, 5]);
	});
	test("test YASMIJ.Expression.prototype.clone()", function(){
		var a = YASMIJ.Expression.parse("a + b");
		var b = a.clone();

		equal( a.toString(), b.toString() );
		a.addTerm("c");

		notEqual( a.toString(), b.toString() );
	});
};
