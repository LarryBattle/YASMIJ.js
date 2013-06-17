/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/
(function(root){
	"use strict";
	/**
	* Simplex Class - not sure if this class is needed.
	* @constructor
	*/ 
	var Simplex = function(){
		this.input = new YASMIJ.Input();
		this.output = new YASMIJ.Output();
		this.tableau = new YASMIJ.Tableau();
		this.state = null;
	};
	/*
	* @todo Create this function
	*/
	Simplex.prototype.toString = function(){
	};
	/**
	* Sets the input for the current instance
	* @param {Object}
	* @return {YASMIJ.Input}
	*/
	Simplex.prototype.setInput = function( obj ){
		this.input.parse( obj );
	};
	root.Simplex = Simplex;
}(YASMIJ));
