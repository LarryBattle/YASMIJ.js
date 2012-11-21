# YASMIJ.js - Yet Another Simplex Method Library for Javascript.

The purpose of this project is to provide a simple Simplex Method library for Javascript.
The simplex method is a popular algorithm for linear programming.
It is used to solve optimization by using of artifical variables and/or branch and bound.

## Example:

	Maximize x1 + 2x2 - x3

	Subject to 
	2x1 + x2 + x3 <= 14,
	4x1 + 2x2 + 3x3 <= 28,
	2x1 + 5x2 + 5x3 <= 30

	where 0 <= x1, x2, x3

<b>Input</b><br/>

	var input = {
		type: "maximize",
		objective : "x1 + 2x2 - x3",
		constraints : [
			"2x1 + x2 + x3 <= 14",
			"4x1 + 2x2 + 3x3 <= 28",
			"2x1 + 5x2 + 5x3 <= 30"
		]
	};
	var output = YASMIJ.solve( input );
	
<b>Output</b><br/>

	JSON.stringify(output, null, 2)
	// returns 
	"{
	  "result": {
		"slack1": 0,
		"slack2": 0,
		"slack3": 0,
		"x1": 5,
		"x2": 4,
		"x3": 0,
		"z": 13
	  }
	}"

## TODO
- Add support for Minimization
- Add support for unbounded variables.
- Add documentation.
