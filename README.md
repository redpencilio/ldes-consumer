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
  consumer.listen(async (member, state) => {
    // Do something with the member
  });
```

You can instatiate an object of class `Consumer` with an object of type `ConsumerArgs`:
```javascript
  const consumer = new Consumer({
    endpoint, // the endpoint to consumer from, e.g. http://example.com/ldes/0
    {
      timestamp, //e.g. new Date()
      page // e.g. http://example.com/ldes/3
    }, // you can optionally pass an initial state to the consumer, which expects the timestamp and page fields. It allows you to only start querying starting on a specific page/timestamp.
  });

```

The `listen`-method of the consumer allows you to consume the stream and pass a callback to process each member of the stream.
```javascript
  consumer.listen(async (member: Member, state: State){
    // Do something with the member and state
  }, () => console.log('Stream has been consumed'))
```
You can pass two callbacks to the `listen`-method:
- The first callback receives a `member` and a `state`, it is called for each incoming member. The `state`-object allows you to determine how far along you are in the stream. The `member`-object includes an id and a list of quads.
- The second callback takes no parameters, it is called when the whole stream has been consumed.
