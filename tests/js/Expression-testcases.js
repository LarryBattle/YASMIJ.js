/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/08/2012
*/
tests.runExpressionTests = function(){
	module( "Expression Class: Checking input" );
	test( "test Expression.hasCompares() with 1 compare", function(){
		var func = Expression.hasCompares;
		equal( func( "a < b" ), true );
		equal( func( "a > b" ) , true );
		equal( func( "a = b" ) , true );
		equal( func( "a => b" ), true );
		equal( func( "a << b" ), true );
	});
	test( "test Expression.hasExcludedOperations() with valid expressions.", function(){
		var func = Expression.hasExcludedOperations;
		
		equal( func( "" ), false );
		equal( func( "-a" ), false );
		equal( func( "+a" ), false );
		equal( func( "+a - b" ), false );
		equal( func( "a + b" ), false );
	});
	test( "test Expression.hasExcludedOperations() with invalid expressions.", function(){
		var func = Expression.hasExcludedOperations;
		
		equal( func( "a * b" ), true );
		equal( func( "a / b + c" ), true );
		equal( func( "a % b" ), true );
	});
	test( "test Expression.hasIncompleteBinaryOperator() with valid expressions.", function(){
		var func = Expression.hasIncompleteBinaryOperator;
		
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
	test( "test Expression.hasIncompleteBinaryOperator() with invalid expressions.", function(){
		var func = Expression.hasIncompleteBinaryOperator;
		
		equal( func( "a b" ), true );
		equal( func( "a b-" ), true );
		equal( func( "a b+" ), true );
		equal( func( "++a b" ), true );
		equal( func( "+a+" ), true );
	});
	test( "test that Expression.getErrorMessage() ", function(){	
		var func = Expression.getErrorMessage;
		ok( !func( "a+b" ) );
		ok( func( "a b" ) );
		ok( func( "a * b" ) );
		ok( func( "a + b+" ) );
	});
	module( "Expression Class: input conversion" );
	test( "test Expression.extractComponentsFromVariable() with positive terms", function(){
		var func = Expression.extractComponentsFromVariable;
		
		deepEqual( func(""), [0, "1" ] );
		deepEqual( func("0"), [0, "1"] );
		deepEqual( func("1"), [1, "1"] );
		deepEqual( func("110"), [110, "1"] );
		
		deepEqual( func("0a"), [0, "a"] );
		deepEqual( func("a"), [1, "a"] );
		deepEqual( func("1a2"), [1, "a2"] );
		deepEqual( func("143a2"), [143, "a2"] );
		deepEqual( func("var"), [1, "var"] );
		
		deepEqual( func("4.4var"), [4.4, "var"] );
		deepEqual( func("1.23e-32var"), [1.23e-32, "var"] );
		deepEqual( func("1.23e32var"), [1.23e32, "var"] );
		
		deepEqual( func("1.23e+32var"), [1.23e32, "var"] );
	});
	test( "test Expression.extractComponentsFromVariable() with negative terms", function(){
		var func = Expression.extractComponentsFromVariable;
		
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
	test( "test Expression.extractComponentsFromVariable() with positive 'e' terms", function(){
		var func = Expression.extractComponentsFromVariable;
		
		deepEqual( func("e"), [1, "e"] );
		deepEqual( func("1e"), [1, "e"] );
		deepEqual( func("23e"), [23, "e"] );
		
		deepEqual( func("4.4e"), [4.4, "e"] );
		deepEqual( func("1.23e-32e"), [1.23e-32, "e"] );
		deepEqual( func("1.23e32e"), [1.23e32, "e"] );
		
		deepEqual( func("1.23e+32e"), [1.23e32, "e"] );
	});	
	test( "test Expression.extractComponentsFromVariable() with negative 'e' terms", function(){
		var func = Expression.extractComponentsFromVariable;
		
		deepEqual( func("-e"), [-1, "e"] );
		deepEqual( func("-1e"), [-1, "e"] );
		deepEqual( func("-44e"), [-44, "e"] );
		
		deepEqual( func("-4.4e"), [-4.4, "e"] );
		deepEqual( func("-1.23e-32e"), [-1.23e-32, "e"] );
		deepEqual( func("-1.23e32e"), [-1.23e32, "e"] );
		
		deepEqual( func("-1.23e+32e"), [-1.23e32, "e"] );
	});
	test( "test Expression.splitStrByTerms() with positive terms", function(){
		var func = Expression.splitStrByTerms;
		
		deepEqual( func("a"), ["a"] );
		deepEqual( func("+a + b + c"), ["a","b", "c"] );
		deepEqual( func("3a + 34b + 2.3c + 1.3e23d"), ["3a","34b", "2.3c", "1.3e23d"] );
		deepEqual( func("3e3a + 1e+34b + 2.3e+30c + 1.3e+23d"), ["3e3a", "1e+34b", "2.3e+30c", "1.3e+23d"] );
		deepEqual( func("3e-3a + 1e-34b + 2.3e-30c + 1.3e-23d"), ["3e-3a", "1e-34b", "2.3e-30c", "1.3e-23d"] );
	});
	test( "test Expression.splitStrByTerms() with negative terms", function(){
		var func = Expression.splitStrByTerms;
		
		deepEqual( func("-a"), ["-a"] );
		deepEqual( func("-a - b -c"), ["-a","-b", "-c"] );
		deepEqual( func("-3a -34b -2.3c -1.3e23d"), ["-3a","-34b", "-2.3c", "-1.3e23d"] );
		deepEqual( func("-3e3a -1e+34b -2.3e+30c -1.3e+23d"), ["-3e3a", "-1e+34b", "-2.3e+30c", "-1.3e+23d"] );
		deepEqual( func("-3e-3a -1e-34b -2.3e-30c -1.3e-23d"), ["-3e-3a", "-1e-34b", "-2.3e-30c", "-1.3e-23d"] );
	});
	test( "test Expression.splitStrByTerms() with numbers", function(){
		var func = Expression.splitStrByTerms;
		
		deepEqual( func("-a + b -c +d"), ["-a","b","-c","d"] );
	});
	test( "test Expression.convertExpressionToObject() with valid input", function(){
		var func = Expression.convertExpressionToObject;
		
		deepEqual( func( "a + 20b + 10" ), {"1":10,"b":20,"a":1} );
		deepEqual( func( "a + b -c + 4e" ), {"e":4,"c":-1,"b":1,"a":1} );
		deepEqual( func( "-a - 1b -20c - 1.23e43d -1e-13e" ), { "e":-1e-13, "d":-1.23e+43,"c":-20,"b":-1,"a":-1} );
		deepEqual( func( "+a + 1b +20c + 1.23e43d +1e-13e" ), { "e":1e-13, "d":1.23e+43,"c":20,"b":1,"a":1} );
	});
	test( "test Expression.convertExpressionToObject() for single number", function(){
		var func = Expression.convertExpressionToObject;
		deepEqual(func( "" ), {1:0} );
		deepEqual(func( "1" ), {1:1} );
		deepEqual(func( "-20" ), {1:-20} );
		deepEqual(func( "-423.12345" ), {1:-423.12345} );
		deepEqual(func( "-1.23e-34" ), {1:-1.23e-34} );
	});
	test( "test Expression.convertExpressionToObject() for single variables", function(){
		var func = Expression.convertExpressionToObject;
		deepEqual(func( "0x" ), {1:0} );
		
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
	
	test( "test Expression.convertExpressionToObject() for numbers and variables", function(){
		var func = Expression.convertExpressionToObject;
		deepEqual(func( "1 + x" ), {x:1, 1:1} );
		deepEqual(func( "x + 1" ), {x:1, 1:1} );
		deepEqual(func( "-x - 1" ), {x:-1, 1:-1} );
		deepEqual(func( "-1 -x" ), {x:-1, 1:-1} );
		deepEqual(func( "-20.2x + 2.4y +10e30" ), {x:-20.2, y:2.4, 1:10e30} );
		deepEqual(func( "-20e34x + 23 - 4 - 4x + 1" ), {x:-2e+35, 1:20} );
	});	
	test("test Expression.checkInput() with invalid input", function(){
		var func = Expression.checkInput;
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
	test("test Expression.parse() with valid expressions", function(){
		var func = function(str){
			return Expression.parse(str).terms;
		};
		deepEqual( func( "10x1 -2x2 - 10" ), {"x1":10,"x2":-2, "1":-10} );
	});
	test("test the Expression constructor", function(){
		var a = new Expression();
		ok(a.terms);
	});
	test("test Expression.prototype.getTermNames()", function(){
		var func = function(str){
			return Expression.parse(str).getTermNames();
		};
		deepEqual( func( "10e-4x1" ), ["x1"] );
		deepEqual( func( "10x1 -2x2 - 10" ), [ "x1", "x2", "-10"] );
		deepEqual( func( "a + b -c - 10" ), ["a", "b", "c", "-10"] );
	});
	test( "test Expression.termAtIndex() with variables", function(){
		var func = Expression.termAtIndex;
		equal( func( 0, "a", 1 ), "a" );
		equal( func( 0, "a", 3 ), "3a" );
		equal( func( 2, "a", 1 ), "+a" );
		equal( func( 2, "a", 2 ), "+2a" );
		equal( func( 4, "a", 40 ), "+40a" );
		
		equal( func( 0, "a", -1 ), "-a" );
		equal( func( 2, "a", -3 ), "-3a" );
		equal( func( 2, "a", -2 ), "-2a" );
		equal( func( 4, "a", -40 ), "-40a" );
	});
	test( "test Expression.termAtIndex() with constants", function(){
		var func = Expression.termAtIndex;
		equal( func( 0, 10 ), "10" );
		equal( func( 0, -10 ), "-10" );
		equal( func( 2, 10 ), "+10" );
		equal( func( 4, -10 ), "-10" );
	});
	test( "test Expression.prototype.toString()", function(){
		var func = function(str){
			return Expression.parse(str).toString();
		};
		equal( func( "-a + 10" ), "-a + 10" );
		equal( func( "a + 10" ), "a + 10" );
		equal( func( "a -b + 10" ), "a - b + 10" );
		equal( func( "4c + c4" ), "4c + c4" );
	});
};