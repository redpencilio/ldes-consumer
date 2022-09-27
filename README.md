# ldes-consumer

This package provides a wrapper around https://github.com/TREEcg/event-stream-client/tree/main/packages/actor-init-ldes-client.
It allows you to consume a time-based fragmented LDES stream given its URL.

## Using this package

An example of using this package is included below:

```javascript
const consumer = new Consumer({
	endpoint,
	initialState,
});
consumer.listen(async (member) => {
	// Do something with the member
});
```

You can instatiate an object of class `Consumer` with an object of type `ConsumerArgs`:

```javascript
  const consumer = new Consumer({
    endpoint, // the endpoint to consumer from, e.g. http://example.com/ldes/0
    state, // you can pass a specific state to the consumer which it can use to skip already processed fragments and members
    requestHeaders // custom HTTP headers which should be sent when sending HTTP calls to the LDES endpoint
  });

```

The `listen`-method of the consumer allows you to consume the stream and pass a callback to process each member of the stream.

```javascript
  consumer.listen(async (member: Member){
    // Do something with the member and state
  }, () => console.log('Stream has been consumed'))
```

You can pass two callbacks to the `listen`-method:

-   The first callback receives a `member` object, it is called for each incoming member. The `member`-object includes an id and a list of quads.
-   The second callback takes a `state` parameter, it is called when the whole stream has been consumed and passes along a state representation.
