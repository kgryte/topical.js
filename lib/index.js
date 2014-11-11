/**
*
*	TOPICAL
*
*
*	DESCRIPTION:
*		- PubSub library.
*
*
*	NOTES:
*		[1]
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com.
*
*/

'use strict';

// MODULES //

var // Event-emitter class:
	EventEmitter = require( 'events' ).EventEmitter,

	// Validates if a value is an integer:
	isInteger = require( 'validate.io-integer' ),

	// Validates if a value is an object:
	isObject = require( 'validate.io-object' );


// FUNCTIONS //

/**
* FUNCTION: createTopic( options )
*	Creates a new topic.
*
* @private
* @param {Object} options - topic options
* @returns {Object} topic
*/
function createTopic( options ) {
	var max = Number.MAX_VALUE,
		duplicates = false;
	if ( !options.hasOwnProperty( 'max' )  ) {
		options.max = max;
	} else {
		max = options.max;
	}
	if ( !options.hasOwnProperty( 'duplicates' ) ) {
		options.duplicates = duplicates;
	} else {
		duplicates = options.duplicates;
	}
	if ( !isInteger( max ) || max < 0 ) {
		throw new TypeError( 'createTopic()::invalid option. Max subscribers must be an integer greater than or equal to 0.' );
	}
	if ( typeof duplicates !== 'boolean' ) {
		throw new TypeError( 'createTopic()::invalid option. Duplicates flag must be a boolean.' );
	}
	return {
		'subscribers': [],
		'options': options
	};
} // end FUNCTION createTopic()


// TOPICAL //

/**
* FUNCTION: Topical()
*	Topical constructor.
*
* @constructor
* @returns {Topical} Topical instance
*/
function Topical() {
	if ( !( this instanceof Topical ) ) {
		return new Topical();
	}
	EventEmitter.call( this );
	this._topics = {};
	this._listing = [];
	return this;
} // end FUNCTION Topical()

/**
* Create a prototype which inherits from the parent prototype.
*/
Topical.prototype = Object.create( EventEmitter.prototype );

/**
* Set the constructor.
*/
Topical.prototype.constructor = Topical;

/**
* METHOD: topics()
*	Returns the list of topics.
*
* @return {Array} list of topics
*/
Topical.prototype.topics = function() {
	return Object.keys( this._topics );
}; // end METHOD topics()

/**
* METHOD: add( topic[, options] )
*	Adds a topic.
*
* @param {String} topic - topic to add
* @param {Object} [options] - topic options
* @returns {Topical} Topical instance
*/
Topical.prototype.add = function( topic, options ) {
	var topics = this._topics;
	if ( typeof topic !== 'string' ) {
		throw new TypeError( 'add()::invalid input argument. Topic must be a string.' );
	}
	if ( topics.hasOwnProperty( topic ) ) {
		return this;
	}
	if ( arguments.length < 2 ) {
		options = {};
	} else {
		if ( !isObject( options ) ) {
			throw new TypeError( 'add()::invalid input argument. Options must be an object.' );
		}
	}
	topics[ topic ] = createTopic( options );
	this.emit( 'add', {
		'topic': topic,
		'data': null
	});
	return this;
}; // end METHOD add()

/**
* METHOD: remove( topic )
*	Removes a topic and all associated subscribers.
*
* @param {String|RegExp} topic - topic or topic pattern to remove
* @returns {Topical} Topical instance
*/
Topical.prototype.remove = function( topic ) {
	var topics = this._topics,
		type = typeof topic,
		matches = [],
		keys,
		key;
	if ( type !== 'string' && !( topic instanceof RegExp ) ) {
		throw new TypeError( 'remove()::invalid input argument. Topic must be either string or regular expression.' );
	}
	if ( type === 'string' ) {
		if ( !topics.hasOwnProperty( topic ) ) {
			return this;
		}
		matches.push( topic );
	} else {
		keys = Object.keys( topics );
		for ( var i = 0; i < keys.length; i++ ) {
			key = keys[ i ];
			if ( topic.test( key ) ) {
				matches.push( key );
			}
		}
	}
	for ( var j = 0; j < matches.length; j++ ) {
		topic = matches[ j ];
		delete topics[ topic ];
		this.emit( 'remove', {
			'topic': topic,
			'data': null
		});
	}
	return this;
}; // end METHOD remove()

