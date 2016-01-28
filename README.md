
# Data Struct Server

### URI APIs used

```
// GET  /base
// GET  /changes?since=0
// POST /changes
// WS   /changes
```

### Changes

```
// Create message
cMsg = RecSet.create(),

// Update message
uMsg = RecSet.update(cMsg.entity_id, {title: "things", description: "stuff"})

// Delete message
dMsg = RecSet.remove(cMsg.entity_id)

```

### Interface

```
var s = new RecSet("endpoint.mysite.com/api/structs/452")

s.on('data', function(datum){ ... handle data ... }); // complete, consolidated set

// no...? to the later?
s.on('error', function(){ ... handle error ... });
s.on('close', function(){ ... handle close ... });
s.on('end', function(){ ... handle end ... });

s.add({ ... object ... })
s.update(id, {  ... properties ... })
s.remove(id)
s.tx([
  RecSet.createAdd(),
  RecSet.createDelete(),
  RecSet.createUpdate()
])

s.latest()

```

### Example use

```
// edges

[
  [14, 145, weight], // unseen (ts)
  [ 1,  12, weight],
  [ 1,  13, weight]
]

// nodes
[
  [{id: 14, title: "some title", description: "some descript", meta.type, meta.complete }] // unseen (ts, deleted_at)
  [{id: 13, title: "other title", description: "some descript", meta.type, meta.complete }] // unseen (ts, deleted_at)
  [{id:  1, title: "third title", description: "some descript", meta.type, meta.complete }] // unseen (ts, deleted_at)
]
```

### Things to maybe use

```
https://github.com/sindresorhus/is-online
http://highlandjs.org/
https://github.com/spotify/docker-kafka
kafkacat
https://github.com/dcodeIO/protobuf.js/tree/master/examples/websocket
https://github.com/dcodeIO/protobuf.js
```


### Tests

```
var s = new RecSet(base, aChanges, lChanges)


### Adds
var s = new RecSet(backup, [], [])
assert(s.latest()).deep-eq(backup)

var s = new RecSet(backup, [add], [])
assert(s.latest()).deep-eq(backup + add)

var s = new RecSet(backup, [], [add])
assert(s.latest()).deep-eq(backup + add)

 - Assert 'data' event
 - Assert latest

### Updates

 - Assert 'data' event
 - Assert latest

### Deletes

 - Assert 'data' event
 - Assert latest

### Transactions


### Dynamic from Endpoint

###   Add from endpoint

 - Assert 'data' event
 - Assert latest

###   Remove from endpoint

 - Assert 'data' event
 - Assert latest

###   Update from endpoint

 - Assert 'data' event
 - Assert latest


```
