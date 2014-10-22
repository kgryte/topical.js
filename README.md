Topical.js
==========
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coveralls-image]][coveralls-url] [![Dependencies][dependencies-image]][dependencies-url]

> JavaScript [PubSub](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) library.


## Installation

``` bash
$ npm install topical
```

## Usage

To use the module,

``` javascript
var topical = require( 'topical' );
```

The module exports both a singleton and a constructor. The singleton is convenient for a shared application broker. To create several distinct brokers, use the constructor.

``` javascript
var createBroker = topical.ctor;

// Create a new broker:
var broker = createBroker();
```

Brokers have the following methods...


#### topical.topics()

Returns the list of topics.

``` javascript
var topics = topical.topics();

console.log( topics );
// returns [...]
```


#### topical.add( topic[, options] )

Registers a new topic with the broker. A topic is configurable and has the following options:

*	__max__: `integer` value which specifies the maximum number of subscribers
	- 	default: `Number.MAX_VALUE`
*	__duplicates__: `boolean` value indicating whether duplicate subscribers are permitted
	- 	default: `false`

To register a new topic,

``` javascript
var opts = {
	'max': 10,
	'duplicates': true	
};

topical.add( 'beep', opts );

console.log( topical.topics() );
// returns [ 'beep' ]
```


#### topical.remove( topic )

Removes a topic and all associated subscribers.

``` javascript
topical
	.add( 'beep' )
	.remove( 'beep' );

console.log( topical.topics() );
// returns []
```


#### topical.list( clbk )

Subscribes a `callback` to public broadcasts. Public broadcasts are not bound to a particular topic; instead, they are dispatched to all publicly listed subscribers (akin to opening a phonebook and calling every publicly listed number).

``` javascript
topical.list( foo );

function foo( event ) {
	console.log( event );
}
```

Note: by default, subscribers are unlisted (becoming listed is opt-in:)).


#### topical.unlist( clbk )

Unsubscribes a `callback` from public broadcasts.

``` javascript
topical.unlist( foo );
```

Note: this does __not__ affect a `callback` serving as a subscriber to particular topics.


#### topical.subscribe( topic, clbk )

Subscribes a `callback` to a topic. The topic may be either a `string` or a regular expression. For regular expressions, a `callback` will be subscribed to any topics matching the regular expression.

``` javascript
topical
	.add( 'beep' )
	.add( 'biff' )
	.add( 'bop' )
	.add( 'woot' );

// Subscribe to a single topic:
topical.subscribe( 'beep', foo );

// Subscribe to any topics matching a pattern:
topical.subscribe( /^b.+p$/, bar );
// ...subscribes `bar` to `beep` and `bop` topics

function foo( event ) {
	console.log( event );
}

function bar( event ) {
	console.log( event );
}
```

Note: a topic __must__ exist before attempting to subscribe. If a topic does not exist, an `error` event is emitted (see below).

Additionally, if a topic is `oversubscribed`, i.e., reached its maximum subscriber limit,, an `error` event is emitted.


#### topical.unsubscribe( topic, clbk )

Unsubscribes a `callback` from a topic. The topic may be either a `string` or a regular expression. For regular expressions, a `callback` will be unsubscribed from any topics matching the regular expression. 


``` javascript
topical
	.add( 'beep' )
	.add( 'biff' )
	.add( 'bop' )
	.add( 'woot' );

// Subscribe to a single topic:
topical.subscribe( 'beep', foo );

// Subscribe to any topics matching a pattern:
topical.subscribe( /^b.+/, bar );
// ...subscribes `bar` to `beep`, `bop`, and `biff` topics

// Unsubscribe from a single topic:
topical.unsubscribe( 'beep', foo );

// Unsubscribe from any topics matching a pattern:
topical.unsubscribe( /^b.+p/, bar );
// ...unsubscribes `bar` from `beep` and `bop`

function foo( event ) {
	console.log( event );
}

function bar( event ) {
	console.log( event );
}
```


#### topical.once( topic, clbk )

Subscribes a `callback` to a topic and unsubscribes the `callback` after its first invocation. This is useful, for example, when you need to perform some initialization the first time an event is published, but not after.

``` javascript
topical
	.add( 'beep' )
	.once( 'beep', foo )
	.publish( 'beep', 'boop' )
	.publish( 'beep', 'bap' );

function foo( event ) {
	console.log( event );
	// returns only 'boop'
}
```



#### topical.publish( topic, value )

Publishes a `value` to a specified topic.

``` javascript
topical
	.add( 'beep' )
	.subscribe( 'beep', foo )
	.publish( 'beep', 'boop' );

function foo( event ) {
	console.log( event );
	// returns `boop`
}
```


#### topical.broadcast( value )

Broadcasts a `value` to all publicly listed subscribers.

``` javascript
topical
	.list( foo )
	.list( bar )
	.broadcast( 'Beep' );

function foo( event ) {
	console.log( event );
	// returns 'Beep'
}
function bar( event ) {
	console.log( event );
	// returns 'Beep'
}
```


### Events

All events emit an object (`event`) with `topic` and `data` properties. If a property is not relevant to the event, the property value is `null`. 