/**
* METHOD: list( clbk )
*	Subscribes a callback to public broadcasts.
*
* @param {Function} clbk - callback to subscribe
* @returns {Topical} Topical instance
*/
Topical.prototype.list = function( clbk ) {
	var list = this._listing,
		idx;
	if ( typeof clbk !== 'function' ) {
		throw new TypeError( 'list()::invalid input argument. Must provide a function.' );
	}
	idx = list.indexOf( clbk );
	if ( idx === -1 ) {
		list.push( clbk );
		this.emit( 'list', {
			'topic': null,
			'data': clbk
		});
	}
	return this;
}; // end METHOD list()

/**
* METHOD: unlist( clbk )
*	Unsubscribes a callback from public broadcasts.
*
* @param {Function} clbk - callback to unsubscribe
* @returns {Topical} Topical instance
*/
Topical.prototype.unlist = function( clbk ) {
	var list = this._listing,
		idx;
	if ( typeof clbk !== 'function' ) {
		throw new TypeError( 'unlist()::invalid input argument. Must provide a function.' );
	}
	idx = list.indexOf( clbk );
	if ( idx !== -1 ) {
		list.splice( idx, 1 );
		this.emit( 'unlist', {
			'topic': null,
			'data': clbk
		});
	}
	return this;
}; // end METHOD unlist()

/**
* METHOD: subscribe( topic, clbk )
*	Subscribes a callback to a topic.
*
* @param {String|RegExp} topic - topic or topic pattern to which to subscribe
* @param {Function} clbk - callback to subscribe
* @returns {Topical} Topical instance
*/
Topical.prototype.subscribe = function( topic, clbk ) {
	var topics = this._topics,
		type = typeof topic,
		matches = [],
		keys,
		key,
		funcs,
		opts,
		idx,
		t;

	if ( type !== 'string' && !( topic instanceof RegExp ) ) {
		throw new TypeError( 'subscribe()::invalid input argument. Topic must be a string or regular expression.' );
	}
	if ( typeof clbk !== 'function' ) {
		throw new TypeError( 'subscribe()::invalid input argument. Callback must be a function.' );
	}
	if ( type === 'string' ) {
		// Have we seen this topic before?
		if ( !topics.hasOwnProperty( topic ) ) {
			this.emit( 'error', {
				'topic': topic,
				'data': 'Unknown topic.'
			});
			return this;
		}
		matches.push( topic );
	} else {
		keys = Object.keys( topics );
		for ( var i = 0; i < keys.length; i++ ) {
			key = keys[ i ];
			if ( topic.test( key ) ) {
				matches.push( key );
			}
		}
	}
	for ( var j = 0; j < matches.length; j++ ) {
		topic = matches[ j ];
		t = topics[ topic ];
		funcs = t.subscribers;
		opts = t.options;
		if ( !opts.duplicates ) {
			// Ensure that a callback is only called once per topic publish event...
			idx = funcs.indexOf( clbk );
			if ( idx !== -1 ) {
				continue;
			}
		}
		if ( opts.max === funcs.length ) {
			this.emit( 'error', {
				'topic': topic,
				'data': 'Maximum number of subscribers exceeded.'
			});
			continue;
		}
		funcs.push( clbk );
		this.emit( 'subscribe', {
			'topic': topic,
			'data': clbk
		});
	}
	return this;
}; // end METHOD subscribe()

/**
* METHOD: unsubscribe( topic, clbk )
*	Unsubscribes a callback from a topic.
*
* @param {String|RegExp} topic - topic or topic pattern from which to unsubscribe
* @param {Function} clbk - callback to unsubscribe
* @returns {Topical} Topical instance
*/
Topical.prototype.unsubscribe = function( topic, clbk ) {
	var topics = this._topics,
		type = typeof topic,
		matches = [],
		flg = false,
		keys,
		key,
		funcs;

	if ( type !== 'string' && !( topic instanceof RegExp ) ) {
		throw new TypeError( 'unsubscribe()::invalid input argument. Topic must be a string or regular expression.' );
	}
	if ( typeof clbk !== 'function' ) {
		throw new TypeError( 'unsubscribe()::invalid input argument. Callback must be a function.' );
	}
	if ( type === 'string' ) {
		if ( !topics.hasOwnProperty( topic ) ) {
			// No topic...
			return this;
		}
		matches.push( topic );
	} else {
		keys = Object.keys( topics );
		for ( var i = 0; i < keys.length; i++ ) {
			key = keys[ i ];
			if ( topic.test( key ) ) {
				matches.push( key );
			}
		}
	}
	for ( var j = 0; j < matches.length; j++ ) {
		flg = false;
		topic = matches[ j ];
		funcs = topics[ topic ].subscribers;
		for ( var k = 0; k < funcs.length; k++ ) {
			if ( clbk === funcs[ k ] ) {
				// Remove the callback...
				funcs.splice( k, 1 );
				// Reset the index:
				k = k - 1;
				// Flag that we have unsubscribed:
				flg = true;
			}
		}
		if ( flg ) {
			this.emit( 'unsubscribe', {
				'topic': topic,
				'data': clbk
			});
		}
	}
	return this;
}; // end METHOD unsubscribe()

