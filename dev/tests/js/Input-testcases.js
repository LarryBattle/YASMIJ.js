/*
* @project {{=it.name}}
* @author Larry Battle
* @license {{=it.license.overview}}
*/

tests.runInputTests = function(){
	module( "Input Class" );
	test( "test Input.prototype.addNumbersToSlacks", function(){
		var func = function(str, eqs){
			return Input.parse( "maximize", str, eqs).convertToStandardForm();
		};
		var x = func( "x1 + 2x2 - x3", [
			"a < 14",
			"a + b <=28"
		]);
		var c = x.constraints.join( ", " );
		equal( /slack1/.test(c), true );
		equal( /slack2/.test(c), true );
	});
	test( "test Input.prototype.getZTermNotInAnyOfTheConstraints", function(){
		var func = function(str, eqs){
			return Input.parse( "maximize", str, eqs).getZTermNotInAnyOfTheConstraints();
		};
		equal( func( "a", [ "a < 1", "b < 3"] ), "");
		equal( func( "c + d", [ "c < 1", "d < 1"] ), "");
		
		equal( func( "a", [ "b < 3"] ), "a");
		equal( func( "c + d", [ "c < 1" ] ), "d");
	});
	test( "test Input.prototype.checkConstraints", function(){
		var func = function(str, eqs){
			return Input.parse( "maximize", str, eqs).checkConstraints();
		};
		ok( func( "a", [ "a < 1", "b < 3"] ) );
		ok( func( "c + d", [ "d < 1"] ));
		
	});
	test( "test Input.prototype.convertConstraintsToMaxForm", function(){
		
		var func = function(str){
			var obj = {
				constraints: [ Constraint.parse(str) ]
			};
			Input.prototype.convertConstraintsToMaxForm.call(obj);
			return obj.constraints[0].toString();
		};
		var testThis = function(str){
			var x = Constraint.parse(str).convertToStandardMaxForm().toString();
			equal( func( str ), x );
		};
		testThis( "a + b < 4" );
	});
	test( "test Input.prototype.convertToStandardForm", function(){
		var func = function(str, eqs){
			return Input.parse( "maximize", str, eqs);
		};
		var testThis = function(str, eqs){
			var x = func( str, eqs );
			equal( x.isStandardMode, false );
			x.convertToStandardForm();
			equal( x.isStandardMode, true );
		};
		testThis( "a + b", ["a + b < 1"] );
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
	test( "test Input.prototype.getTermNames()", function(){
		var func = function(str, eqs, onlyVariables){
			return Input.parse( "maximize", str, eqs).getTermNames(onlyVariables).join(", ");
		};
		equal( func( "x1 + 2x2 - x3", [
			"2x1+x2+x3 <= 14",
			"4x1+2x2+3x3<=28",
			"2x1+5x2+5x3<=30"
		]), ["x1", "x2", "x3", "14", "28", "30" ].sort().join( ", " ) );
		
		equal( func( "x1 + 2x2 - x3", [
			"2x1+x2+x3 <= 14",
			"4x1+2x2+3x3<=28",
			"2x1+5x2+5x3<=30"
		], true), ["x1", "x2", "x3" ].sort().join( ", " ) );
	});
	test( "test Input.parse", function(){
		var x = Input.parse( "maximize", "x1 + 2x2 - x3", [
			"2x1+x2+x3 <= 14",
			"4x1+2x2+3x3<=28",
			"2x1+5x2+5x3<=30"
		]);
		equal( x.type, "maximize" );
		equal( x.z.toString(), "x1 + 2x2 - x3" );
		equal( x.constraints.length, 3 );
		deepEqual( x.terms.join(", "), "14, 28, 30, x1, x2, x3" );
	});
	
};










