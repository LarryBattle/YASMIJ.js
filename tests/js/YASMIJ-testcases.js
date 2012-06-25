/**
* @project YASMIJ.js
* @requires YASMIJ.js, Sinon.js, jQuery.js
*/
$(function(){

	module( "Equation Class" );
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
	test( "test Equation.hasOtherMathSigns() with valid expressions.", function(){
		var func = Equation.hasOtherMathSigns;
		
		equal( func( "" ), false );
		equal( func( "-a" ), false );
		equal( func( "+a" ), false );
		equal( func( "+a - b" ), false );
		equal( func( "a + b" ), false );
	});
	test( "test Equation.hasOtherMathSigns() with invalid expressions.", function(){
		var func = Equation.hasOtherMathSigns;
		
		equal( func( "a * b" ), true );
		equal( func( "a / b + c" ), true );
		equal( func( "a % b" ), true );
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
	test( "test that Equation.checkInput calls Equation.getErrorMessage", function(){	
		var stub = sinon.stub( Equation, 'getErrorMessage' );
		Equation.checkInput();
		ok( stub.called );
	});
	test( "test that Equation.parse calls Equation.checkInput ", function(){	
		var stub = sinon.stub( Equation, 'checkInput' );
		Equation.parse();
		ok( stub.called );
	});
	test( "test Equation.parse() for single number", function(){
		var func = Equation.parse;
		deepEqual(func( "" ), {lhs:{0:1}} );
		deepEqual(func( "1" ), {lhs:{1:1}} );
		deepEqual(func( "-20" ), {lhs:{1:-20}} );
		deepEqual(func( "-423.12345" ), {lhs:{1:-423.12345}} );
		deepEqual(func( "-1.23e-34" ), {lhs:{1:-1.23e-34}} );
	});
	test( "test Equation.parse() for single variables", function(){
		var func = Equation.parse;
		deepEqual(func( "x" ), {lhs:{x:1}} );
		deepEqual(func( "-x" ), {lhs:{x:-1}} );
		deepEqual(func( "+x" ), {lhs:{x:1}} );
		deepEqual(func( "1x" ), {lhs:{x:1}} );
		deepEqual(func( "-1x" ), {lhs:{x:-1}} );
		deepEqual(func( "-2x" ), {lhs:{x:-2}} );
		deepEqual(func( "-20.2x" ), {lhs:{x:-20.2}} );
		deepEqual(func( "-20.000042x" ), {lhs:{x:-20.000042}} );
		deepEqual(func( "-20.34ex" ), {lhs:{x:-20e34}} );
		deepEqual(func( "-1.23e-34x" ), {lhs:{x:-1.23e-34}} );
	});
	
	
	
	
	
	
	
	/*
	module( "Input Class" );
	test( "", function(){
		ok(1);
	});
	module( "Matrix Class" );
	test( "", function(){
		ok(1);
	});
	module( "Tableau Class" );
	test( "", function(){
		ok(1);
	});
	module( "Output Class" );
	test( "", function(){
		ok(1);
	});
	module( "Simplex Class" );
	test( "", function(){
		ok(1);
	});
	module( "Use Cases" );
	test( "test setting the simplex input", function(){
		var input = {};
		input.goal = "maximize";
		input.z = "x1+2x2-x3";
		input.constraints = [
			"2x1 + x2 + x3 <= 14",
			"4x1 + 2x2 + 3x3 <= 28",
			"2x1 + 5x2 + 5x3 <= 30"
		];
		var problem = new Simplex();
		problem.setInput( input );
		
		equal( problem.input.raw.z, input.z );
		deepEqual( problem.input.raw.constraints, input.constraints );
		
		// deepEqual( problem.input.z.valueOf(), [1,2,-1] );
		// deepEqual( problem.input.constraints.valueOf(), [
			// [2,1,1,"<=",14],[4,2,3,"<=",28],[2,5,5,"<=",30]
		// ] );
		// deepEqual( problem.input.constraints, input.constraints );
	});
	test( "", function(){
		ok(1);
	});
	test( "", function(){
		ok(1);
	});
	*/
});