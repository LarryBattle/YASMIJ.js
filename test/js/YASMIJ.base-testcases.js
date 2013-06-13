/*
* @project {{=it.name}}
* @author Larry Battle
* @license {{=it.license.overview}}
*/

tests.runBaseTests = function(){
	module( "YASMIJ.base Class" );

	test( "test YASMIJ.CONST", function(){
		var x = YASMIJ.CONST;
		ok(x);
		ok(x.STANDARD_MAX);
		ok(x.STANDARD_MIN);
		ok(x.NONSTANDARD_MAX);
		ok(x.NONSTANDARD_MIN);
	});
	test( "test YASMIJ.getErrors()", function(){
		var fn = YASMIJ.getErrors;
		ok( fn() );
		ok( fn({}) );
		ok( fn({type:{}, constraints: {} }) );
		ok( !fn({type:{}, constraints: {}, objective : "a+b" }) );
	});

};
