/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @note The simplex method will solve max and min optimization for Linear Programming problems by use of artifical variables and branch and bound.
* @info Project page: <https://github.com/LarryBattle/YASMIJ.js/>
* @author Larry Battle <http://bateru.com/news>
* @date May 30, 2012
* @version Beta 0.0.1
*/

// Todo: Find out how to model the equations.
// Todo: Find out if underscore.coffee will be of good use.

var Simplex = function(){
	this.equations = [];
	this.interationLimit = 1e5;
};
Simplex.prototype.getResults = function(){
	return false;
};

var YASMIJ = Simplex;