/**
* METHOD: once( topic, clbk )
*	Subscribes a callback to a topic and unsubscribes the callback after its first invocation.
*
* @param {String} topic - topic to which to subscribe
* @param {Function} clbk - callback to subscribe
* @returns {Topical} Topical instance
*/
Topical.prototype.once = function( topic, clbk ) {
	var self = this,
		topics = this._topics,
		funcs;
	if ( typeof topic !== 'string' ) {
		throw new TypeError( 'once()::invalid input argument. Topic must be a string.' );
	}
	if ( typeof clbk !== 'function' ) {
		throw new TypeError( 'once()::invalid input argument. Callback must be a function.' );
	}

	// Have we seen this topic before?
	if ( !topics.hasOwnProperty( topic ) ) {
		this.emit( 'error', {
			'topic': topic,
			'data': 'Unknown topic.'
		});
		return this;
	}

	// Check if the callback is already subscribed...
	funcs = topics[ topic ].subscribers;
	for ( var i = 0; i < funcs.length; i++ ) {
		if ( clbk === funcs[ i ] ) {
			// Callback already subscribed. Remove it...
			funcs.splice( i, 1 );
			// Reset the index:
			i = i - 1;
		}
	}
	if ( topics[ topic ].options.max === funcs.length ) {
		this.emit( 'error', {
			'topic': topic,
			'data': 'Maximum number of subscribers exceeded.'
		});
		return this;
	}
	funcs.push( wrapper );
	this.emit( 'subscribe', {
		'topic': topic,
		'data': null
	});
	return this;

	/**
	* FUNCTION: wrapper( event )
	*	Wraps a callback to ensure call `once` behavior.
	*
	* @private
	* @param {*} event - emitted event
	*/
	function wrapper( event ) {
		self.on( 'publish', unsubscribe );
		clbk( event );
	}

	/**
	* FUNCTION: unsubscribe()
	*	Unsubscribes the subscriber.
	*
	* @private
	*/
	function unsubscribe() {
		self.removeListener( 'publish', unsubscribe );
		self.unsubscribe( topic, wrapper );
	}
}; // end METHOD once()

/**
* METHOD: publish( topic, event )
*	Publishes an event on a specified topic.
*
* @param {String} topic - topic to which the event pertains
* @param {*} event - topic event
* @returns {Topical} Topical instance
*/
Topical.prototype.publish = function( topic, event ) {
	var topics = this._topics,
		funcs;
	if ( typeof topic !== 'string' ) {
		throw new TypeError( 'publish()::invalid input argument. Topic must be a string.' );
	}
	if ( arguments.length !== 2 ) {
		throw new Error( 'publish()::insufficient input arguments. Must provide an event.' );
	}
	if ( !topics.hasOwnProperty( topic ) ) {
		return this;
	}
	funcs = topics[ topic ].subscribers;
	for ( var i = 0; i < funcs.length; i++ ) {
		funcs[ i ]( event );
	}
	if ( funcs.length ) {
		this.emit( 'publish', {
			'topic': topic,
			'data': null
		});
	}
	return this;
}; // end METHOD publish()

/**
* METHOD: broadcast( event )
*	Broadcasts an event to all publicly listed subscribers.
*
* @param {*} event - event to broadcast
* @returns {Topical} Topical instance
*/
Topical.prototype.broadcast = function( event ) {
	var list = this._listing;
	if ( !arguments.length ) {
		throw new Error( 'broadcast()::insufficient input arguments. Must provide an event to broadcast.' );
	}
	for ( var i = 0; i < list.length; i++ ) {
		list[ i ]( event );
	}
	if ( list.length ) {
		this.emit( 'broadcast', {
			'topic': null,
			'data': null
		});
	}
	return this;
}; // end METHOD broadcast()


// EXPORTS //

module.exports = new Topical();
module.exports.ctor = Topical;
