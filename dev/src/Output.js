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
var Output = function(obj, matrix){
	this.matrix = matrix;
	this.result = obj;
	this.checkForError();
	return this;
};
Output.getErrorMessage = function(obj, matrix){
	var errMsg;
	if(typeof obj !== "object"){
		errMsg = "An object must be passed.";
	}else if(!(matrix instanceof Matrix)){
		errMsg = "Must pass an instance of matrix.";
	}
	return errMsg;
};
Output.parse = function(obj, matrix){
	return new Output(obj, matrix);
};
Output.prototype.checkForError = function(){
	var errMsg = Output.getErrorMessage(this.result, this.matrix);
	if(errMsg){
		throw new Error(errMsg);
	}
};
Output.prototype.toString = function(){
	return JSON.stringify(this);
};
Output.prototype.convertToRatio = function(){
	if(!Ratio){
		throw new Error( "Ratio.js is required." );
	}
	this.matrix.forEachRow(function(j, row, rows){
		for(var i = 0, len = row.length; i < len; i++){
			row[i] = Ratio.parse( row[i] ).reduce().toLocaleString();
		}
	});
	for( var name in this.result ){
		this.result[name] = Ratio(this.result[name]).reduce().toLocaleString();
	}
	return this;
};