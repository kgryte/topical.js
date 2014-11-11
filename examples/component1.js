'use strict';

var topical = require( './../lib' );

module.exports = function component() {
	topical.subscribe( /^b.+p$/, onEvent );
};

function onEvent( event ) {
	console.log( event );
}
