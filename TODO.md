TODO
====

1. Topic options
2. Tests
3. 


## Comments

* 	Managing a topic's list of subscribers seems fragile. We assume synchronous behavior when implementing `once`; i.e., the `published` event will follow immediately after all events have been dispatched to subscribers. Currently, we listen for this event to trigger the unsubscribe event for the one-time subscriber. Should the `published` event not follow immediately such that another publish event could be invoked before removing the one-time subscriber, the implementation will fail. In the event that the `publish()` method were to become asynchronous, another means of managing  the subscriber list (e.g., `arr.slice()`).