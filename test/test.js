'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Event-emitter class:
	EventEmitter = require( 'events' ).EventEmitter,

	// Module to be tested:
	topical = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'topical', function tests() {

	// SETUP //

	var Topical = topical.ctor,
		t;

	beforeEach( function() {
		t = new Topical();
	});


	it( 'should export an object', function test() {
		expect( topical ).to.be.an( 'object' );
	});

	it( 'should export a constructor', function test() {
		expect( Topical ).to.be.a( 'function' );
	});

	it( 'should be a Topical instance', function test() {
		var createTopical = Topical;
		assert.instanceOf( topical, Topical );
		assert.instanceOf( createTopical(), Topical );
	});

	it( 'should be an event emitter', function test() {
		assert.instanceOf( topical, EventEmitter );
		assert.instanceOf( t, EventEmitter );
	});

	// TOPICS //

	describe( 'topics', function tests() {

		it( 'should provide a method to retrieve the current list of topics', function test() {
			expect( t.topics ).to.be.a( 'function' );
		});

		it( 'should return an array', function test() {
			expect( t.topics() ).to.be.an( 'array' );
		});

	}); // end TESTS topics


	// ADD //

	describe( 'add', function tests() {

		it( 'should provide a method to add a topic', function test() {
			expect( t.add ).to.be.a( 'function' );
		});

		it( 'should throw an error if provided a non-string topic', function test() {
			var values = [
					5,
					true,
					NaN,
					null,
					undefined,
					{},
					[],
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					t.add( value );
				};
			}
		});

		it( 'should throw an error if provided a non-object options', function test() {
			var values = [
					5,
					true,
					NaN,
					null,
					undefined,
					'5',
					[],
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					t.add( 'beep', value );
				};
			}
		});

		it( 'should throw an error if max option is not an integer or less than 0', function test() {
			var values = [
					5.54,
					-1,
					true,
					NaN,
					null,
					undefined,
					'5',
					[],
					{},
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					t.add( 'beep', {
						'max': value,
						'duplicates': false
					});
				};
			}
		});

		it( 'should throw an error if duplicates option is not a boolean', function test() {
			var values = [
					5,
					NaN,
					null,
					undefined,
					'5',
					[],
					{},
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					t.add( 'beep', {
						'max': 5,
						'duplicates': value
					});
				};
			}
		});

		it( 'should add a topic', function test() {
			t.add( 'beep' );
			assert.ok( t.topics().indexOf( 'beep' ) !== -1 );
		});

		it( 'should emit an event upon adding a topic', function test( done ) {
			t.on( 'add', function onAdd() {
				assert.ok( true );
				done();
			});
			t.add( 'beep' );
		});

		it( 'should do nothing if the topic already exists', function test() {
			console.log( t.topics() );
			t.add( 'beep' );
			t.on( 'add', function() {
				assert.notOk( true );
			});
			t.add( 'beep' );
		});

	}); // end TESTS add


	// REMOVE //

	describe( 'remove', function tests() {

		it( 'should provide a method to remove a topic', function test() {
			expect( t.remove ).to.be.a( 'function' );
		});

		it( 'should throw an error if not provided either a string or regular expression', function test() {
			var values = [
					5,
					true,
					NaN,
					null,
					undefined,
					{},
					[],
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					t.remove( value );
				};
			}
		});

		it( 'should emit an event upon removing a topic', function test( done ) {
			t.on( 'remove', function() {
				assert.ok( t.topics().indexOf( 'beep' ) === -1 );
				done();
			});
			t.add( 'beep' );
			t.remove( 'beep' );
		});

		it( 'should remove any topics matching a pattern', function test( done ) {
			var counter = 0;
			t.on( 'remove', function() {
				if ( ++ counter !== 2 ) {
					return;
				}
				var topics = t.topics();
				assert.ok( topics.indexOf( 'beep' ) === -1 );
				assert.ok( topics.indexOf( 'boop' ) === -1 );
				assert.ok( topics.indexOf( 'foo' ) !== -1 );
				done();
			});
			t.add( 'beep' ).add( 'boop' ).add( 'foo' );
			t.remove( /^b.+p?/ );
		});

		it( 'should do nothing if the topic does not exist', function test() {
			t.on( 'remove', function() {
				assert.notOk( true );
			});
			t.remove( 'beep' );
		});

	}); // end TESTS remove


	// LIST //

	describe( 'list', function tests() {

		it( 'should provide a method to allow a subscriber to subscribe to public broadcasts', function test() {
			expect( t.list ).to.be.a( 'function' );
		});

		it( 'should throw an error if provided a non-function', function test() {
			var values = [
					5,
					true,
					NaN,
					null,
					undefined,
					{},
					[],
					'5'
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					t.list( value );
				};
			}
		});

		it( 'should emit an event upon listing', function test( done ) {
			t.on( 'list', function() {
				assert.ok( true );
				done();
			});
			t.list( function(){} );
			t.broadcast( 'boop' );
		});

		it( 'should do nothing if the subscriber is already listed', function test() {
			t.list( boop );
			t.on( 'list', function() {
				assert.notOk( true );
			});
			t.list( boop );
			function boop() {
				console.log( 'boop' );
			}
		});

	}); // end TESTS list


	// UNLIST //

	describe( 'unlist', function tests() {

		it( 'should provide a method to allow a subscriber to unsubscribe from public broadcasts', function test() {
			expect( t.unlist ).to.be.a( 'function' );
		});

		it( 'should throw an error if provided a non-function', function test() {
			var values = [
					5,
					true,
					NaN,
					null,
					undefined,
					{},
					[],
					'5'
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					t.unlist( value );
				};
			}
		});

		it( 'should emit an event upon unlisting', function test( done ) {
			t.on( 'unlist', function() {
				assert.ok( true );
				done();
			});
			t.list( foo );
			t.unlist( foo );
			function foo() {
				console.log( 'beep' );
			}
		});

		it( 'should do nothing if the subscriber is not listed', function test() {
			t.on( 'unlist', function() {
				assert.notOk( true );
			});
			t.unlist( boop );
			function boop() {
				console.log( 'boop' );
			}
		});

	}); // end TESTS unlist


	// SUBSCRIBE //

	describe( 'subscribe', function tests() {

		it( 'should provide a method to subscribe to a topic', function test() {
			expect( t.subscribe ).to.be.a( 'function' );
		});

		it( 'should throw an error if provided a non-string or regular expression topic', function test() {
			var values = [
					5,
					true,
					NaN,
					null,
					undefined,
					{},
					[],
					function(){},
					new Date()
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					t.subscribe( value, function(){} );
				};
			}
		});

		it( 'should throw an error if the second argument is not a function', function test() {
			var values = [
					5,
					true,
					NaN,
					null,
					undefined,
					{},
					[],
					'5',
					new Date()
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					t.subscribe( 'beep', value );
				};
			}
		});

		it( 'should emit an error if the topic does not exist', function test( done ) {
			t.on( 'error', function() {
				assert.ok( true );
				done();
			});
			t.subscribe( 'beep', function(){} );
		});

		it( 'should emit an error if the number of subscribers exceeds a max limit', function test( done ) {
			t.on( 'error', function test() {
				assert.ok( true );
				done();
			});
			t.add( 'beep', {'max': 0});
			t.subscribe( 'beep', function(){} );
		});

		it( 'should emit a subscribe event', function test( done ) {
			t.on( 'subscribe', function() {
				assert.ok( true );
				done();
			});
			t.add( 'beep' );
			t.subscribe( 'beep', function(){} );
		});

		it( 'should prevent duplicates', function test( done ) {
			t.add( 'beep', {'duplicates': false } );
			t.subscribe( 'beep', boop );
			t.subscribe( 'beep', boop );
			t.publish( 'beep', 'boop' );
			function boop() {
				assert.ok( true );
				done();
			}
		});

		it( 'should allow duplicates', function test( done ) {
			var counter = 0,
				total = 2;

			t.add( 'beep', {'duplicates': true } );
			t.subscribe( 'beep', boop );
			t.subscribe( 'beep', boop );
			t.publish( 'beep', 'boop' );
			function boop() {
				assert.ok( true );
				if ( ++counter === total ) {
					done();
				}
			}
		});

		it( 'should allow for subscribing using a pattern', function test( done ) {
			var counter = 0,
				total = 2;

			t.add( 'beep' )
				.add( 'boop' )
				.add( 'woot' );

			t.subscribe( /^b.+p$/, foo );
			t.publish( 'beep', 'bop' );
			t.publish( 'boop', 'bap' );
			function foo() {
				assert.ok( true );
				if ( ++counter === total ) {
					done();
				}
			}
		});

	}); // end TESTS subscribe


	// SUBSCRIBE //

	describe( 'unsubscribe', function tests() {

		it( 'should provide a method to unsubscribe from a topic', function test() {
			expect( t.unsubscribe ).to.be.a( 'function' );
		});

		it( 'should throw an error if provided a non-string or regular expression topic', function test() {
			var values = [
					5,
					true,
					NaN,
					null,
					undefined,
					{},
					[],
					function(){},
					new Date()
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					t.unsubscribe( value, function(){} );
				};
			}
		});

		it( 'should throw an error if the second argument is not a function', function test() {
			var values = [
					5,
					true,
					NaN,
					null,
					undefined,
					{},
					[],
					'5',
					new Date()
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					t.unsubscribe( 'beep', value );
				};
			}
		});

		it( 'should do nothing if the topic does not exist', function test() {
			t.on( 'unsubscribe', function() {
				assert.notOk( true );
			});
			t.unsubscribe( 'beep', function(){} );
		});

		it( 'should do nothing if the subscriber is not subscribed', function test() {
			t.on( 'unsubscribe', function() {
				assert.notOk( true );
			});
			t.add( 'beep' );
			t.unsubscribe( 'beep', function(){} );
		});

		it( 'should unsubscribe', function test( ) {
			t.add( 'beep' );
			t.subscribe( 'beep', foo );
			t.unsubscribe( 'beep', foo );
			t.publish( 'beep', 'bap' );
			function foo() {
				assert.notOk( true );
			}
		});

		it( 'should emit an unsubscribe event', function test( done ) {
			t.on( 'unsubscribe', function() {
				assert.ok( true );
				done();
			});
			t.add( 'beep' );
			t.subscribe( 'beep', foo );
			t.unsubscribe( 'beep', foo );
			function foo() {
				console.log( 'boop' );
			}
		});

		it( 'should allow unsubscribed using a pattern', function test() {
			t.add( 'beep' )
				.add( 'boop' )
				.add( 'biff' );

			t.subscribe( 'beep', foo );
			t.subscribe( 'boop', foo );

			t.unsubscribe( /^b.+p$/, foo );

			t.publish( 'beep', 'bap' );
			t.publish( 'boop', 'bop' );

			function foo() {
				assert.notOk( true );
			}
		});

		it( 'should unsubscribe all duplicates', function test() {
			t.add( 'beep', {'duplicates': true} );
			t.subscribe( 'beep', foo );
			t.subscribe( 'beep', foo );
			t.unsubscribe( 'beep', foo );
			t.publish( 'beep', 'bap' );
			function foo() {
				assert.notOk( true );
			}
		});

		it( 'should not affect other subscribers', function test() {
			t.add( 'beep' );
			t.subscribe( 'beep', foo );
			t.subscribe( 'beep', bar );
			t.unsubscribe( 'beep', foo );
			t.publish( 'beep', 'bap' );
			function foo() {
				assert.notOk( true );
			}
			function bar() {
				assert.ok( true );
			}
		});

	}); // end TESTS unsubscribe


	// ONCE //

	describe( 'once', function tests() {

		it( 'should provide a method to subscribe to a topic and receive an event only once', function test() {
			expect( t.once ).to.be.a( 'function' );
		});

		it( 'should throw an error if provided a non-string or regular expression topic', function test() {
			var values = [
					5,
					true,
					NaN,
					null,
					undefined,
					{},
					[],
					function(){},
					new Date()
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					t.once( value, function(){} );
				};
			}
		});

		it( 'should throw an error if the second argument is not a function', function test() {
			var values = [
					5,
					true,
					NaN,
					null,
					undefined,
					{},
					[],
					'5',
					new Date()
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					t.once( 'beep', value );
				};
			}
		});

		it( 'should emit an error if the topic does not exist', function test( done ) {
			t.on( 'error', function() {
				assert.ok( true );
				done();
			});
			t.once( 'beep', function(){} );
		});

		it( 'should emit an error if the number of subscribers exceeds a max limit', function test( done ) {
			t.on( 'error', function test() {
				assert.ok( true );
				done();
			});
			t.add( 'beep', {'max': 0});
			t.once( 'beep', function(){} );
		});

		it( 'should emit a subscribe event', function test( done ) {
			t.on( 'subscribe', function() {
				assert.ok( true );
				done();
			});
			t.add( 'beep' );
			t.once( 'beep', function(){} );
		});

		it( 'should remove duplicates', function test( done ) {
			t.add( 'beep', {'duplicates': true} );
			t.subscribe( 'beep', boop );
			t.subscribe( 'beep', foo );
			t.once( 'beep', boop );
			t.publish( 'beep', 'boop' );
			function boop() {
				assert.ok( true );
				done();
			}
			function foo() {}
		});

		it( 'should unsubscribe after the first event', function test( done ) {
			t.add( 'beep' );
			t.once( 'beep', boop );
			t.publish( 'beep', 'boop' );
			t.publish( 'beep', 'boop' );
			function boop() {
				assert.ok( true );
				done();
			}
		});

		it( 'should emit an unsubscribe event after the first event', function test( done ) {
			t.add( 'beep' );
			t.on( 'unsubscribe', foo );
			t.once( 'beep', function(){} );
			t.publish( 'beep', 'boop' );
			t.publish( 'beep', 'boop' );
			function foo() {
				assert.ok( true );
				done();
			}
		});

		it( 'should not affect other subscribers', function test( done ) {
			var c1 = 0,
				c2 = 0,
				total = 3;

			t.add( 'beep' );
			t.once( 'beep', foo );
			t.subscribe( 'beep', bar );
			t.publish( 'beep', 'bop' );
			t.publish( 'beep', 'bap' );
			t.publish( 'beep', 'bip' );
			function foo() {
				if ( ++c1 === 1 ) {
					assert.ok( true );
				} else {
					assert.notOk( true );
				}
			}
			function bar( event ) {
				assert.ok( true );
				if ( ++c2 === total ) {
					done();
				}
			}
		});

	}); // end TESTS once


	// PUBLISH //

	describe( 'publish', function tests() {

		it( 'should provide a method to publish events to subscribers', function test() {
			expect( t.publish ).to.be.a( 'function' );
		});

		it( 'should throw an error if provided a non-string topic', function test() {
			var values = [
					5,
					true,
					NaN,
					null,
					undefined,
					{},
					[],
					function(){}
				];

			for ( var i = 0; i < values.length; i++ ) {
				expect( badValue( values[i] ) ).to.throw( TypeError );
			}

			function badValue( value ) {
				return function() {
					t.publish( value, 'beep' );
				};
			}
		});

		it( 'should throw an error if not provided a second argument', function test() {
			expect( foo ).to.throw( Error );
			function foo() {
				t.publish( 'beep' );
			}
		});

		it( 'should emit a publish event', function test( done ) {
			t.add( 'beep' );
			t.on( 'publish', function() {
				assert.ok( true );
				done();
			});
			t.subscribe( 'beep', function(){} );
			t.publish( 'beep', 'boop' );
		});

		it( 'should do nothing if topic does not exist', function test() {
			t.on( 'publish', function() {
				assert.notOk( true );
			});
			t.publish( 'beep', 'boop' );
		});

		it( 'should do nothing if topic has no subscribers', function test() {
			t.add( 'beep' );
			t.on( 'publish', function() {
				assert.notOk( true );
			});
			t.publish( 'beep', 'boop' );
		});

	}); // end TESTS publish()


	// BROADCAST //

	describe( 'broadcast', function tests() {

		it( 'should provide a method to broadcast to all publicly listed subscribers', function() {
			expect( t.broadcast ).to.be.a( 'function' );
		});

		it( 'should throw an error if not provided arguments', function test() {
			expect( foo ).to.be.throw( Error );
			function foo() {
				t.broadcast();
			}
		});

		it( 'should emit a broadcast event', function test( done ) {
			t.on( 'broadcast', function() {
				assert.ok( true );
				done();
			});
			t.list( function(){} );
			t.broadcast( 'beep' );
		});

		it( 'should do nothing if no publicly listed subscribers', function test() {
			t.on( 'broadcast', function() {
				assert.notOk( true );
			});
			t.broadcast( 'beep' );
		});

	}); // end TESTS broadcast

});