Note: the `data` value type is specific to the event. For example, for `error` events, the `data` value is a `string`. For `subscribed`/`unsubscribed` events, the `data` value is a `function`. See the appropriate event to determine the return value type.


#### 'added'

Emitted when a new topic is added to the broker.

``` javascript
topical.on( 'added', function onAdd( event ) {
	console.log( 'Added topic: %s.', event.topic );
});
```

#### 'removed'

Emitted when a topic is removed from the broker.

``` javascript
topical.on( 'removed', function onRemove( event ) {
	console.log( 'Removed topic: %s.', event.topic );
});
```

#### 'listed'

Emitted when a subscriber becomes publicly listed (i.e., open to receiving public broadcasts).

``` javascript
topical.on( 'listed', function onList( event ) {
	var subscriber = event.data;

	// Send the subscriber a personalized welcome message:
	subscriber( 'Hello, new subscriber!' );

	// Announce the newcomer to everyone:
	topical.broadcast( 'Hello, everybody! Please welcome the new subscriber!' );
});

topical.list( foo );

function foo( event ) {
	console.log( event );
}
```


#### 'unlisted'

Emitted when a subscriber unsubscribes from public broadcasts.

``` javascript
topical.on( 'unlisted', function onUnlist( event ) {
	var unsubscriber = event.data;

	// Spam the subscriber one more time:
	unsubscriber( 'So sorry to see you leave...;(' );
});

topical
	.list( foo )
	.unlist( foo );

function foo( event ) {
	console.log( event );
}
```


#### 'subscribed'

Emitted when a topic has a new subscriber.

``` javascript
topical.on( 'subscribed', function onSub( event ) {
	var clbk = event.data;
	clbk( 'Welcome to topic %s!', event.topic );
});

topical
	.add( 'beep' )
	.subscribe( 'beep', onBeep );

function onBeep( event ){
	console.log( event );	
}
```



#### 'unsubscribed'

Emitted when a subscriber unsubscribes from a topic.

``` javascript
topical.on( 'unsubscribed', function onUnsub( event ) {
	var clbk = event.data;
	clbk( 'Goodbye from topic %s!', event.topic );
});

topical
	.add( 'beep' )
	.subscribe( 'beep', foo )
	.unsubscribe( 'beep', foo );

function foo( event ){
	console.log( event );	
}
```


#### 'published'

Emitted when an event is published to a topic.

``` javascript
topical.on( 'published', function onPublish( event ) {
	console.log( 'New event published to topic %s...', event.topic );
});

topical
	.add( 'beep' )
	.subscribe( 'beep', function(){} )
	.publish( 'beep', 'boop' );
```

Note: in line with the NSA ;), only meta data is revealed, not the message contents. Sorry...no eavesdropping on published content.


#### 'broadcast'

Emitted when a broadcast is made to all publicly listed subscribers.

``` javascript 
topical.on( 'broadcast', function onBroadcast() {
	console.log( '...another broadcast...' );
});

topical
	.list( function(){} )
	.broadcast( 'Beep' );
```


#### 'error'

Emitted whenever an `error` is encountered.

*	topic is oversubscribed (maximum number of subscribers exceeded)
* 	attempting to subscribe to an unregistered topic

``` javascript
topical.on( 'error', function onError( event ) {
	console.log( event );
});

topical.subscribe( 'unknown_topic', function(){} );
```


## Notes

When publishing/broadcasting messages, the `value` type is left to the user given her particular use case. Internally, `topical` uses a simple `object` with two fields: `topic` and `data`, where `data` may assume any value type. What `value` type you decide to use is up to you.


## Examples

Suppose we have the following application components...

Component 1:

``` javascript
var topical = require( 'topical' );

module.exports = function component() {
	topical.subscribe( /^b.+p$/, onEvent );
};

function onEvent( event ) {
	console.log( event );
}
```

Component 2:

``` javascript
var topical = require( 'topical' );

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
```

Component 3: collects statistics...

``` javascript
var topical = require( 'topical' );

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
```


Let's now create a central broker...

``` javascript
var topical = require( 'topical' ),
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
``` 

To run the example from the top-level application directory,

``` bash
$ node ./examples/index.js
```


## Tests

### Unit

Unit tests use the [Mocha](http://visionmedia.github.io/mocha) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```



## License

[MIT license](http://opensource.org/licenses/MIT). 


---
## Copyright

Copyright &copy; 2014. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/topical.svg
[npm-url]: https://npmjs.org/package/topical

[travis-image]: http://img.shields.io/travis/kgryte/topical.js/master.svg
[travis-url]: https://travis-ci.org/kgryte/topical.js

[coveralls-image]: https://img.shields.io/coveralls/kgryte/topical.js/master.svg
[coveralls-url]: https://coveralls.io/r/kgryte/topical.js?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/topical.js.svg
[dependencies-url]: https://david-dm.org/kgryte/topical.js

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/topical.js.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/topical.js

[github-issues-image]: http://img.shields.io/github/issues/kgryte/topical.js.svg
[github-issues-url]: https://github.com/kgryte/topical.js/issues