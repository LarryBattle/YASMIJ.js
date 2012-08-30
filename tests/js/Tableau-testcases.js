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
	// test( "test Tableau.parse()", function(){
		// ok(1);
	// });
	test( "test Tableau.parse()", function(){
		var inputObj = Input.parse( "maximize", "a + b - 10", ["a<34", "b <= 4", "a + b > 2"] );
		var func = function( inputObj ){
			return Tableau.parse( inputObj ).toString();
		};
		ok(1);
		//equal( func( inputObj ), "" );
	});
};
