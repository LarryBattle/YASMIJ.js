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
        this.input = new root.Input();
        this.output = new root.Output();
        this.tableau = new root.Tableau();
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
	Simplex.parse = function(input){
		//input
	};
	/**
    * Checks if input to `Simplex.solve()` is correct.
    * @param {Object} obj - 
    * @return {String} error message to display
    */
	Simplex.getErrors = function(obj){
        if(typeof obj !== "object" ){
            return "An object must be passed to YASMIJ.solve()";
        }
        if(!obj.type || !obj.objective || !obj.constraints ){
            return "The object must have the properties `type`, `objective` and `constraints`.";
        }
    };
	/**
    * Checks if input to `YASMIJ.solve()` is correct.
    * Throws an error if there's a problem.
    * @param {Object} obj 
    */
    Simplex.checkForErrors = function(obj){
        var errMsg = Simplex.getErrors(obj);
        if(errMsg){
            throw new Error(errMsg);
        }
    };
	Simplex.solve = function( input ){
		Simplex.checkForErrors( input );
        return root.Tableau.parse(
                root.Input.parse( input.type, input.objective, input.constraints )
            ).solve().getOutput();
	};
    root.Simplex = Simplex;
}(YASMIJ));
