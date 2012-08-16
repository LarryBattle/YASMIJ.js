/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/
 
// Matrix Class
var Matrix = function(){
	this.columnLength = null;
	this.rowLength = null;
	this.matrix = null;
};

var row = function(el){
    this.el = (typeof el === "object" ) ? el : [];
};
row.prototype.toString = function(){
    return this.el.join(',');
};
a = [];
a.push( new row([11,12,13,14]) );
a.push( new row([21,22,23,24]) );
a.push( new row([31,32,33,34]) );
a.push( new row([41,42,43,44]) );
console.log( a.join('\n') );
