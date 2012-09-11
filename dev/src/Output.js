/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/
/*
* @todo Use create a fuction for objectToString since JSON.stringify isn't supported by older browsers.
*/
// Output Class
var Output = function(){
	this.matrix = null;
	this.result = null;
};
Output.prototype.toString = function(){
	var str = "";
	str += "matrix = " + ( this.matrix instanceof Matrix ? this.matrix.toString() : [] );
	str += "\n result = " + JSON.stringify(result);
	return str;
};