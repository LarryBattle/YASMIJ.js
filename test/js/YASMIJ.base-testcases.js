/*
 * @author Larry Battle
 */

tests.runBaseTests = function () {
	module("YASMIJ.base Class");

	test("test YASMIJ.CONST", function () {
		var x = YASMIJ.CONST;
		ok(x);
		ok(x.STANDARD_MAX);
		ok(x.STANDARD_MIN);
		ok(x.NONSTANDARD_MAX);
		ok(x.NONSTANDARD_MIN);
	});
	test("test YASMIJ.solve() with maximization", function () {
		var fn = function (input) {
			return (YASMIJ.solve(input) || {}).result;
		}
		// Problem taken from `http://www.ms.uky.edu/~rwalker/Class%20Work%20Solutions/class%20work%208%20solutions.pdf`
		var input = {
			"type" : "maximize",
			"objective" : "3x + 4y",
			"constraints" : [
				"x + y <= 4",
				"2x + y <= 5"
			]
		};
		deepEqual(fn(input), {
			"slack1" : 0,
			"slack2" : 1,
			"x" : 0,
			"y" : 4,
			"z" : 16
		});
	});
	// remove when maximization is fully implemented.
	return;

	test("test YASMIJ.solve() with non-standard maximization", function () {
		var fn = function (input) {
			return (YASMIJ.solve(input) || {}).result;
		}
		// Problem taken from `http://people.hofstra.edu/stefan_waner/realworld/tutorialsf4/frames4_4.html`
		var input = {
			"type" : "maximize",
			"objective" : "-2x - y - 2z1",
			"constraints" : [
				"2x + 4y + z1 >= 80",
				"x + 5y + z1 <= 100 ",
				"x + 2y + z1 >= 50 "
			]
		}
		deepEqual(fn(input), {
			"slack1" : 0,
			"slack2" : 0,
			"slack3" : 0,
			"x" : 0,
			"y" : 50 / 3,
			"z" : 50 / 3,
			"z" : -50
		});
	});
	test("test YASMIJ.solve() with non-standard minimization", function () {
		var fn = function (input) {
			return (YASMIJ.solve(input) || {}).result;
		}
		// Problem taken from `http://www.ms.uky.edu/~rwalker/Class%20Work%20Solutions/class%20work%208%20solutions.pdf`
		var input = {
			"type" : "minimize",
			"objective" : "-2x + y",
			"constraints" : [
				"x + 2y <= 6",
				"3x + 2y <= 12"
			]
		};
		// @todo Check if the expected value is correct.
		deepEqual(fn(input), {
			"slack1" : 2,
			"slack2" : 0,
			"x" : 4,
			"y" : 0,
			"z" : -8
		}, "Minimiization isn't implemented. Not sure if this example is correct");
	});
	test("test YASMIJ.solve() with standard minimization", function () {
		var fn = function (input) {
			return (YASMIJ.solve(input) || {}).result;
		}
		// Problem taken from `http://www.ms.uky.edu/~rwalker/Class%20Work%20Solutions/class%20work%208%20solutions.pdf`
		var input = {
			"type" : "minimize",
			"objective" : "2x + 5y",
			"constraints" : [
				"x + 2y >= 4",
				"3x + 2y >= 3"
			]
		};
		// @todo Check if the expected value is correct.
		deepEqual(fn(input), {
			"slack1" : 2,
			"slack2" : 0,
			"x" : 4,
			"y" : 0,
			"z" : 8
		}, "Minimiization isn't implemented. Not sure if this example is correct");
	});
	test("test YASMIJ.convertArrayValuesToHashMap()", function () {
		var fn = YASMIJ.convertArrayValuesToHashMap;
		deepEqual(fn(), {});
		deepEqual(fn([]), {});

		deepEqual(fn([1]), {
			1 : 1
		});
		deepEqual(fn([1, 2]), {
			1 : 1,
			2 : 1
		});
		deepEqual(fn(["a", "b"]), {
			a : 1,
			b : 1
		});
	});
	test("test YASMIJ.sortArrayWithSubsetAtEnd()", function () {
		var fn = YASMIJ.sortArrayWithSubsetAtEnd;
		deepEqual(fn(), []);
		deepEqual(fn([], []), []);

		deepEqual(fn([1, 2, 3], [5, 6]), [1, 2, 3, 5, 6]);
		deepEqual(fn([1, 2, 3, 4, 5, 6], [2, 3]), [1, 4, 5, 6, 2, 3]);
		deepEqual(fn(["a", "b", "c", "d", "e"], ["a", "b"]), ["c", "d", "e", "a", "b"]);
	});
};
