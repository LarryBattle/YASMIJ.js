/*
 * @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
 * @author Larry Battle
 * @license MIT License <http://www.opensource.org/licenses/mit-license>
 */

tests.runMatrixTests = function () {
	module("YASMIJ.Matrix Class");
	test("test YASMIJ.Matrix.inverseArray()", function () {
		var fn = function (arr) {
			return YASMIJ.Matrix.inverseArray(arr);
		};
		deepEqual(fn([1, 2, 3]), [-1, -2, -3]);
	});
	test("test YASMIJ.Matrix.parse()", function () {
		var fn = function (obj) {
			return YASMIJ.Matrix.parse(obj).toString();
		};
		equal(fn(1), "[[1]]");
		equal(fn([1, 2, 3]), "[[1,2,3]]");
		equal(fn([[1, 2, 3], [1, 2, 3]]), "[[1,2,3],[1,2,3]]");
	});
	test("test YASMIJ.Matrix.isArray()", function () {
		var fn = YASMIJ.Matrix.isArray;
		equal(fn([]), true);
		equal(fn([[]]), true);
		equal(fn({}), false);
		equal(fn(Math), false);
		equal(fn(false), false);
	});
	test("test YASMIJ.Matrix.getGreatestElementInRow()", function () {
		var fn = function (a, b, c) {
			return YASMIJ.Matrix.getGreatestElementInRow(a, b, c);
		};
		deepEqual(fn(), null);
		deepEqual(fn("cat"), null);
		deepEqual(fn(1, true), null);
		deepEqual(fn([], null, true), {
			value : -Infinity,
			index : -1
		});
		
		deepEqual(fn([1], null, true), {
			value : 1,
			index : 0
		});
		deepEqual(fn([1], null, false), {
			value : 1,
			index : 0
		});
		
		deepEqual(fn([-2, -1, 0, 1, 2], null, true), {
			value : 2,
			index : 4
		});
		deepEqual(fn([-2, -1, 0, 1, 2], 4, true), {
			value : 1,
			index : 3
		});
		
		deepEqual(fn([-2, -1, 0, 1, 2], null, false), {
			value : -2,
			index : 0
		});
		deepEqual(fn([-2, -1, 0, 1, 2], 0, false), {
			value : -1,
			index : 1
		});
	});
	test("test YASMIJ.Matrix.prototype.setUniformedWidth()", function () {
		var fn = function (arr) {
			return YASMIJ.Matrix.parse(arr).setUniformedWidth().toString();
		};
		equal(fn([]), "[]");
		equal(fn([[1, 2]]), "[[1,2]]");
		equal(fn([[1, 2], [3, 4]]), "[[1,2],[3,4]]");
		equal(fn([[1, 2], [3, 4, 5]]), "[[1,2,],[3,4,5]]");
		equal(fn([[1, 2], [3, 4, 5], [6]]), "[[1,2,],[3,4,5],[6,,]]");
	});
	test("test YASMIJ.Matrix.prototype.transpose()", function () {
		var exampleMatrix = YASMIJ.Matrix.parse([[1, 2], [3, 4]]);
		var originalOrder = exampleMatrix.toString();
		
		notEqual(exampleMatrix.transpose(), originalOrder);
		exampleMatrix.transpose();
		equal(exampleMatrix.toString(), originalOrder);
	});
	test("test YASMIJ.Matrix.prototype.equal()", function () {
		var exampleMatrix = YASMIJ.Matrix.parse([[1, 2], [3, 4]]);
		
		equal(exampleMatrix.equals([[1, 2], [3, 4]]), false);
		equal(exampleMatrix.equals(YASMIJ.Matrix.parse([[1, 2]])), false);
		equal(exampleMatrix.equals(exampleMatrix), true);
	});
	test("test YASMIJ.Matrix.prototype.addRow()", function () {
		var fn = function (obj, rowObj) {
			return YASMIJ.Matrix.parse(obj).addRow(rowObj).toString();
		};
		equal(fn(1, 2), "[[1],[2]]");
		equal(fn([1, 2], [1, 2]), "[[1,2],[1,2]]");
	});
	test("test YASMIJ.Matrix.prototype.getRow()", function () {
		var fn = function (obj, i) {
			return YASMIJ.Matrix.parse(obj).getRow(i);
		};
		deepEqual(fn([[1], [2]], 1), [2]);
	});
	test("test YASMIJ.Matrix.prototype.forEachRow()", function () {
		var fn = function (obj, fn) {
			return YASMIJ.Matrix.parse(obj).forEachRow(fn);
		};
		var arr = [];
		fn([[1], [2], [3]], function (i, row) {
			arr.push(row[0]);
		});
		deepEqual(arr, [1, 2, 3]);
	});
	test("test YASMIJ.Matrix.prototype.replaceEachRow()", function () {
		var fn = function (obj, fn) {
			return YASMIJ.Matrix.parse(obj).replaceEachRow(fn).toArray();
		};
		var arr = fn([[1], [2], [3]], function (i, row, rows) {
				return rows[0];
			});
		deepEqual(arr, [[1], [1], [1]]);
	});
	test("test YASMIJ.Matrix.prototype.toArray()", function () {
		var fn = function (obj) {
			return YASMIJ.Matrix.parse(obj).toArray();
		};
		deepEqual(fn(), []);
		deepEqual(fn([1, 2, 3]), [[1, 2, 3]]);
	});
	test("test YASMIJ.Matrix.prototype.getColumn()", function () {
		var fn = function (obj, j) {
			return YASMIJ.Matrix.parse(obj).getColumn(j);
		};
		deepEqual(fn([[1, 2], [3, 4]], 0), [1, 3]);
	});
	test("test YASMIJ.Matrix.prototype.getElement()", function () {
		var fn = function (obj, i, j) {
			return YASMIJ.Matrix.parse(obj).getElement(i, j);
		};
		equal(fn([[1, 2], [3, 4]], 0, 0), 1);
		equal(fn([[1, 2], [3, 4]], 0, 1), 2);
		equal(fn([[1, 2], [3, 4]], 1, 1), 4);
	});
	test("test YASMIJ.Matrix.prototype.get()", function () {
		var fn = function (obj, i, j) {
			return YASMIJ.Matrix.parse(obj).get(i, j);
		};
		equal(fn([[1, 2], [3, 4]], 1, 1), 4);
		deepEqual(fn([[1, 2], [3, 4]], 1), [3, 4]);
		deepEqual(fn([[1, 2], [3, 4]], null, 1), [2, 4]);
	});
	test("test YASMIJ.Matrix.prototype.toString()", function () {
		var fn = function (obj) {
			return YASMIJ.Matrix.parse(obj).toString();
		};
		equal(fn([]), "[]");
		equal(fn([1, 2, 3]), "[[1,2,3]]");
		equal(fn([[1, 2, 3]]), "[[1,2,3]]");
		equal(fn([
					[1, 2, 3],
					[1, 2, 3],
					[1, 2, 3]
				]), "[[1,2,3],[1,2,3],[1,2,3]]");
	});
	test("test YASMIJ.Matrix.prototype.getSize()", function () {
		var fn = function (obj) {
			return YASMIJ.Matrix.parse(obj).getSize();
		};
		deepEqual(fn(), [0, 0]);
		deepEqual(fn([]), [0, 0]);
		deepEqual(fn([1]), [1, 1]);
		deepEqual(fn([[1, 2], [1, 2]]), [2, 2]);
		deepEqual(fn([[1], [2]]), [1, 2]);
	});
	test("test YASMIJ.Matrix.prototype.scaleRow()", function () {
		var fn = function (obj, factor, rowI) {
			return YASMIJ.Matrix.parse(obj).scaleRow(factor, rowI).toString();
		};
		equal(fn([1, 2, 3], 2, 0), "[[2,4,6]]");
		equal(fn([[1], [2], [3]], 2, 2), "[[1],[2],[6]]");
	});
	test("test YASMIJ.Matrix.getMaxArray()", function () {
		var fn = YASMIJ.Matrix.getMaxArray;
		equal(fn(), null);
		deepEqual(fn([[]]), {
			index : 0,
			max : 0
		});
		deepEqual(fn([1, 2, 3]), {
			index : 0,
			max : 3
		});
		deepEqual(fn([[], []]), {
			index : 0,
			max : 0
		});
		deepEqual(fn([[1], []]), {
			index : 0,
			max : 1
		});
		deepEqual(fn([[1], [1, 2]]), {
			index : 1,
			max : 2
		});
		deepEqual(fn([[1], [1, 2], [1, 2, 3]]), {
			index : 2,
			max : 3
		});
	});
	test("test YASMIJ.Matrix.prototype.addToRow()", function () {
		var fn = function (arr, iRow, els) {
			return YASMIJ.Matrix.parse(arr).addToRow(iRow, els).array;
		};
		deepEqual(fn([], 0, [1, 2, 3]), [[1, 2, 3]]);
		deepEqual(fn([], 1, [1, 2, 3]), [[1, 2, 3]]);
		deepEqual(fn([[1], [2]], 0, [2, 3, 4]), [[1, 2, 3, 4], [2]]);
	});
	test("test YASMIJ.Matrix.prototype.getGreatestValueFromLastRow()", function () {
		var fn = function (arr, b) {
			return YASMIJ.Matrix.parse(arr).getGreatestValueFromLastRow(b);
		};
		equal(fn([1, 2, 3]), -1);
		equal(fn([1, 2, -3, -4]), 2);
		equal(fn([[1, 2, 3], [1, -3, -1]]), 1);
		equal(fn([[1, 2, 3], [1, -3, -1, -9]]), 1);
		
		equal(fn([1, 2, 3], true), 1);
		equal(fn([1, 2, -3, -4], true), 1);
		equal(fn([[1, 2, 3], [1, -3, -1]], true), 0);
		equal(fn([[1, 2, 3], [1, -3, -1, -9]], true), 0);
	});
	test("test YASMIJ.Matrix.prototype.getRowIndexWithPosMinColumnRatio()", function () {
		var fn = function (arr, colI) {
			return YASMIJ.Matrix.parse(arr).getRowIndexWithPosMinColumnRatio(colI);
		};
		deepEqual(fn([[-2, 1], [-1, 2]], 0), {
			rowIndex : -1,
			minValue : Infinity
		});
		deepEqual(fn([[1, 1], [2, 1], [3, 2]], 0), {
			rowIndex : 1,
			minValue : 0.5
		});
		deepEqual(fn([[1, 1], [2, 1], [3, 2]], 1), {
			rowIndex : 0,
			minValue : 1
		});
		deepEqual(fn([[1, 2, 3], [2, 3, 4], [3, 4, 5]], 0), {
			rowIndex : 2,
			minValue : 5 / 3
		});
		deepEqual(fn([[1, 2, 3], [2, 3, 4], [3, 4, 5]], 1), {
			rowIndex : 2,
			minValue : 5 / 4
		});
		deepEqual(fn([[1, 2, 3], [2, 3, 4], [3, 4, 5]], 2), {
			rowIndex : 0,
			minValue : 1
		});
	});
	test("test YASMIJ.Matrix.prototype.getRowIndexWithPosMinColumnRatio() with the last row excluded", function () {
		var fn = function (arr, colI) {
			return YASMIJ.Matrix.parse(arr).getRowIndexWithPosMinColumnRatio(colI, true);
		};
		deepEqual(fn([[1, 2, 3], [2, 3, 4], [3, 4, 5]], 0), {
			rowIndex : 1,
			minValue : 2
		});
		deepEqual(fn([[1, 2, 3], [2, 3, 4], [3, 4, 5]], 1), {
			rowIndex : 1,
			minValue : 4 / 3
		});
		deepEqual(fn([[1, 2, 3], [2, 3, 4], [3, 4, 5]], 2), {
			rowIndex : 0,
			minValue : 1
		});
	});
	test("test YASMIJ.Matrix.prototype.pivot()", function () {
		var fn = function (arr, pRow, pCol) {
			return YASMIJ.Matrix.parse(arr).pivot(pRow, pCol).toString();
		};
		equal(fn([], 0, 0), "[]");
		equal(fn([1, 2], 0, 0), "[[1,2]]");
		equal(fn([[1, 2], [3, 4]], 0, 0), "[[1,2],[0,-2]]");
		equal(fn([[1, 2], [2, 4]], 0, 0), "[[1,2],[0,0]]");
		equal(fn([[1, 2], [2, 4]], 1, 1), "[[0,0],[0.5,1]]");
	});
	test("test YASMIJ.Matrix.prototype.getUnitValueForColumn()", function () {
		var fn = function (arr, colI) {
			return YASMIJ.Matrix.parse(arr).getUnitValueForColumn(colI);
		};
		equal(fn([2, 4], 0), 0);
		equal(fn([1, 4], 0), 4);
		equal(fn([[1, 4], [0, 1]], 0), 4);
		equal(fn([[1, 4], [1, 1]], 0), 0);
		equal(fn([[1, -1], [1, 1], [1, 0]], 0), 0);
		equal(fn([[1, -1], [1, 1], [1, 0]], 1), 0);
	});
	test("test YASMIJ.Matrix.prototype.getLastElementOnLastRow()", function () {
		var fn = function (arr) {
			return YASMIJ.Matrix.parse(arr).getLastElementOnLastRow();
		};
		equal(fn([1]), 1);
		equal(fn([1, 2, 3, 4]), 4);
		equal(fn([[1, 2, 3], [4, 5, 6]]), 6);
	});
	test("test YASMIJ.Matrix.transpose()", function () {
		var fn = function (arr) {
			return YASMIJ.Matrix.transpose(arr);
		};
		deepEqual(fn(), null);
		deepEqual(fn([]), null);
		deepEqual(fn([1, 2, 3]), null);
		
		deepEqual(fn([[1, 2, 3]]), [[1], [2], [3]]);
		deepEqual(fn([[1], [2], [3]]), [[1, 2, 3]]);
		deepEqual(fn(
				[
					[1, 2, 3],
					[4, 5, 6],
					[7, 8, 9]
				]),
			[
				[1, 4, 7],
				[2, 5, 8],
				[3, 6, 9]
			]);
	});
};
