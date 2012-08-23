/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/
tests.runConstraintTests = function(){
	var checkIfSame = function( func, str, expect ){
		var result = func( str );
		var errMsg = "`" + str + "` failed to match object." ;
		if( mixin.areObjectsSame( result, expect ) ){
			ok( true );
		}else{
			if( JSON.stringify ){
				equal( JSON.stringify( result ), JSON.stringify( expect ), errMsg );
			}else{
				ok( false, errMsg + " Note: Use browser with `JSON.stringify` support for more details");
			}
		}
	};
	module( "Constraint Class: Checking input" );
	test( "test Constraint.hasManyCompares() with 1 compare", function(){
		var func = Constraint.hasManyCompares;
		equal( func( "a < b" ), false );
		equal( func( "a > b" ) , false );
		equal( func( "a = b" ) , false );
		
		equal( func( "a >= b" ) , false );
		equal( func( "a <= b" ) , false );
		
		equal( func( "a = < b" ), true );
		equal( func( "a => b" ), true );
	});
	test( "test Constraint.hasManyCompares() with many compares", function(){
		var func = Constraint.hasManyCompares;
		equal( func( "a << b" ), true );
		
		equal( func( "a < < b" ), true );
		equal( func( "a >> b" ), true );
		equal( func( "a > > b" ), true );
		
		equal( func( "a == b" ), true );
		equal( func( "a = = b" ), true );
		equal( func( "a >=>= b" ), true );
		
		equal( func( "a <=<= b" ), true );
		equal( func( "a > b > c" ), true );
		equal( func( "a > b < c" ), true );
		
		equal( func( "a < b < c" ), true );
	});
	test( "test Constraint.hasIncompleteBinaryOperator() with valid expressions.", function(){
		var func = Constraint.hasIncompleteBinaryOperator;

		equal( func( "+a - b" ), false );
		equal( func( "a + b" ), false );
		equal( func( "a < b" ), false );
		equal( func( "a > b" ), false );
		equal( func( "a >= b" ), false );
		equal( func( "a = 1" ), false );
		equal( func( "a - b + 1 > c + 1e34" ), false );
	});
	test( "test Constraint.hasIncompleteBinaryOperator() with invalid expressions.", function(){
		var func = Constraint.hasIncompleteBinaryOperator;
		
		equal( func( "a b" ), true );
		equal( func( "a b > c" ), true );
		equal( func( "a + b < c d" ), true );
		equal( func( "a-" ), true );
		equal( func( "a+" ), true );
		equal( func( "a+ < c-" ), true );
		equal( func( "a+ b -= c" ), true );
		equal( func( "a+ b += c" ), true );
	});
	test( "test that Constraint.getErrorMessage() ", function(){
		var func = Constraint.getErrorMessage;
		ok( !func( "a+b" ) );
		ok( func( "a b" ) );
		ok( func( "a * b" ) );
		ok( func( "a + b+" ) );
	});
	test("test Constraint.getErrorMessage() with valid input.", function(){
		var func = Constraint.getErrorMessage;
		var x;
		equal( func( "a < c" ), x );
		equal( func( "a > c" ), x );
		equal( func( "a <= c" ), x );
		
		equal( func( "a >= c" ), x );
		equal( func( "a = c" ), x );
		equal( func( "a < c + 12" ), x );
		
		equal( func( "a - 3 > c" ), x );
		equal( func( "12 + 2 <= c" ), x );
		equal( func( "2 >= 1" ), x );
		
		equal( func( "13 = 13" ), x );
	});
	test("test Constraint.checkInput() will throw an error when Constraint.getErrorMessage returns a message.", function(){
		var args = "error";
		var oldFunc = Constraint.getErrorMessage;
		Constraint.getErrorMessage = function(){
			return args;
		};
		var func = Constraint.checkInput;
		try{
			raises(function(){
				func();
			});
			args = "";
			ok(	!func() );
		}
		catch(e){
		}
		Constraint.getErrorMessage = oldFunc;
	});
	test("test Constraint.parseToObject() with valid expressions", function(){
		var func = Constraint.parseToObject;
		var y = {
			rhs: {
				terms:{
					"1": 0
				}
			},
			lhs : {
				terms:{
					"x1":10,"x2":-2, "1":-10
				}
			},
			comparison:"="
		};
		var x = func("10x1 -2x2 - 10");
		deepEqual( x.rhs.terms, y.rhs.terms );
		deepEqual( x.lhs.terms, y.lhs.terms );
		deepEqual( x.comparison, y.comparison );
	});
	test("test Constraint.parseToObject() with different compares", function(){
		var func = Constraint.parseToObject;


		checkIfSame( func, "2a + 3b <= 30", {
			lhs:{terms:{ "a":2,"b":3}},
			rhs:{terms:{ "1":30 }},
			comparison:"<="
		});
		checkIfSame( func, "2a - 30 >= 4 + a2", {
			lhs:{terms:{ "a":2, "1": -30 }},
			rhs:{terms:{ "a2": 1, "1": 4 }},
			comparison:">="
		});
		checkIfSame( func, "2a - 30 > 4 + a2", {
			lhs:{terms:{ "a":2, "1": -30 }},
			rhs:{terms:{ "a2": 1, "1": 4 }},
			comparison:">"
		});
		checkIfSame( func, "2a - 30 < 4 + a2", {
			lhs:{terms:{ "a":2, "1": -30 }},
			rhs:{terms:{ "a2": 1, "1": 4 }},
			comparison:"<"
		});
		checkIfSame( func, "2a + 12 = 2a + 12", {
			lhs:{terms:{ "a":2, "1": 12 }},
			rhs:{terms:{ "a":2, "1": 12 }},
			comparison:"="
		});
	});
	test("test Constraint.getTermNames()", function(){
		var func = function( str ){
			return Constraint.parse( str ).getTermNames();
		};
		deepEqual( func( "a" ), ["a"] );
		deepEqual( func( "2x1 + x2 + x3 <= 14" ), ["x1","x2","x3", "14"] );
	});
	test("test Constraint.parse()", function(){
		var func = function(str){
			return Constraint.parse(str);
		};
		var x = func( "2x1 + x2 + x3 <= 14" );
		deepEqual( x.leftSide.toString(), "2x1 + x2 + x3" );
		deepEqual( x.rightSide.toString(), "14" );
		deepEqual( x.comparison.toString(), "<=" );
	});
	test("test Constraint.prototype.toString()", function(){
		var func = function( str ){
			return Constraint.parse( str ).toString();
		};
		equal( func( "a+3<=3b"), "a + 3 <= 3b" );
		equal( func( "-1.4e+ 4 +23.9e4 + a4 -d3 -3e+49 = 3"), "a4 - d3 - 1.4e - 3e+49 = 3" );
	});
	
	test( "test Constraint.prototype.moveVariableToOneSide()", function(){
		var func = function( str, isLeft ){
			return Constraint.parse(str).moveVariableToOneSide(isLeft).toString();
		};
		equal( func( "a <= 30", true ), "a <= 30", "vars on left" );
		equal( func( "a <= 30", false ), "0 <= -a + 30", "vars on right" );
		
		equal( func( "a + 4b - c <= 30 + a", false ), "0 <= -4b + c + 30", "right" );
		equal( func( "4a + 3 - 94c <= 30 + 43", false ), "3 <= -4a + 94c + 73", "right" );
	});
	test( "test Constraint.protype.convertTo() with two term Constraints", function(){
		var func = function( str, varsSide, constantsSide, comparison ){
			return Constraint.parse(str).convertTo(varsSide, constantsSide, comparison).toString();
		};
		equal( func( "a <= 30", "left", "right" ), "a <= 30" );
		equal( func( "a <= 30", "right", "left" ), "-30 <= -a" );
		equal( func( "a <= 30", "right", "left", true ), "30 > a" );
	});
	test( "test Constraint.protype.convertTo() with two or more terms Constraints", function(){
		var func = function( str, varsSide, constantsSide, comparison ){
			return Constraint.parse(str).convertTo(varsSide, constantsSide, comparison).toString();
		};
		equal( func( "a - 10 <= 20", "right", "left", true ), "30 > a" );
		equal( func( "a - 10 <= 20", "left", "right" ), "a <= 30" );
		equal( func( "a - 10 = 20", "right", "left" ), "-30 = -a" );
		equal( func( "a - 10 = 20", "left", "left" ), "a - 30 = 0" );
		equal( func( "a - 10 = 20", "right", "right" ), "0 = -a + 30" );
	});
	test( "test Constraint.protype.getStandardMaxForm()", function(){
		var func = function( str ){
			return Constraint.parse(str).getStandardMaxForm().toString();
		};
		equal( func( "a - 10 <= 20" ), "a <= 30" );
		equal( func( "-1 + a < 21" ), "a <= 30" );
		equal( func( "a + b - 10 >= 0" ), "a + b <= 10" );
	});
};










