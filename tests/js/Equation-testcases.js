/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/
tests.runEquationTests = function(){
	module( "Equation Class: Checking input" );
	test( "test Equation.hasManyCompares() with 1 compare", function(){
		var func = Equation.hasManyCompares;
		equal( func( "a < b" ), false );
		equal( func( "a > b" ) , false );
		equal( func( "a = b" ) , false );
		
		equal( func( "a >= b" ) , false );
		equal( func( "a <= b" ) , false );
		
		equal( func( "a = < b" ), true );
		equal( func( "a => b" ), true );
	});
	test( "test Equation.hasManyCompares() with many compares", function(){
		var func = Equation.hasManyCompares;
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
	test( "test Equation.hasIncompleteBinaryOperator() with valid expressions.", function(){
		var func = Equation.hasIncompleteBinaryOperator;
		
		equal( func( "" ), false );
		equal( func( "-1" ), false );
		equal( func( "1" ), false );
		equal( func( "+1" ), false );
		equal( func( "+1003" ), false );
		equal( func( " +13.23 " ), false );
		equal( func( "-a" ), false );
		equal( func( "+a" ), false );
		equal( func( "a" ), false );
		equal( func( "+a - b" ), false );
		equal( func( "a + b" ), false );
	});
	test( "test Equation.hasIncompleteBinaryOperator() with invalid expressions.", function(){
		var func = Equation.hasIncompleteBinaryOperator;
		
		equal( func( "a b" ), true );
		equal( func( "a < b c" ), true );
		equal( func( "a-" ), true );
		equal( func( "a+" ), true );
		equal( func( "a+ < c-" ), true );
		equal( func( "a+ b -= c" ), true );
		equal( func( "a+ b += c" ), true );
	});
	test( "test that Equation.getErrorMessage() ", function(){	
		var func = Equation.getErrorMessage;
		ok( !func( "a+b" ) );
		ok( func( "a b" ) );
		ok( func( "a * b" ) );
		ok( func( "a + b+" ) );
	});
	module( "Equation Class: input conversion" );
	test("test Equation.checkInput() with invalid input", function(){
		var func = Equation.checkInput;
		raises(function(){
			func( "a < b < c" );
		});
		raises(function(){
			func( "a == b" );
		});
		raises(function(){
			func( "a += b" );
		});
		raises(function(){
			func( "a <= b * -1" );
		});
	});
	test("test Equation.parseToObject() with valid expressions", function(){
		var func = Equation.parseToObject;
		deepEqual( func( "10x1 -2x2 - 10" ), {lhs:{terms:{"x1":10,"x2":-2, "1":-10}}} );
	});
	test("test Equation.parseToObject() with different compares", function(){
		var func = Equation.parseToObject;
		deepEqual( func( "2a + 3b <= 30" ), {
			lhs:{ "a":2,"b":3},
			rhs:{ "1":30 },
			relation:"<="
		});
		deepEqual( func( "2a - 30 >= 4 + a2" ), {
			lhs:{ "a":2, "1": -30 },
			rhs:{ "a2": 1, "1": 4 },
			relation:">="
		});
		deepEqual( func( "2a - 30 > 4 + a2" ), {
			lhs:{ "a":2, "1": -30 },
			rhs:{ "a2": 1, "1": 4 },
			relation:">"
		});
		deepEqual( func( "2a - 30 < 4 + a2" ), {
			lhs:{ "a":2, "1": -30 },
			rhs:{ "a2": 1, "1": 4 },
			relation:"<"
		});
		deepEqual( func( "2a + 12 = 2a + 12" ), {
			lhs:{ "a":2, "1": 12 },
			rhs:{ "a":2, "1": 12 },
			relation:"="
		});
	});
	test("test Equation.getVariableNames()", function(){
		ok(1);
	});
	test("test Equation.checkInput()", function(){
		var func = Equation.checkInput;
		ok(1);
	});
	test("test Equation.parse()", function(){
		ok(1);
	});
	test("test the Equation constructor", function(){
		var a = new Equation();
		ok(a);
	});
};