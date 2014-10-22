var topical = require( './../lib' );

// Initialize a stats object:
var stats = {
	'topics': {},
	'broadcasts': 0,
	'public': 0
};

// Listeners...

topical.on( 'added', onAdd );
topical.on( 'removed', onRemove );
topical.on( 'subscribed', onSub );
topical.on( 'unsubscribed', onUnsub );
topical.on( 'listed', onList );
topical.on( 'unlisted', onUnlist );
topical.on( 'published', onPublish );
topical.on( 'broadcast', onBroadcast );

function onAdd( event ) {
	stats.topics[ event.topic ] = {
		'numSubscribers': 0,
		'numPublications': 0
	};
}
function onRemove( event ) {
	delete stats.topics[ event.topic ];
}
function onSub( event ) {
	stats.topics[ event.topic ].numSubscribers += 1;
}
function onUnsub( event ) {
	stats.topics[ event.topic ].numSubscribers -= 1;
}
function onList( event ) {
	stats.public += 1;
}
function onUnlist( event ) {
	stats.public -= 1;
}
function onPublish( event ) {
	stats.topics[ event.topic ].numPublications += 1;
}
function onBroadcast() {
	stats.broadcasts += 1;
}


// EXPORTS //

module.exports = stats;