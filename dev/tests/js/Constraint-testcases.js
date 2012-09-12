/*
* @project {{=it.name}}
* @author Larry Battle
* @license {{=it.license.overview}}
* @date 07/02/2012
*/
tests.runConstraintTests = function(){
	var checkIfSame = function( func, str, expect ){
		var result = func( str ),
			errMsg = "`" + str + "` failed to match object." ;
			
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
		equal( func( "x     <= 1" ), false );
		equal( func( "x <   = 1" ), false );
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
		var func = Constraint.getErrorMessage,
			x;
			
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
		var func = Constraint.checkInput,
			args = "error",
			oldFunc = Constraint.getErrorMessage;
			
		Constraint.getErrorMessage = function(){
			return args;
		};
		
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
		var func = Constraint.parseToObject,
			x = func("10x1 -2x2 - 10");
			
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
	test("test Constraint.getTermNames(true) to execlude numbers", function(){
		var func = function( str ){
			return Constraint.parse( str ).getTermNames(true);
		};
		deepEqual( func( "a" ), ["a"] );
		deepEqual( func( "2x1 + x2 + x3 <= 14" ), ["x1","x2","x3"] );
	});
	test("test Constraint.parse()", function(){
		var func = function(str){
				return Constraint.parse(str);
			},
			x = func( "2x1 + x2 + x3 <= 14" );
			
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
	test( "test Constraint.prototype.getSwappedSides()", function(){
		var func = function(str, side ){
			return Constraint.parse(str).getSwappedSides(side);
		};
		var checkSwapped = function(str){
			var obj = Constraint.parse(str),
				sideObj = func(str, true);
				
			equal( obj.leftSide.toString(), sideObj.b.toString(), "checkSwapped(): " + str + ", leftSide(swapped side) should be side.b" );
			equal( obj.rightSide.toString(), sideObj.a.toString(), "checkSwapped(): " + str + ", rightSide(swapped side) should be side.a" );
		};
		var checkNotSwapped = function(str){
			var obj = Constraint.parse(str),
				sideObj = func(str);
			
			equal( obj.leftSide.toString(), sideObj.a.toString(), "checkNotSwapped(): " + str + ", leftSide(same side) should be side.a" );
			equal( obj.rightSide.toString(), sideObj.b.toString(), "checkNotSwapped(): " + str + ", rightSide(same side) should be side.b" );
		};
		var checkBoth = function( str ){
			checkSwapped( str );
			checkNotSwapped( str );
		};
		checkBoth( "x = y" );
		checkBoth( "x + 4 + 2 = y + c + 3c" );
	});
	test( "test Constraint.switchSides()", function(){
		var result;
		var func = function(str, doSwap ){
			var obj = Constraint.parse(str),
				sides = obj.getSwappedSides(doSwap);

			Constraint.switchSides( sides.a, sides.b, sides.a.forEachTerm );
			return obj;
		};
		result = func( "x = y" );
		equal( "0", result.leftSide.toString() );
		equal( "-x + y", result.rightSide.toString() );
		
		result = func( "x + 4 + 2 = y + c + 3c" );
		equal( "0", result.leftSide.toString() );
		equal( "4c - x + y - 6", result.rightSide.toString() );
	});
	test( "test Constraint.prototype.moveTypeToOneSide() with different comparisons", function(){
		var func = function( str, varsSide, constantsSide ){
			return Constraint.parse(str).moveTypeToOneSide(varsSide, constantsSide).toString();
		};
		equal( func( "a = 30", "right", "left" ), "-30 = -a" );
		equal( func( "a >= 30", "right", "left" ), "-30 >= -a" );
		equal( func( "a > 30", "right", "left" ), "-30 > -a" );
		equal( func( "a < 30", "right", "left" ), "-30 < -a" );
		equal( func( "a <= 30", "right", "left" ), "-30 <= -a" );
	});
	test( "test Constraint.prototype.moveTypeToOneSide() with two terms", function(){		
		var func = function( str, varsSide, constantsSide ){
			return Constraint.parse(str).moveTypeToOneSide(varsSide, constantsSide).toString();
		};
		var str = "a <= 30";
		equal( func( str, "left", null ), "a <= 30" );
		equal( func( str, null, "right" ), "a <= 30" );
		equal( func( str, "left", "right" ), "a <= 30" );
		
		equal( func( str, "right", null ), "0 <= -a + 30" );
		equal( func( str, null, "left" ), "a - 30 <= 0" );
		equal( func( str, "right", "left" ), "-30 <= -a" );
	});
	test( "test Constraint.prototype.moveTypeToOneSide() with 3+ terms", function(){
		var func = function( str, varsSide, constantsSide ){
			return Constraint.parse(str).moveTypeToOneSide(varsSide, constantsSide).toString();
		};
		var str = "a + b + d <= 30 + a + 5b + 2 - c";
		equal( func( str, "left", null ), "-4b + c + d <= 32" );
		equal( func( str, "right", null ), "0 <= 4b - c - d + 32" );
		equal( func( str, "left", "right" ), "-4b + c + d <= 32" );
		
		equal( func( str, null, "right" ), "a + b + d <= a + 5b - c + 32" );
		equal( func( str, null, "left" ), "a + b + d - 32 <= a + 5b - c" );
		equal( func( str, "right", "left" ), "-32 <= 4b - c - d" );
	});
	test( "test Constraint.prototype.inverse()", function(){
		var func = function(str){
			return Constraint.parse(str).inverse().toString();
		};
		equal( func( "x < 2" ), "-x >= -2");
		equal( func( "a + b < 2 - 40c" ), "-a - b >= 40c - 2");
		equal( func( "-a <= -2" ), "a > 2");
		equal( func( "5a >= 2b" ), "-5a < -2b");
		equal( func( "4a + b = 2" ), "-4a - b = -2");
	});
	test( "test Constraint.prototype.removeStrictInequality()", function(){
		var func = function(str){
			return Constraint.parse(str).removeStrictInequality().toString();
		};
		equal( func("x > 0"), "x >= 0.000001" );
		equal( func("x < 0"), "x <= -0.000001" );
	});
	test( "test Constraint.prototype.normalize()", function(){
		var func = function( str ){
			return Constraint.parse(str).normalize().toString();
		};
		equal( func( "a - 10 <= 20" ), "a <= 30" );
		equal( func( "-1 + a < 21" ), "a <= 21.999999" );
		equal( func( "-1 + a > 21" ), "a >= 22.000001" );
		equal( func( "a + b - 10 >= 0" ), "a + b >= 10" );
	});
	test( "test Constraint.prototype.convertToStandardMaxForm()", function(){
		var func = function(str){
			return Constraint.parse(str).convertToStandardMaxForm().toString();
		};
		equal( func( "x = 1" ), "x = 1" );
		equal( func( "x = -1" ), "-x = 1" );
		equal( func( "x >= 1" ), "-slack + x = 1" );
		equal( func( "x <= 1" ), "slack + x = 1" );
		equal( func( "a + 3b < 20" ), "a + 3b + slack = 19.999999" );
		equal( func( "a - 2b - c + 20 < 4 + 4c" ), "-a + 2b + 5c - slack = 16" );
	});
	test( "test Constraint.prototype.createRowOfValues", function(){
		var func = function( str, arr ){
			return Constraint.parse(str).createRowOfValues( arr );
		};
		deepEqual( func("5a + 6b = 2", ["a", "b"]), [5, 6] );
		deepEqual( func("5a + 6b = 2", ["b", "a"]), [6, 5] );
		deepEqual( func("5a + 6b = 2", [ "c", "b", "a"]), [0, 6, 5] );
		deepEqual( func("5a + 6b = 2c", [ "c", "b", "a"]), [2, 6, 5] );
		deepEqual( func("5a + 6b = 2c + 55", [ "c", "b", "a", "1" ]), [2, 6, 5, 55] );
	});
};











