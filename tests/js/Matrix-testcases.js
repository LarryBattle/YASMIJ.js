/*
* @project YASMIJ.js, "Yet another simplex method implementation in Javascript"
* @author Larry Battle
* @license MIT License <http://www.opensource.org/licenses/mit-license>
* @date 07/02/2012
*/

tests.runMatrixTests = function(){
	module( "Matrix Class" );
	test( "test Matrix.parse()", function(){
		var func = function(obj){
			return Matrix.parse(obj).toString();
		};
		equal( func(1), "1" );
		equal( func([1,2,3]), "1, 2, 3" );
		equal( func([[1,2,3],[1,2,3]]), "1, 2, 3\n1, 2, 3" );
	});
	test( "test Matrix.isArray()", function(){
		var func = Matrix.isArray;
		equal( func([]), true );
		equal( func([[]]), true );
		equal( func({}), false );
		equal( func(Math), false );
		equal( func(false), false );
	});
	test( "test Matrix.prototype.addRow()", function(){
		var func = function( obj, rowObj ){
			return Matrix.parse(obj).addRow(rowObj).toString();
		};
		equal( func( 1, 2 ), "1\n2" );
		equal( func( [1,2], [1,2] ), "1, 2\n1, 2" );
	});
	test( "test Matrix.prototype.getRow()", function(){
		var func = function( obj, i ){
			return Matrix.parse( obj ).getRow(i);
		};
		deepEqual(func([[1],[2]], 1), [2] );
	});
	test( "test Matrix.prototype.forEachRow()", function(){
		var func = function( obj, fn ){
			return Matrix.parse( obj ).forEachRow(fn);
		};
		var arr = [];
		func( [[1],[2],[3]], function(i,row){ 
			arr.push( row[0] ); 
		})
		deepEqual( arr, [1,2,3] );
	});
	test( "test Matrix.prototype.getColumn()", function(){
		var func = function( obj, j ){
			return Matrix.parse( obj ).getColumn( j );
		};
		deepEqual( func( [[1,2],[3,4]], 0 ), [1,3] );
	});
	test( "test Matrix.prototype.getElement()", function(){
		var func = function( obj, i, j ){
			return Matrix.parse( obj ).getElement(i, j);
		};
		equal( func( [[1,2],[3,4]], 0, 0 ), 1 );
		equal( func( [[1,2],[3,4]], 0, 1 ), 2 );
		equal( func( [[1,2],[3,4]], 1, 1 ), 4 );
	});
	test( "test Matrix.prototype.get()", function(){
		var func = function( obj, i, j ){
			return Matrix.parse( obj ).get( i, j );
		};
		equal( func( [[1,2],[3,4]], 1, 1), 4 );
		deepEqual( func( [[1,2],[3,4]], 1 ), [3,4] );
		deepEqual( func( [[1,2],[3,4]], null, 1 ), [2,4] );
	});
	test( "test Matrix.prototype.getMinElementInRow()", function(){
		var func = function(obj, i){
			return Matrix.parse(obj).getMinElementInRow( i );
		};
		deepEqual( func([-2,-1,0,1,2], 0), [0,-2] );
		deepEqual( func([2,1,-3], 0), [2,-3] );
	});
};