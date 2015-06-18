/*
 * @author Larry Battle
 */
tests.runConstraintTests = function () {
	var checkIfSame = function (fn, str, expect) {
		var result = fn(str),
		errMsg = "`" + str + "` failed to match object.";

		if (YASMIJ.areObjectsSame(result, expect)) {
			ok(true);
		} else {
			if (JSON.stringify) {
				equal(JSON.stringify(result), JSON.stringify(expect), errMsg);
			} else {
				ok(false, errMsg + " Note: Use browser with `JSON.stringify` support for more details");
			}
		}
	};
	module("YASMIJ.Constraint Class: Checking input");
	test("test YASMIJ.Constraint.hasManyCompares() with 1 compare", function () {
		var fn = YASMIJ.Constraint.hasManyCompares;
		equal(fn("a < b"), false);
		equal(fn("a > b"), false);
		equal(fn("a = b"), false);

		equal(fn("a >= b"), false);
		equal(fn("a <= b"), false);

		equal(fn("a = < b"), true);
		equal(fn("a => b"), true);
	});
	test("test YASMIJ.Constraint.hasManyCompares() with many compares", function () {
		var fn = YASMIJ.Constraint.hasManyCompares;
		equal(fn("a << b"), true);

		equal(fn("a < < b"), true);
		equal(fn("a >> b"), true);
		equal(fn("a > > b"), true);

		equal(fn("a == b"), true);
		equal(fn("a = = b"), true);
		equal(fn("a >=>= b"), true);

		equal(fn("a <=<= b"), true);
		equal(fn("a > b > c"), true);
		equal(fn("a > b < c"), true);

		equal(fn("a < b < c"), true);
	});
	test("test YASMIJ.Constraint.hasIncompleteBinaryOperator() with valid expressions.", function () {
		var fn = YASMIJ.Constraint.hasIncompleteBinaryOperator;

		equal(fn("+a - b"), false);
		equal(fn("a + b"), false);
		equal(fn("a < b"), false);
		equal(fn("a > b"), false);
		equal(fn("a >= b"), false);
		equal(fn("a = 1"), false);
		equal(fn("a - b + 1 > c + 1e34"), false);
		equal(fn("x     <= 1"), false);
		equal(fn("x <   = 1"), false);
	});
	test("test YASMIJ.Constraint.hasIncompleteBinaryOperator() with invalid expressions.", function () {
		var fn = YASMIJ.Constraint.hasIncompleteBinaryOperator;

		equal(fn("a b"), true);
		equal(fn("a b > c"), true);
		equal(fn("a + b < c d"), true);
		equal(fn("a-"), true);
		equal(fn("a+"), true);
		equal(fn("a+ < c-"), true);
		equal(fn("a+ b -= c"), true);
		equal(fn("a+ b += c"), true);
	});
	test("test that YASMIJ.Constraint.getErrorMessage() ", function () {
		var fn = YASMIJ.Constraint.getErrorMessage;
		ok(!fn("a+b"));
		ok(fn("a b"));
		ok(fn("a * b"));
		ok(fn("a + b+"));
	});
	test("test YASMIJ.Constraint.getErrorMessage() with valid input.", function () {
		var fn = YASMIJ.Constraint.getErrorMessage,
		x;

		equal(fn("a < c"), x);
		equal(fn("a > c"), x);
		equal(fn("a <= c"), x);

		equal(fn("a >= c"), x);
		equal(fn("a = c"), x);
		equal(fn("a < c + 12"), x);

		equal(fn("a - 3 > c"), x);
		equal(fn("12 + 2 <= c"), x);
		equal(fn("2 >= 1"), x);

		equal(fn("13 = 13"), x);
	});
	test("test YASMIJ.Constraint.checkInput() will throw an error when YASMIJ.Constraint.getErrorMessage returns a message.", function () {
		var fn = YASMIJ.Constraint.checkInput,
		args = "error",
		oldFn = YASMIJ.Constraint.getErrorMessage;

		YASMIJ.Constraint.getErrorMessage = function () {
			return args;
		};

		try {
			raises(function () {
				fn();
			});
			args = "";
			ok(!fn());
		} catch (e) {}
		YASMIJ.Constraint.getErrorMessage = oldFn;
	});
	test("test YASMIJ.Constraint.parseToObject() with valid expressions", function () {
		var fn = YASMIJ.Constraint.parseToObject,
		x = fn("10x1 -2x2 - 10");

		var y = {
			rhs : {
				terms : {
					"1" : 0
				}
			},
			lhs : {
				terms : {
					"x1" : 10,
					"x2" : -2,
					"1" : -10
				}
			},
			comparison : "="
		};

		deepEqual(x.rhs.terms, y.rhs.terms);
		deepEqual(x.lhs.terms, y.lhs.terms);
		deepEqual(x.comparison, y.comparison);
	});
	test("test YASMIJ.Constraint.parseToObject() with different compares", function () {
		var fn = YASMIJ.Constraint.parseToObject;

		checkIfSame(fn, "2a + 3b <= 30", {
			lhs : {
				terms : {
					"a" : 2,
					"b" : 3
				}
			},
			rhs : {
				terms : {
					"1" : 30
				}
			},
			comparison : "<="
		});
		checkIfSame(fn, "2a - 30 >= 4 + a2", {
			lhs : {
				terms : {
					"a" : 2,
					"1" : -30
				}
			},
			rhs : {
				terms : {
					"a2" : 1,
					"1" : 4
				}
			},
			comparison : ">="
		});
		checkIfSame(fn, "2a - 30 > 4 + a2", {
			lhs : {
				terms : {
					"a" : 2,
					"1" : -30
				}
			},
			rhs : {
				terms : {
					"a2" : 1,
					"1" : 4
				}
			},
			comparison : ">"
		});
		checkIfSame(fn, "2a - 30 < 4 + a2", {
			lhs : {
				terms : {
					"a" : 2,
					"1" : -30
				}
			},
			rhs : {
				terms : {
					"a2" : 1,
					"1" : 4
				}
			},
			comparison : "<"
		});
		checkIfSame(fn, "2a + 12 = 2a + 12", {
			lhs : {
				terms : {
					"a" : 2,
					"1" : 12
				}
			},
			rhs : {
				terms : {
					"a" : 2,
					"1" : 12
				}
			},
			comparison : "="
		});
	});
	test("test YASMIJ.Constraint.getTermNames()", function () {
		var fn = function (str) {
			return YASMIJ.Constraint.parse(str).getTermNames();
		};
		deepEqual(fn("a"), ["a"]);
		deepEqual(fn("2x1 + x2 + x3 <= 14"), ["x1", "x2", "x3", "14"]);
	});
	test("test YASMIJ.Constraint.getTermNames(true) to execlude numbers", function () {
		var fn = function (str) {
			return YASMIJ.Constraint.parse(str).getTermNames(true);
		};
		deepEqual(fn("a"), ["a"]);
		deepEqual(fn("2x1 + x2 + x3 <= 14"), ["x1", "x2", "x3"]);
	});
	test("test YASMIJ.Constraint.parse()", function () {
		var fn = function (str) {
			return YASMIJ.Constraint.parse(str);
		},
		x = fn("2x1 + x2 + x3 <= 14");

		deepEqual(x.leftSide.toString(), "2x1 + x2 + x3");
		deepEqual(x.rightSide.toString(), "14");
		deepEqual(x.comparison.toString(), "<=");
	});
	test("test YASMIJ.Constraint.prototype.toString()", function () {
		var fn = function (str) {
			return YASMIJ.Constraint.parse(str).toString();
		};
		equal(fn("a+3<=3b"), "a + 3 <= 3b");
		equal(fn("-1.4e+ 4 +23.9e4 + a4 -d3 -3e+49 = 3"), "a4 - d3 - 1.4e - 3e+49 = 3");
	});
	test("test YASMIJ.Constraint.prototype.getSwappedSides()", function () {
		var fn = function (str, side) {
			return YASMIJ.Constraint.parse(str).getSwappedSides(side);
		};
		var checkSwapped = function (str) {
			var obj = YASMIJ.Constraint.parse(str),
			sideObj = fn(str, true);

			equal(obj.leftSide.toString(), sideObj.b.toString(), "checkSwapped(): " + str + ", leftSide(swapped side) should be side.b");
			equal(obj.rightSide.toString(), sideObj.a.toString(), "checkSwapped(): " + str + ", rightSide(swapped side) should be side.a");
		};
		var checkNotSwapped = function (str) {
			var obj = YASMIJ.Constraint.parse(str),
			sideObj = fn(str);

			equal(obj.leftSide.toString(), sideObj.a.toString(), "checkNotSwapped(): " + str + ", leftSide(same side) should be side.a");
			equal(obj.rightSide.toString(), sideObj.b.toString(), "checkNotSwapped(): " + str + ", rightSide(same side) should be side.b");
		};
		var checkBoth = function (str) {
			checkSwapped(str);
			checkNotSwapped(str);
		};
		checkBoth("x = y");
		checkBoth("x + 4 + 2 = y + c + 3c");
	});
	test("test YASMIJ.Constraint.switchSides()", function () {
		var result;
		var fn = function (str, doSwap) {
			var obj = YASMIJ.Constraint.parse(str),
			sides = obj.getSwappedSides(doSwap);

			YASMIJ.Constraint.switchSides(sides.a, sides.b, sides.a.forEachTerm);
			return obj;
		};
		result = fn("x = y");
		equal("0", result.leftSide.toString());
		equal("-x + y", result.rightSide.toString());

		result = fn("x + 4 + 2 = y + c + 3c");
		equal("0", result.leftSide.toString());
		equal("4c - x + y - 6", result.rightSide.toString());
	});
	test("test YASMIJ.Constraint.prototype.moveTypeToOneSide() with different comparisons", function () {
		var fn = function (str, varsSide, constantsSide) {
			return YASMIJ.Constraint.parse(str).moveTypeToOneSide(varsSide, constantsSide).toString();
		};
		equal(fn("a = 30", "right", "left"), "-30 = -a");
		equal(fn("a >= 30", "right", "left"), "-30 >= -a");
		equal(fn("a > 30", "right", "left"), "-30 > -a");
		equal(fn("a < 30", "right", "left"), "-30 < -a");
		equal(fn("a <= 30", "right", "left"), "-30 <= -a");
	});
	test("test YASMIJ.Constraint.prototype.moveTypeToOneSide() with two terms", function () {
		var fn = function (str, varsSide, constantsSide) {
			return YASMIJ.Constraint.parse(str).moveTypeToOneSide(varsSide, constantsSide).toString();
		};
		var str = "a <= 30";
		equal(fn(str, "left", null), "a <= 30");
		equal(fn(str, null, "right"), "a <= 30");
		equal(fn(str, "left", "right"), "a <= 30");

		equal(fn(str, "right", null), "0 <= -a + 30");
		equal(fn(str, null, "left"), "a - 30 <= 0");
		equal(fn(str, "right", "left"), "-30 <= -a");
	});
	test("test YASMIJ.Constraint.prototype.moveTypeToOneSide() with 3+ terms", function () {
		var fn = function (str, varsSide, constantsSide) {
			return YASMIJ.Constraint.parse(str).moveTypeToOneSide(varsSide, constantsSide).toString();
		};
		var str = "a + b + d <= 30 + a + 5b + 2 - c";
		equal(fn(str, "left", null), "-4b + c + d <= 32");
		equal(fn(str, "right", null), "0 <= 4b - c - d + 32");
		equal(fn(str, "left", "right"), "-4b + c + d <= 32");

		equal(fn(str, null, "right"), "a + b + d <= a + 5b - c + 32");
		equal(fn(str, null, "left"), "a + b + d - 32 <= a + 5b - c");
		equal(fn(str, "right", "left"), "-32 <= 4b - c - d");
	});
	test("test YASMIJ.Constraint.prototype.inverse()", function () {
		var fn = function (str) {
			return YASMIJ.Constraint.parse(str).inverse().toString();
		};
		equal(fn("x < 2"), "-x >= -2");
		equal(fn("a + b < 2 - 40c"), "-a - b >= 40c - 2");
		equal(fn("-a <= -2"), "a > 2");
		equal(fn("5a >= 2b"), "-5a < -2b");
		equal(fn("4a + b = 2"), "-4a - b = -2");
	});
	test("test YASMIJ.Constraint.prototype.removeStrictInequality()", function () {
		var fn = function (str) {
			return YASMIJ.Constraint.parse(str).removeStrictInequality().toString();
		};
		equal(fn("x > 0"), "x >= 0.000001");
		equal(fn("x < 0"), "x <= -0.000001");
	});
	test("test YASMIJ.Constraint.prototype.normalize()", function () {
		var fn = function (str) {
			return YASMIJ.Constraint.parse(str).normalize().toString();
		};
		equal(fn("a - 10 <= 20"), "a <= 30");
		equal(fn("-1 + a < 21"), "a <= 21.999999");
		equal(fn("-1 + a > 21"), "a >= 22.000001");
		equal(fn("a + b - 10 >= 0"), "a + b >= 10");
	});
	test("test YASMIJ.Constraint.prototype.setSpecialTerm()", function () {
		var fn = function (str, obj) {
			return YASMIJ.Constraint.parse(str).setSpecialTerm(obj);
		};
		equal(fn("a = 3").toString(), "a = 3", "fails silently if the proper object isn't passed.");
		equal(fn("a = 3", {
				name : "ok",
				key : "ok",
				value : "1"
			}).toString(), "a + ok = 3", "setups a special term");

		var x = fn("a = 3", {
				name : "ok",
				key : "ok",
				value : "1"
			});
		x.setSpecialTerm({
			name : "ok1",
			key : "ok"
		});
		equal(x.toString(), "a + ok1 = 3", "Allows for special terms to be renamed without passing a value");
	});
	test("test YASMIJ.Constraint.prototype.convertToEquation()", function () {
		var fn = function (str) {
			return YASMIJ.Constraint.parse(str).convertToEquation().toString();
		};
		equal(fn("x = 1"), "x = 1");
		equal(fn("x = -1"), "-x = 1");
		equal(fn("x >= 1"), "artifical - slack + x = 1");
		equal(fn("x <= 1"), "slack + x = 1");
		equal(fn("a + 3b < 20"), "a + 3b + slack = 19.999999");
		equal(fn("a - 2b - c + 20 < 4 + 4c"), "-a + artifical + 2b + 5c - slack = 16");
	});
	test("test YASMIJ.Constraint.prototype.getCoefficients()", function () {
		var fn = function (str, arr) {
			return YASMIJ.Constraint.parse(str).getCoefficients(arr);
		};
		deepEqual(fn("5a + 6b = 2", ["a", "b"]), [5, 6]);
		deepEqual(fn("5a + 6b = 2", ["b", "a"]), [6, 5]);
		deepEqual(fn("5a + 6b = 2", ["c", "b", "a"]), [0, 6, 5]);
		deepEqual(fn("5a + 6b = 2c", ["c", "b", "a"]), [2, 6, 5]);
		deepEqual(fn("5a + 6b = 2c + 55", ["c", "b", "a", "1"]), [2, 6, 5, 55]);
	});
	test("test YASMIJ.Constraint.prototype.getTermValuesFromLeftSide", function () {
		var fn = function (str, arr) {
			return YASMIJ.Constraint.parse(str).getTermValuesFromLeftSide(arr);
		};
		deepEqual(fn("5a + 6b = 2", ["a", "b"]), [5, 6]);
		deepEqual(fn("5a + 6b = 2", ["b", "a"]), [6, 5]);
		deepEqual(fn("5a + 6b = 2", ["c", "b", "a"]), [0, 6, 5]);
		deepEqual(fn("5a + 6b = 2c", ["c", "b", "a"]), [-2, 6, 5]);
		deepEqual(fn("5a + 6b = 2c + 55", ["c", "b", "a", "1"]), [-2, 6, 5, -55]);
	});
};
