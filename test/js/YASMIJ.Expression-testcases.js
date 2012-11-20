/*
* @project {{=it.name}}
* @author Larry Battle
* @license {{=it.license.overview}}
* @date 07/08/2012
*/
tests.runExpressionTests = function(){
	module( "YASMIJ.Expression Class: Checking input" );
	test( "test YASMIJ.Expression.hasComparison() with 1 compare", function(){
		var func = YASMIJ.Expression.hasComparison;
		equal( func( "a < b" ), true );
		equal( func( "a > b" ) , true );
		equal( func( "a = b" ) , true );
		equal( func( "a => b" ), true );
		equal( func( "a << b" ), true );
	});
	test( "test YASMIJ.Expression.hasExcludedOperations() with valid YASMIJ.Expressions.", function(){
		var func = YASMIJ.Expression.hasExcludedOperations;
		
		equal( func( "" ), false );
		equal( func( "-a" ), false );
		equal( func( "+a" ), false );
		equal( func( "+a - b" ), false );
		equal( func( "a + b" ), false );
	});
	test( "test YASMIJ.Expression.hasExcludedOperations() with invalid YASMIJ.Expressions.", function(){
		var func = YASMIJ.Expression.hasExcludedOperations;
		
		equal( func( "a * b" ), true );
		equal( func( "a / b + c" ), true );
		equal( func( "a % b" ), true );
	});
	test( "test YASMIJ.Expression.hasIncompleteBinaryOperator() with valid YASMIJ.Expressions.", function(){
		var func = YASMIJ.Expression.hasIncompleteBinaryOperator;
		
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
	test( "test YASMIJ.Expression.hasIncompleteBinaryOperator() with invalid YASMIJ.Expressions.", function(){
		var func = YASMIJ.Expression.hasIncompleteBinaryOperator;
		
		equal( func( "a b" ), true );
		equal( func( "a b-" ), true );
		equal( func( "a b+" ), true );
		equal( func( "++a b" ), true );
		equal( func( "+a+" ), true );
	});
	test( "test that YASMIJ.Expression.getErrorMessage() ", function(){	
		var func = YASMIJ.Expression.getErrorMessage;
		ok( !func( "a+b" ) );
		ok( func( "a b" ) );
		ok( func( "a * b" ) );
		ok( func( "a + b+" ) );
	});
	module( "YASMIJ.Expression Class: input conversion" );
	test( "test YASMIJ.Expression.extractComponentsFromVariable() with positive terms", function(){
		var func = YASMIJ.Expression.extractComponentsFromVariable;
		
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
	test( "test YASMIJ.Expression.extractComponentsFromVariable() with negative terms", function(){
		var func = YASMIJ.Expression.extractComponentsFromVariable;
		
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
	test( "test YASMIJ.Expression.extractComponentsFromVariable() with positive 'e' terms", function(){
		var func = YASMIJ.Expression.extractComponentsFromVariable;
		
		deepEqual( func("e"), [1, "e"] );
		deepEqual( func("1e"), [1, "e"] );
		deepEqual( func("23e"), [23, "e"] );
		
		deepEqual( func("4.4e"), [4.4, "e"] );
		deepEqual( func("1.23e-32e"), [1.23e-32, "e"] );
		deepEqual( func("1.23e32e"), [1.23e32, "e"] );
		
		deepEqual( func("1.23e+32e"), [1.23e32, "e"] );
	});	
	test( "test YASMIJ.Expression.extractComponentsFromVariable() with negative 'e' terms", function(){
		var func = YASMIJ.Expression.extractComponentsFromVariable;
		
		deepEqual( func("-e"), [-1, "e"] );
		deepEqual( func("-1e"), [-1, "e"] );
		deepEqual( func("-44e"), [-44, "e"] );
		
		deepEqual( func("-4.4e"), [-4.4, "e"] );
		deepEqual( func("-1.23e-32e"), [-1.23e-32, "e"] );
		deepEqual( func("-1.23e32e"), [-1.23e32, "e"] );
		
		deepEqual( func("-1.23e+32e"), [-1.23e32, "e"] );
	});
	test( "test YASMIJ.Expression.splitStrByTerms() with positive terms", function(){
		var func = YASMIJ.Expression.splitStrByTerms;
		
		deepEqual( func("a"), ["a"] );
		deepEqual( func("+a + b + c"), ["a","b", "c"] );
		deepEqual( func("3a + 34b + 2.3c + 1.3e23d"), ["3a","34b", "2.3c", "1.3e23d"] );
		deepEqual( func("3e3a + 1e+34b + 2.3e+30c + 1.3e+23d"), ["3e3a", "1e+34b", "2.3e+30c", "1.3e+23d"] );
		deepEqual( func("3e-3a + 1e-34b + 2.3e-30c + 1.3e-23d"), ["3e-3a", "1e-34b", "2.3e-30c", "1.3e-23d"] );
	});
	test( "test YASMIJ.Expression.splitStrByTerms() with negative terms", function(){
		var func = YASMIJ.Expression.splitStrByTerms;
		
		deepEqual( func("-a"), ["-a"] );
		deepEqual( func("-a - b -c"), ["-a","-b", "-c"] );
		deepEqual( func("-3a -34b -2.3c -1.3e23d"), ["-3a","-34b", "-2.3c", "-1.3e23d"] );
		deepEqual( func("-3e3a -1e+34b -2.3e+30c -1.3e+23d"), ["-3e3a", "-1e+34b", "-2.3e+30c", "-1.3e+23d"] );
		deepEqual( func("-3e-3a -1e-34b -2.3e-30c -1.3e-23d"), ["-3e-3a", "-1e-34b", "-2.3e-30c", "-1.3e-23d"] );
	});
	test( "test YASMIJ.Expression.splitStrByTerms() with numbers", function(){
		var func = YASMIJ.Expression.splitStrByTerms;
		
		deepEqual( func("-a + b -c +d"), ["-a","b","-c","d"] );
	});
	test( "test YASMIJ.Expression.convertExpressionToObject() with valid input", function(){
		var func = YASMIJ.Expression.convertExpressionToObject;
		
		deepEqual( func( "a + 20b + 10" ), {"1":10,"b":20,"a":1} );
		deepEqual( func( "a + b -c + 4e" ), {"e":4,"c":-1,"b":1,"a":1} );
		deepEqual( func( "-a - 1b -20c - 1.23e43d -1e-13e" ), { "e":-1e-13, "d":-1.23e+43,"c":-20,"b":-1,"a":-1} );
		deepEqual( func( "+a + 1b +20c + 1.23e43d +1e-13e" ), { "e":1e-13, "d":1.23e+43,"c":20,"b":1,"a":1} );
	});
	test( "test YASMIJ.Expression.convertExpressionToObject() for single number", function(){
		var func = YASMIJ.Expression.convertExpressionToObject;
		deepEqual(func( "" ), {1:0} );
		deepEqual(func( "1" ), {1:1} );
		deepEqual(func( "-20" ), {1:-20} );
		deepEqual(func( "-423.12345" ), {1:-423.12345} );
		deepEqual(func( "-1.23e-34" ), {1:-1.23e-34} );
	});
	test( "test YASMIJ.Expression.convertExpressionToObject() for single variables", function(){
		var func = YASMIJ.Expression.convertExpressionToObject;
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
	
	test( "test YASMIJ.Expression.convertExpressionToObject() for numbers and variables", function(){
		var func = YASMIJ.Expression.convertExpressionToObject;
		deepEqual(func( "1 + x" ), {x:1, 1:1} );
		deepEqual(func( "x + 1" ), {x:1, 1:1} );
		deepEqual(func( "-x - 1" ), {x:-1, 1:-1} );
		deepEqual(func( "-1 -x" ), {x:-1, 1:-1} );
		deepEqual(func( "-20.2x + 2.4y +10e30" ), {x:-20.2, y:2.4, 1:10e30} );
		deepEqual(func( "-20e34x + 23 - 4 - 4x + 1" ), {x:-2e+35, 1:20} );
	});	
	test( "test YASMIJ.Expression.encodeE", function(){
		var func = YASMIJ.Expression.encodeE;		
		equal( func("-1e+4-1.1e+4"), "-1e_plus_4-1.1e_plus_4" );
		equal( func("1e-4+1.1e-4"), "1e_sub_4+1.1e_sub_4" );
		
		equal( func("1e -4+1.1e-4"), "1e -4+1.1e_sub_4" );
		equal( func("1e-4+ 1.1e-4"), "1e_sub_4+ 1.1e_sub_4" );
	});
	test( "test YASMIJ.Expression.addSpaceBetweenTerms() with terms without spaces", function(){
		var func = YASMIJ.Expression.addSpaceBetweenTerms;
		
		equal( func( "1" ), "1" );
		equal( func( "1-a" ), "1 - a" );
		equal( func( "1+a" ), "1 + a" );
		equal( func( "a+b" ), "a + b" );
		equal( func( "a+1e3+e5" ), "a + 1e3 + e5" );
		equal( func( "-1e-4+e4+a4-d3" ), "- 1e-4 + e4 + a4 - d3" );
		equal( func( "-1.4e+4+23.9e4+a4-d3-3e+49" ), "- 1.4e+4 + 23.9e4 + a4 - d3 - 3e+49" );
	});
	test( "test YASMIJ.Expression.addSpaceBetweenTerms() with terms with spaces", function(){
		var func = YASMIJ.Expression.addSpaceBetweenTerms;
		
		equal( func( " 1 " ), "1" );
		equal( func( " 1 - a " ), "1 - a" );
		equal( func( "  1 + a  " ), "1 + a" );
		equal( func( " a +    b " ), "a + b" );
		equal( func( "  1e + 5 " ), "1e + 5" );
		equal( func( "  a + 1e3+e5" ), "a + 1e3 + e5" );
		equal( func( " - 1e-4   + e4+a4-d3" ), "- 1e-4 + e4 + a4 - d3" );
		equal( func( "-1.4e+ 4 +23.9e4+a4 -d3    -3e+49" ), "- 1.4e + 4 + 23.9e4 + a4 - d3 - 3e+49" );
	});
	test("test YASMIJ.Expression.getErrorMessage() with invalid input", function(){
		var func = YASMIJ.Expression.getErrorMessage;		
		
		ok(func("a < b < c"), "Error because there can only be one comparison.");
		ok(func("a == b"), "Error because == is not supported.");
		ok(func("a += b"), "Error because += is not supported.");
		
		ok(func("a <= b * -1"), "Error because * is not supported.");
	});
	test("test YASMIJ.Expression.parse() with valid YASMIJ.Expressions", function(){
		var func = function(str){
			return YASMIJ.Expression.parse(str).terms;
		};
		deepEqual( func( "10x1 -2x2 - 10" ), {"x1":10,"x2":-2, "1":-10} );
	});
	test("test the YASMIJ.Expression constructor", function(){
		var a = new YASMIJ.Expression();
		ok(a.terms);
	});
	test("test YASMIJ.Expression.prototype.getTermNames()", function(){
		var func = function(str){
			return YASMIJ.Expression.parse(str).getTermNames();
		};
		deepEqual( func( "10e-4x1" ), ["x1"] );
		deepEqual( func( "10x1 -2x2 - 10" ), [ "x1", "x2", "-10"] );
		deepEqual( func( "a + b -c - 10" ), ["a", "b", "c", "-10"] );
	});
	test("test YASMIJ.Expression.prototype.getTermNames(true) to exclude numbers", function(){
		var func = function(str){
			return YASMIJ.Expression.parse(str).getTermNames(true);
		};
		deepEqual( func( "10e-4x1" ), ["x1"] );
		deepEqual( func( "10x1 -2x2 - 10" ), [ "x1", "x2"] );
		deepEqual( func( "a + b -c - 10" ), ["a", "b", "c"] );
	});
	test( "test YASMIJ.Expression.termAtIndex() with variables", function(){
		var func = YASMIJ.Expression.termAtIndex;
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
	test( "test YASMIJ.Expression.termAtIndex() with constants", function(){
		var func = YASMIJ.Expression.termAtIndex;
		equal( func( 0, 10 ), "10" );
		equal( func( 0, -10 ), "-10" );
		equal( func( 2, 10 ), "+10" );
		equal( func( 4, -10 ), "-10" );
	});
	test( "test YASMIJ.Expression.prototype.toString()", function(){
		var func = function(str){
			return YASMIJ.Expression.parse(str).toString();
		};
		equal( func( "-a + 10" ), "-a + 10" );
		equal( func( "a + 10" ), "a + 10" );
		equal( func( "a -b + 10" ), "a - b + 10" );
		equal( func( "4c + c4" ), "4c + c4" );
	});
	test( "test YASMIJ.Expression.prototype.inverse()", function(){
		var func = function(str){
			return YASMIJ.Expression.parse(str).inverse().toString();
		};
		equal( func( "-a + 10" ), "a - 10" );
		equal( func( "a + 10" ), "-a - 10" );
		equal( func( "a -b + 10" ), "-a + b - 10" );
		equal( func( "4c + c4" ), "-4c - c4" );
	});
	test( "test YASMIJ.Expression.prototype.addTerm()", function(){
		var func = function( str, name, value ){
			return YASMIJ.Expression.parse(str).addTerm(name, value).toString();
		};
		equal( func( "a", "a", 1 ), "2a" );
		equal( func( "a", "a", -1 ), "0" );
		equal( func( "a", "b", 1 ), "a + b" );
		
		equal( func( "a", "a", 3 ), "4a");
		equal( func( "a", "b", 4 ), "a + 4b" );
		equal( func( "a + b", "b", -4 ), "a - 3b" );
	});
	test( "test YASMIJ.Expression.prototype.removeTerm()", function(){
		var func = function( str, name ){
			return YASMIJ.Expression.parse(str).removeTerm(name).toString();
		};
		equal( func( "a - 1", "a" ), "-1" );
		equal( func( "a - 1", 1 ), "a" );
		equal( func( "a - 1", "b" ), "a - 1" );
	});
	test( "test YASMIJ.Expression.prototype.forEachTerm", function(){
		var func = function(str, fn){
			return YASMIJ.Expression.parse(str).forEachTerm(fn);
		};
		var arr = []; 
		func("a + 10 - c", function(name){
			arr.push( name );
		});		
		equal( 3, arr.length );
	});
	test( "test YASMIJ.Expression.prototype.forEachVariable", function(){
		var func = function(str, fn){
			return YASMIJ.Expression.parse(str).forEachVariable(fn);
		};
		var arr = []; 
		func("a + 10 - c", function(name){
			arr.push( name );
		});		
		equal( 2, arr.length );
	});
	test( "test YASMIJ.Expression.prototype.forEachConstant", function(){
		var func = function(str, fn){
			return YASMIJ.Expression.parse(str).forEachConstant(fn);
		};
		var arr = []; 
		func("a + 10 - c", function(name){
			arr.push( name );
		});		
		equal( 1, arr.length );
	});
	test( "test YASMIJ.Expression.prototype.getCoeffients()", function(){
		var func = function( str, excludeNumbers, excludeSlack ){
			return YASMIJ.Expression.parse(str).getCoeffients(excludeNumbers, excludeSlack);
		};
		deepEqual( func("a + b + slack + 10" ), [1,1,1,10] );
		deepEqual( func("a + b + slack + 10", true ), [1,1,1] );
		deepEqual( func("a + b + slack + 10", true, true ), [1,1] );
	});
	test( "test YASMIJ.Expression.prototype.createRowOfValues()", function(){
		var func = function(str, termNames){
			return YASMIJ.Expression.parse(str).createRowOfValues( termNames );
		};
		deepEqual( func("a + b + 5", ["a"]), [1] );
		deepEqual( func("a + b + 5", ["b", "a"]), [1, 1] );
		deepEqual( func("a + b + 5", ["f", "a", "b", "1" ]), [0, 1, 1, 5] );
	});
};