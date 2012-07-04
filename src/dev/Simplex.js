/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/
 
// Simplex Class
var Simplex = function(){
	this.input = new Input();
	this.output = new Output();
	this.tableau = new Tableau();
	this.state;
};
Simplex.prototype.toString = function(){
}
Simplex.prototype.setInput = function( obj ){
	this.input.parse( obj );
};