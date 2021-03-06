# Dispatcher
#### Aurora Docs

----

### Operations

<br />

Dispatch Event

```js
Aurora.dispatcher.dispatch("event", data);
```

<br />

Listen For Event

```js
Aurora.dispatcher.on("event", callback);
```

<br />

Remove Event

```js
Aurora.dispatcher.remove("event");
```

<br />

Get the number of times a event has been called

```js
Aurora.dispatcher.eventCalls("event");
```

----

### Accessibility

The dispatcher can be access globally, but it is recommended to use it through the Aurora object (you also get Intellisense through the Aurora object).

<br />

Recommended

```js
Aurora.dispatcher.on("event", callback);
```

<br />

Not Recommended

```js
dispatcher.on("event", callback);
```

----

### WARNING

This is for users. Aurora does not use this internally.