/*
* @project {{=it.name}}
* @author Larry Battle
* @license {{=it.license.overview}}
*/

tests.runInputTests = function(){
	module( "Input Class" );
	test( "test Input.parse", function(){
		var x = Input.parse( "maximize", "x1 + 2x2 - x3", [
			"2x1+x2+x3 <= 14",
			"4x1+2x2+3x3<=28",
			"2x1+5x2+5x3<=30"
		]);
		equal( x.type, "maximize" );
		equal( x.z, "x1 + 2x2 - x3" );
		equal( x.constraints.length, 3 );
		deepEqual( x.terms.join(", "), "14, 28, 30, x1, x2, x3" );
	});
	test( "test Input.prototype.toString()", function(){
		var x = Input.parse( "maximize", "x1 + 2x2 - x3", [
			"2x1+x2+x3 <= 14",
			"4x1+2x2+3x3<=28",
			"2x1+5x2+5x3<=30"
		]);
		var expected = [ 
			"maximize z = x1 + 2x2 - x3",
			"where 2x1 + x2 + x3 <= 14, 4x1 + 2x2 + 3x3 <= 28, 2x1 + 5x2 + 5x3 <= 30"
		].join( ", " );
		equal( x.toString(), expected );
	});	
}