/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/

// Input Class
var Input = function(){
	this.z = null;
	this.raw = null;
	this.type = null;
	this.variables = null;
	this.constraints = null;
};
Input.checkForRequirements = function( obj ){
	var errMsg = "Input Object";
	if( !obj || typeof obj !== "object" ){
		errMsg = "must be an object with properies `z`, `constraints` and `type`.";
	}
	return errMsg;
};
Input.prototype.toString = function(){
};
Input.prototype.parse = function( obj ){
	this.raw = obj;
	var zEquation = new Equation(obj.z);
	this.z = obj.z;
};
