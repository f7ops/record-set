
require('tape-chai');
var test = require('tape'),
    RecordSet = require('./index.js'),
    encode = RecordSet.RecordPack.toString,
    Immutable = require('immutable'),
    _ = require('lodash'),
    LogMinimum = require('./log-minimum'),
    b1 = new RecordSet.RecordPack.Builder(),
    b2 = new RecordSet.RecordPack.Builder();


/////////////////////////////
// LogMinimum
/////////////////////////////

test('LogMinimum#apply rejects string records', function(t){

  t.throws(function(){
    var l = new LogMinimum();
    l.apply(encode(b1.create()));
  }, /Cannot apply encoded records/);

  t.end();

});

test('LogMinimum#apply allows single records', function(t){

  t.doesNotThrow(function(){
    var l = new LogMinimum();
    l.apply(b1.create());
  });

  t.end();

});

test('LogMinimum#apply allows multiple records', function(t){

  t.doesNotThrow(function(){
    var l = new LogMinimum();
    l.apply([b1.create(), b1.create()]);
  });

  t.end();

});

test('LogMinimum#getRecords permits fetch of records for all entitites', function(t){

  var l  = new LogMinimum(),
      c1 = b1.create(),
      c2 = b1.create();

  var changes = [
    c1,
    c2,
    b1.update(c1.entity_id, "a", 1),
    b1.update(c1.entity_id, "b", 2)
  ]
  l.apply(changes);

  var actual = new Immutable.Set(l.getRecords());
  var expected = new Immutable.Set(changes);

  t.ok(actual.equals(expected));
  t.end();

});

test('LogMinimum#getRecords permits fetch of records for single entity', function(t){

  var l  = new LogMinimum(),
      c1 = b1.create(),
      c2 = b1.create();

  var changes = [
    c1,
    b1.update(c1.entity_id, "a", 1),
    b1.update(c1.entity_id, "b", 2)
  ]
  l.apply(changes.concat([c2, b1.update(c2.entity_id, "c", 3)]));

  var actual = new Immutable.Set(l.getRecords(c1.entity_id));
  var expected = new Immutable.Set(changes);

  t.ok(actual.size == 3);
  t.ok(actual.equals(expected));
  t.end();

});

test('LogMinimum#getRecords does not return stale updates', function(t){

  var l  = new LogMinimum(),
      c1 = b1.create(),
      staleUpdate = b1.update(c1.entity_id, "a", 1);

  var changes = [
    c1,
    b1.update(c1.entity_id, "a", 2),
    b1.update(c1.entity_id, "b", 2)
  ]

  l.apply(changes.concat([staleUpdate]));

  var actual = new Immutable.Set(l.getRecords());
  var expected = new Immutable.Set(changes);

  t.ok(actual.size == 3);
  t.ok(actual.equals(expected));
  t.end();

});

test('LogMinimum#getRecords does not return creates or updates of deleted records', function(t){

  var l  = new LogMinimum(),
      c1 = b1.create(),
      d1 = b1.destroy(c1.entity_id);

  var changes = [
    c1,
    b1.update(c1.entity_id, "a", 2),
    d1
  ]

  l.apply(changes);

  var actual = new Immutable.Set(l.getRecords());
  var expected = new Immutable.Set([d1]);

  t.ok(actual.size == 1);
  t.ok(actual.equals(expected));
  t.end();

});

/////////////////////////////
// RecordSet
/////////////////////////////

test('#apply [create]', function(t){

  var set = new RecordSet(),
      c1 = b1.create();

  set.apply([c1]);

  t.deepEqual(set.toJS(), [{id: c1.entity_id}]);
  t.ok(set.toImmutable().equals(Immutable.fromJS([{id: c1.entity_id}]).toSet()), 'immutable cantains entitiy');
  t.ok(Immutable.fromJS(_.map(set.toRecords(), encode)).toSet().equals(Immutable.fromJS([encode(c1)]).toSet()), 'create is recorded in records');

  t.end();

});

test('#apply [update] not shown if entity not yet created', function(t){

  var set = new RecordSet(),
      c1 = b1.create()
      u1 = b1.update(c1.entity_id, 'a', 1);

  set.apply([u1]);

  t.deepEqual(set.toJS(), []);
  t.ok(set.toImmutable().equals(Immutable.fromJS([]).toSet()), 'set appears empty');
  // But record exists and recorded
  t.ok(Immutable.fromJS(_.map(set.toRecords(), encode)).toSet().equals(Immutable.fromJS([encode(u1)]).toSet()), 'update to non-entity is recorded');

  t.end();

});

test('#apply [u2 (recent)] then [c1, u1] displays most recent update', function(t){

  var set = new RecordSet(),
      c1 = b1.create()
      u1 = b1.update(c1.entity_id, 'a', 1),
      u2 = b1.update(c1.entity_id, 'a', 2);

  set.apply([u2]);
  set.apply([c1, u1]);

  t.deepEqual(set.toJS(), [{id: c1.entity_id, 'a': 2}]);
  t.ok(set.toImmutable().equals(Immutable.fromJS([{id: c1.entity_id, 'a': 2}]).toSet()), 'entity has most recent update, despite being added before creation');
  t.ok(Immutable.fromJS(_.map(set.toRecords(), encode)).toSet().equals(Immutable.fromJS([encode(c1), encode(u2)]).toSet()), 'only the most recent property update is recorded');

  t.end();

});

