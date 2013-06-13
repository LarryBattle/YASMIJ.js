/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/
// Output Class
(function(root){
	//
	var Output = function(obj){
		this.result = obj;
		this.checkForError();
		return this;
	};
	/**
	* Checks object for errors.
	* @return {String}
	*/
	Output.getErrorMessage = function(obj){
		var errMsg;
		if(typeof obj !== "object"){
			errMsg = "An object must be passed.";
		}
		return errMsg;
	};
	Output.parse = function(obj){
		return new Output(obj);
	};
	Output.prototype.checkForError = function(){
		var errMsg = Output.getErrorMessage(this.result);
		if(errMsg){
			throw new Error(errMsg);
		}
	};
	Output.prototype.toString = function(){
		return JSON.stringify(this);
	};
	YASMIJ.Output = Output;
}(YASMIJ.Output));
