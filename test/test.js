
// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Module to be tested:
	topical = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'topical', function tests() {
	'use strict';

	it( 'should export a function', function test() {
		expect( topical ).to.be.a( 'function' );
	});

	it( 'should do something' );

});