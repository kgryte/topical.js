TODO
====

1. 	Chainable `topical.on()` method (?)


## Comments

* 	Managing a topic's list of subscribers seems fragile. We assume synchronous behavior when implementing `once`; i.e., the `publish` event will follow immediately after all events have been dispatched to subscribers. Currently, we listen for this event to trigger the unsubscribe event for the one-time subscriber. Should the `publish` event not follow immediately such that another publish event could be invoked before removing the one-time subscriber, the implementation will fail. In the event that the `publish()` method were to become asynchronous, another means of managing  the subscriber list (e.g., `arr.slice()`).