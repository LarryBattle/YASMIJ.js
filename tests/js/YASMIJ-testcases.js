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
	test( "test Equation.convertStrToTermArray() with positive terms", function(){
		var func = Equation.convertStrToTermArray;
		
		deepEqual( func(""), [0, "1" ] );
		deepEqual( func("0"), [0, "1"] );
		deepEqual( func("1"), [1, "1"] );
		deepEqual( func("110"), [110, "1"] );
		
		deepEqual( func("a"), [1, "a"] );
		deepEqual( func("1a2"), [1, "a2"] );
		deepEqual( func("143a2"), [143, "a2"] );
		deepEqual( func("var"), [1, "var"] );
		
		deepEqual( func("4.4var"), [4.4, "var"] );
		deepEqual( func("1.23e-32var"), [1.23e-32, "var"] );
		deepEqual( func("1.23e32var"), [1.23e32, "var"] );
		
		deepEqual( func("1.23e+32var"), [1.23e32, "var"] );
	});
	test( "test Equation.convertStrToTermArray() with negative terms", function(){
		var func = Equation.convertStrToTermArray;
		
		deepEqual( func("-0"), [0, "1"] );
		deepEqual( func("-1"), [-1, "1"] );
		deepEqual( func("-110"), [-110, "1"] );
		deepEqual( func("-a"), [-1, "a"] );
		deepEqual( func("-1a2"), [-1, "a2"] );
		deepEqual( func("-143a2"), [-143, "a2"] );
		deepEqual( func("-var"), [-1, "var"] );
		
		deepEqual( func("-4.4var"), [-4.4, "var"] );
		deepEqual( func("-1.23e-32var"), [-1.23e-32, "var"] );
		deepEqual( func("-1.23e32var"), [-1.23e32, "var"] );
		
		deepEqual( func("-1.23e+32var"), [-1.23e32, "var"] );
	});
	test( "test Equation.convertStrToTermArray() with positive 'e' terms", function(){
		var func = Equation.convertStrToTermArray;
		
		deepEqual( func("e"), [1, "e"] );
		deepEqual( func("1e"), [1, "e"] );
		deepEqual( func("23e"), [23, "e"] );
		
		deepEqual( func("4.4e"), [4.4, "e"] );
		deepEqual( func("1.23e-32e"), [1.23e-32, "e"] );
		deepEqual( func("1.23e32e"), [1.23e32, "e"] );
		
		deepEqual( func("1.23e+32e"), [1.23e32, "e"] );
	});
	test( "test Equation.convertStrToTermArray() with negative 'e' terms", function(){
		var func = Equation.convertStrToTermArray;
		
		deepEqual( func("-e"), [-1, "e"] );
		deepEqual( func("-1e"), [-1, "e"] );
		deepEqual( func("-44e"), [-44, "e"] );
		
		deepEqual( func("-4.4e"), [-4.4, "e"] );
		deepEqual( func("-1.23e-32e"), [-1.23e-32, "e"] );
		deepEqual( func("-1.23e32e"), [-1.23e32, "e"] );
		
		deepEqual( func("-1.23e+32e"), [-1.23e32, "e"] );
	});
	test( "test Equation.getTermsFromStr() with positive terms", function(){
		var func = Equation.getTermsFromStr;
		
		deepEqual( func("a"), ["a"] );
		deepEqual( func("+a + b + c"), ["a","b", "c"] );
		deepEqual( func("3a + 34b + 2.3c + 1.3e23d"), ["3a","34b", "2.3c", "1.3e23d"] );
		deepEqual( func("3e3a + 1e+34b + 2.3e+30c + 1.3e+23d"), ["3e3a", "1e+34b", "2.3e+30c", "1.3e+23d"] );
		deepEqual( func("3e-3a + 1e-34b + 2.3e-30c + 1.3e-23d"), ["3e-3a", "1e-34b", "2.3e-30c", "1.3e-23d"] );
	});
	test( "test Equation.getTermsFromStr() with negative terms", function(){
		var func = Equation.getTermsFromStr;
		
		deepEqual( func("-a"), ["-a"] );
		deepEqual( func("-a - b -c"), ["-a","-b", "-c"] );
		deepEqual( func("-3a -34b -2.3c -1.3e23d"), ["-3a","-34b", "-2.3c", "-1.3e23d"] );
		deepEqual( func("-3e3a -1e+34b -2.3e+30c -1.3e+23d"), ["-3e3a", "-1e+34b", "-2.3e+30c", "-1.3e+23d"] );
		deepEqual( func("-3e-3a -1e-34b -2.3e-30c -1.3e-23d"), ["-3e-3a", "-1e-34b", "-2.3e-30c", "-1.3e-23d"] );
	});
	test( "test Equation.getTermsFromStr() with numbers", function(){
		var func = Equation.getTermsFromStr;
		
		deepEqual( func("-a + b -c +d"), ["-a","b","-c","d"] );
	});
	test( "test Equation.convertExpressionToObject() with valid input", function(){
		var func = Equation.convertExpressionToObject;
		
		deepEqual( func( "a + 20b + 10" ), {"1":10,"b":20,"a":1} );
		deepEqual( func( "a + b -c + 4e" ), {"e":4,"c":-1,"b":1,"a":1} );
		deepEqual( func( "-a - 1b -20c - 1.23e43d -1e-13e" ), { "e":-1e-13, "d":-1.23e+43,"c":-20,"b":-1,"a":-1} );
		deepEqual( func( "+a + 1b +20c + 1.23e43d +1e-13e" ), { "e":1e-13, "d":1.23e+43,"c":20,"b":1,"a":1} );
	});
	test( "test Equation.convertExpressionToObject() for single number", function(){
		var func = Equation.convertExpressionToObject;
		deepEqual(func( "" ), {1:0} );
		deepEqual(func( "1" ), {1:1} );
		deepEqual(func( "-20" ), {1:-20} );
		deepEqual(func( "-423.12345" ), {1:-423.12345} );
		deepEqual(func( "-1.23e-34" ), {1:-1.23e-34} );
	});
	test( "test Equation.convertExpressionToObject() for single variables", function(){
		var func = Equation.convertExpressionToObject;
		deepEqual(func( "x" ), {x:1} );
		deepEqual(func( "-x" ), {x:-1} );
		deepEqual(func( "+x" ), {x:1} );
		deepEqual(func( "1x" ), {x:1} );
		deepEqual(func( "-1x" ), {x:-1} );
		deepEqual(func( "-2x" ), {x:-2} );
		deepEqual(func( "-20.2x" ), {x:-20.2} );
		deepEqual(func( "-20.000042x" ), {x:-20.000042} );
		deepEqual(func( "-20e34x" ), {x:-20e34} );
		deepEqual(func( "-1.23e-34x" ), {x:-1.23e-34} );
	});
	test( "test Equation.convertExpressionToObject() for numbers and variables", function(){
		var func = Equation.convertExpressionToObject;
		deepEqual(func( "1 + x" ), {x:1, 1:1} );
		deepEqual(func( "x + 1" ), {x:1, 1:1} );
		deepEqual(func( "-x - 1" ), {x:-1, 1:-1} );
		deepEqual(func( "-1 -x" ), {x:-1, 1:-1} );
		deepEqual(func( "-20.2x + 2.4y +10e30" ), {x:-20.2, y:2.4, 1:10e30} );
		deepEqual(func( "-20e34x + 23 - 4 - 4x + 1" ), {x:-2e+35, 1:20} );
	});
	test("test Equation.parse() with invalid input", function(){
		var func = Equation.parse;
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
	test("test Equation.parse() with valid expressions", function(){
		var func = Equation.parse;
		deepEqual( func( "10x1 -2x2 - 10" ), {lhs:{"x1":10,"x2":-2, "1":-10}} );
	});
	test("test Equation.parse() with different compares", function(){
		var func = Equation.parse;
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