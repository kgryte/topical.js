'use strict';

var topical = require( './../lib' ),
	comp1 = require( './component1.js' ),
	comp2 = require( './component2.js' ),
	stats = require( './stats.js' );

// Create some topics...
var topics = [
	'beep',
	'boop',
	'bap',
	'baz',
	'foo'
];

for ( var i = 0; i < topics.length; i++ ) {
	topical.add( topics[ i ] );
}

// Run the components:
comp1();
comp2();

// Simulate some chatter...
var vec = [ 0, 0.2, 0.4, 0.6, 0.8 ],
	rand,
	idx,
	topic,
	msg;

for ( var j = 0; j < 1000; j++ ) {
	rand = Math.random();
	if ( rand > 0.9 ) {
		topical.broadcast( 'The time is now ' + (new Date()).toString() + '...' );
		continue;
	}
	for ( var k = 0; k < vec.length; k++ ) {
		if ( vec[k] > rand ) {
			idx = k-1;
			break;
		}
	}
	topic = topics[ idx ];
	if ( rand > 0.5 ) {
		msg = 'bebop';
	} else {
		msg = 'woot';
	}
	topical.publish( topic, msg );
}

// Output the statistics:
console.log( stats );
