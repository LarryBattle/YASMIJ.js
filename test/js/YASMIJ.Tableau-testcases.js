/*
 * @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
 * @author Larry Battle
 * @license MIT License <http://www.opensource.org/licenses/mit-license>
 */

tests.runTableauTests = function () {
	module("YASMIJ.Tableau Class");

	test("test YASMIJ.Tableau.getErrorMessage()", function () {
		var func = function (obj) {
			return YASMIJ.Tableau.getErrorMessage(obj);
		};
		var inputObj = YASMIJ.Input.parse("maximize", "a + b - 10", ["a<34", "b <= 4", "a + b > 2"]);
		ok(func("12"));
		ok(func({
				a : 1
			}));
		ok(!func(inputObj));
	});
	test("test YASMIJ.Tableau.parse()", function () {
		var inputObj = YASMIJ.Input.parse("maximize", "a + b", ["a<34", "b <= 4", "a + b > 2"]);
		var func = function (inputObj) {
			return YASMIJ.Tableau.parse(inputObj).toString();
		};

		var result = "[a,b,artifical1,slack1,slack2,slack3,Constant],";
		result += "[[1,0,0,1,0,0,33.999999],[0,1,0,0,1,0,4],[1,1,1,0,0,-1,2.000001],[-1,-1,0,0,0,0,0]]";
		equal(func(inputObj), result);

		inputObj = YASMIJ.Input.parse("maximize", "8x1 + 10x2 + 7x3", ["x1 + 3x2 + 2x3 <= 10", "x1 + 5x2 + x3 <= 8"]);
		result = "[x1,x2,x3,slack1,slack2,Constant],[[1,3,2,1,0,10],[1,5,1,0,1,8],[-8,-10,-7,0,0,0]]";
		equal(func(inputObj), result);

		inputObj = YASMIJ.Input.parse("maximize", "8x1 + 10x2 + 7x3 + 2", ["x1 + 3x2 + 2x3 <= 10", "x1 + 5x2 + x3 <= 8"]);
		result = "[x1,x2,x3,slack1,slack2,Constant],[[1,3,2,1,0,10],[1,5,1,0,1,8],[-8,-10,-7,0,0,2]]";
		equal(func(inputObj), result);
	});
	test("test YASMIJ.Tableau.prototype.getPivotPoint()", function () {
		var func = function (arr) {
			return YASMIJ.Tableau.getPivotPoint(YASMIJ.Matrix.parse(arr));
		};
		equal(func(""), null);
		equal(func([1, 2, 3]), null);
		equal(func([[1, 2, 3], [1, 2, 3]]), null);
		equal(func([[1, 2, -3], [1, 2, 3]]), null);
		deepEqual(func([[1, 2, 3], [-1, 2, 3]]), {
			row : 0,
			column : 0
		});
		deepEqual(func([[1, 3, 2, 10], [1, 5, 1, 8], [-8, -10, -7, 0]]), {
			row : 1,
			column : 1
		});
	});
};
