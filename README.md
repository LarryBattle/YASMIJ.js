Project: YASMIJ.js - Yet Another Simplex Method Library for Javascript.
----------------------------------------------------------
The purpose of this project is to provide a simple Simplex Method library for Javascript.
The simplex method is a popular algorithm for linear programming.
It is used to solve optimization by using of artifical variables and/or branch and bound.

Example problem where the simplex method would be useful.
----------------------------------------------------------
Maximize `5x1 + 3x2 + x3`

Subject to

    5x1 + 3x2 + 6x3 = 15
    x1 + x2 + x3 = 6

where `x1`,`x2`, `x3` are all greater than or equal to 0.

Version Roadmap:
----------------------------------------------------------
* 0.1 - Complete the Expression Class (Done)
* 0.1.5  - Complete the Constraint Class (Done)
* 0.2 - Complete the Input Class (Done)
* 0.2.5 - Complete the Matrix Class (In Progress)
* 0.3 - Complete the Tableau Class (In Progress)
* 0.4 - Complete the Output Class
* 0.5 - Complete the Simplex and YASMIJ Classes
* 0.6 - Get Feedback

----------------------------------------------------------
Author: Larry Battle<br/>

<br/>
#Usage

    //Input:
	var inputObj = Input.parse("maximize", "x1 + 2x2 - x3", [
				"2x1 + x2 + x3 <= 14",
				"4x1 + 2x2 + 3x3 <= 28",
				"2x1 + 5x2 + 5x3 <= 30"
			]);
	var x = Tableau.parse(inputObj).solve();
	var a = x.getOutput();
	console.log(a.convertToRatio().toString());

	// Output:
	{
		"matrix" : {
			"array" : [
				["s1", "s2", "s3", "x1", "x2", "x3"]
				["-2", "1", "0", "0", "0", "1", "0"], 
				["5/8", "0", "-1/8", "1", "0", "0", "5"], 
				["-1/4", "0", "1/4", "0", "1", "1", "4"], 
				["1/8", "0", "3/8", "0", "0", "3", "13"]
			],
			"rows" : 0,
			"columns" : 0
		},
		"result" : {
			"slack1" : "0",
			"slack2" : "0",
			"slack3" : "0",
			"x1" : "5",
			"x2" : "4",
			"x3" : "0",
			"z" : "13"
		}
	}
