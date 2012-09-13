/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/

tests.runTableauTests = function(){
	module( "Tableau Class" );
	
	test( "test Tableau.getErrorMessage()", function(){
		var func = function( obj ){
			return Tableau.getErrorMessage( obj );
		};
		var inputObj = Input.parse( "maximize", "a + b - 10", ["a<34", "b <= 4", "a + b > 2"] );
		ok( func( "12" ) );
		ok( func( {a:1} ) );
		ok( !func( inputObj ) );
	});
	test( "test Tableau.parse()", function(){
		var inputObj = Input.parse( "maximize", "a + b", ["a<34", "b <= 4", "a + b > 2"] );
		var func = function( inputObj ){
			return Tableau.parse( inputObj ).toString();
		};
			
		var result = "[a,b,slack1,slack2,slack3,Constant][[1,0,1,0,0,33.999999],[0,1,0,1,0,4],[1,1,0,0,-1,2.000001],[-1,-1,0,0,0,0]]";
		equal( func( inputObj ), result );
		
		inputObj = Input.parse( "maximize", "8x1 + 10x2 + 7x3", ["x1 + 3x2 + 2x3 <= 10", "x1 + 5x2 + x3 <= 8"] );
		result = "[slack1,slack2,x1,x2,x3,Constant][[1,0,1,3,2,10],[0,1,1,5,1,8],[0,0,-8,-10,-7,0]]";
		equal( func( inputObj ), result );
	});
	test( "test Tableau.prototype.getPivotPoint()", function(){
		var func = function(arr){
			return Tableau.getPivotPoint(Matrix.parse( arr ));
		};
		equal( func(""), null);
		equal( func([1,2,3]), null);
		equal( func([[1,2,3],[1,2,3]]), null);
		equal( func([[1,2,-3],[1,2,3]]), null);
		deepEqual( func([[1,2,3],[-1,2,3]]), {row:0, column:0});
		deepEqual( func( [[1,3,2,10],[1,5,1,8], [-8, -10, -7, 0]] ), {row:1, column:1});
	});
};
