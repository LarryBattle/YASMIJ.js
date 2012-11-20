/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/
YASMIJ.Simplex = (function(){
	"use strict";
	// Simplex Class
	var Simplex = function(){
		this.input = new YASMIJ.Input();
		this.output = new YASMIJ.Output();
		this.tableau = new YASMIJ.Tableau();
		this.state = null;
	};
	Simplex.prototype.toString = function(){
	};
	Simplex.prototype.setInput = function( obj ){
		this.input.parse( obj );
	};
	return Simplex;
}());