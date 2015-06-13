/*
 * @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
 * @author Larry Battle
 * @license MIT License <http://www.opensource.org/licenses/mit-license>
 */

tests.runSimplexTests = function () {
	module("Simplex Class");
	test("test Simplex Class", function () {
		ok(1);
	});
	test("test setting the simplex input", function () {
		var input = {};
		input.goal = "maximize";
		input.z = "x1+2x2-x3";
		input.constraints = [
			"2x1 + x2 + x3 <= 14",
			"4x1 + 2x2 + 3x3 <= 28",
			"2x1 + 5x2 + 5x3 <= 30"
		];
		var problem = new YASMIJ.Simplex();
		problem.setInput(input);

		equal(problem.input.raw.z, input.z);
		deepEqual(problem.input.raw.constraints, input.constraints);

		// deepEqual( problem.input.z.valueOf(), [1,2,-1] );
		// deepEqual( problem.input.constraints.valueOf(), [
		// [2,1,1,"<=",14],[4,2,3,"<=",28],[2,5,5,"<=",30]
		// ] );
		// deepEqual( problem.input.constraints, input.constraints );
	});
}
