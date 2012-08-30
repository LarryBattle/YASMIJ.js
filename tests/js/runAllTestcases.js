/**
* @project {{=it.name}}
* @requires Equation.js and, jQuery.js
*/
var runAllTests = function(){
	tests.runExpressionTests();
	tests.runConstraintTests();
	tests.runInputTests();
	tests.runMatrixTests();
	tests.runTableauTests();
};