test('#apply [c1] then [u1]', function(t){

  var set = new RecordSet(),
      c1 = b1.create()
      u1 = b1.update(c1.entity_id, 'a', 1);

  set.apply([c1]);
  set.apply([u1]);

  t.deepEqual(set.toJS(), [{id: c1.entity_id, 'a': 1}]);
  t.ok(set.toImmutable().equals(Immutable.fromJS([{id: c1.entity_id, 'a': 1}]).toSet()), 'entity has most recent update');
  t.ok(Immutable.fromJS(_.map(set.toRecords(), encode)).toSet().equals(Immutable.fromJS([encode(c1), encode(u1)]).toSet()), 'record contains create and update');

  t.end();

});

test('Destroys on non-existent entities only show up in records', function(t){

  var set = new RecordSet(),
      c1 = b1.create()
      d1 = b1.destroy(c1.entity_id);

  set.apply(d1);

  t.deepEqual(set.toJS(), []);
  t.ok(set.toImmutable().equals(Immutable.fromJS([]).toSet()), 'destroyed entity continues to not exist');
  t.ok(Immutable.fromJS(_.map(set.toRecords(), encode)).toSet().equals(Immutable.fromJS([encode(d1)]).toSet()), 'record contains destroy');

  t.end();

});

test('Destroys on existent entities only show up in records', function(t){

  var set = new RecordSet(),
      c1 = b1.create()
      d1 = b1.destroy(c1.entity_id);

  set.apply(c1);
  set.apply(d1);

  t.deepEqual(set.toJS(), []);
  t.ok(set.toImmutable().equals(Immutable.fromJS([]).toSet()), 'destroyed entity does not exist');
  t.ok(Immutable.fromJS(_.map(set.toRecords(), encode)).toSet().equals(Immutable.fromJS([encode(d1)]).toSet()), 'record contains only destroy');

  t.end();

});

test('Destroys seen before create still results in just destory', function(t){

  var set = new RecordSet(),
      c1 = b1.create()
      d1 = b2.destroy(c1.entity_id);

  set.apply(d1);
  set.apply(c1);

  t.deepEqual(set.toJS(), []);
  // TODO -- shouldn't all these immutables be `toSet`
  t.ok(set.toImmutable().equals(Immutable.fromJS([]).toSet()), 'destroyed entity does not exist');
  t.ok(Immutable.fromJS(_.map(set.toRecords(), encode)).toSet().equals(Immutable.fromJS([encode(d1)]).toSet()), 'record contains only destroy');

  t.end();

});


test('many ways to apply updates', function(t){

  var c1 = b1.create(),
      u1 = b1.update(c1.entity_id, 'a', 'aoeu'),
      u2 = b1.update(c1.entity_id, 'b', 'htns');

  // Allows individual updates
  var AAA = new RecordSet();
  AAA.apply(c1)
     .apply(u1)
     .apply(u2);

  // Allows individual updates, encoded
  var BBB = new RecordSet();
  BBB.apply(encode(c1))
     .apply(encode(u1))
     .apply(encode(u2));

  // Allows multiple updates, array
  var CCC = new RecordSet();
  CCC.apply([c1, u1, u2]);

  // Allows multiple updates, encoded, new-line separated
  var DDD = new RecordSet();
  DDD.apply([encode(c1), encode(u1), encode(u2)].join("\n"));

  // Assert all 5 are the same, assert all for are as expected
  t.deepEqual(AAA.toJS(), BBB.toJS(), 'AAA == BBB');
  t.deepEqual(BBB.toJS(), CCC.toJS(), 'BBB == CCC');
  t.deepEqual(CCC.toJS(), DDD.toJS(), 'CCC == DDD');
  t.deepEqual(DDD.toJS(), [{id: c1.entity_id, 'a': 'aoeu', 'b': 'htns'}], 'DDD == Control');

  t.ok(AAA.toImmutable().toSet().equals(BBB.toImmutable().toSet()), "AAA == BBB");
  t.ok(BBB.toImmutable().toSet().equals(CCC.toImmutable().toSet()), "BBB == CCC");
  t.ok(CCC.toImmutable().toSet().equals(DDD.toImmutable().toSet()), "CCC == DDD");
  t.ok(DDD.toImmutable().toSet().equals(Immutable.fromJS([{id: c1.entity_id, 'a': 'aoeu', 'b': 'htns'}]).toSet()), "DDD == Control");

  t.ok(Immutable.fromJS(_.map(AAA.toRecords(), encode)).toSet().equals(Immutable.fromJS([encode(c1), encode(u1), encode(u2)]).toSet()), 'all records are as expected (AAA)');
  t.ok(Immutable.fromJS(_.map(BBB.toRecords(), encode)).toSet().equals(Immutable.fromJS([encode(c1), encode(u1), encode(u2)]).toSet()), 'all records are as expected (BBB)');
  t.ok(Immutable.fromJS(_.map(CCC.toRecords(), encode)).toSet().equals(Immutable.fromJS([encode(c1), encode(u1), encode(u2)]).toSet()), 'all records are as expected (CCC)');
  t.ok(Immutable.fromJS(_.map(DDD.toRecords(), encode)).toSet().equals(Immutable.fromJS([encode(c1), encode(u1), encode(u2)]).toSet()), 'all records are as expected (DDD)');

  t.end();

});



