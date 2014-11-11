'use strict';

var topical = require( './../lib' );

module.exports = function component() {
	topical
		.list( onBroadcast )
		.subscribe( /^ba.+/, onEvent );
};

function onBroadcast( event ) {
	console.log( event );
}

function onEvent( event ) {
	console.log( event );
}
