# Note
Project is retired and not under active development.

# YASMIJ.js

## Purpose:
YASMIJ stands for `Yet Another Simplex Method Library for Javascript`.<br/>
The purpose of this project is to provide a simple Simplex Method library for Javascript.<br/>
The simplex method is a popular algorithm for linear programming.<br/>
It is used to solve optimization by using of artifical variables and/or branch and bound.<br/>

<b>Notes</b>: <br/>
- Yasmij.js is a small side project that I work on in my spare time.
- CommonJS bundlers will place a global YASMIJ onto the window
Please feel free to contribute.

## Version
BETA 0.2.5 - (unstable)

## Dependencies
None

## Installation
- `require('yasmij')`, or
- include `<script src="./dist/yasmij.js"></script>` from this repo

## Environment
Run the test cases to determine support.<br/>
In general, yasmij.js should be supported in Javascript ES5 environments.<br/>
Ex. Chrome 10+, Firefox 12+, IE9+ and Node.js<br/>
<br/>

## Documentation
Refer to the `docs` folder

Please read the test cases to understand how everything works.

## Change Log
Refer to `history.md`

## Issues / Help
Please raise a ticket for help.

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


## Roadmap
### Version 0.3:
- Add support for Minimization (Standard and Non-standard)<br/>
- Add documentation.<br/>
- Add build script<br/>

### Version 0.4:
- Add support for unrestricted variables.

<br/>
