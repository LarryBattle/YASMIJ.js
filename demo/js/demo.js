/**
* @todo Rewrite this without jquery.
*/
if(!YASMIJ){
	throw new Error("YASMIJ.js is required.");
}
if(!JSON){
	throw new Error( "JSON is required." );
}
// Singleton to store all the values and functions.
var Funcs = {
	util: {}
};
/**
* Returns a timestamp in the format
* @return {String} timestamp
*/
Funcs.util.getTimeStamp = function(){
	var x = new Date();
	return x.toLocaleDateString() + " " + x.toLocaleTimeString(); 
};
$(function(){
	"use strict";
	// adds log message
	var addLog = function(msg){
		var logs = document.getElementById("logs");
		logs.innerHTML += Funcs.util.getTimeStamp() + ": " + msg + "\n";
	};
	// creates a new constraint
	var createConstraintBlock = function(){
		var id = "div_constraintBlock" + ($(".input_constraint").length || 0);
		return $("<div>").attr("id", id).append(
				$("<input type='text'>").addClass("input_constraint"),
				$("<input type='button'/>").addClass("deleteConstraint")
					.attr({"for" : "#" + id, "value" : "x"})
		);
	};
	// adds a new constraint when the "Add Constraint" button is pressed.
	$("#addConstraint").click(function(){
		$("#constraintArea").prepend( createConstraintBlock() );
	});
	// deletes a constraint when the "x" button is pressed.
	$(document.body).delegate(".deleteConstraint", "click", function(e){
		var el = $(e.target);
		$( $(el).attr("for") ).remove();
	});
	// returns object needs to create a input object for YASMIJ.
	var createInputObjectFromInput = function(){	
		return {
			type : document.getElementById("problemType").value,
			objective : document.getElementById("problemObjective").value,
			constraints : $(".input_constraint").filter(function(){
				return /\w/.test( $(this).val() );
			}).map(function(){ 
				return $(this).val(); 
			}).toArray()
		};		
	};
	// logs the input and output to `YASMIJ.solve()`
	$("#btn_solve").click(function(){
		var input = createInputObjectFromInput();
		
		addLog( "Solving a new problem\nvar input = " + JSON.stringify( input, null, 2) );
		try{
			var output = YASMIJ.solve( input );
			addLog( "YASMIJ.solve( input ) returns \n" + JSON.stringify( output, null, 2) );
		}catch(e){
			addLog( e.toString() );
		}
	});
	// clear logs
	$("#btn_clearLogs").click(function(){
		document.getElementById("logs").innerHTML = "";
	});
});

