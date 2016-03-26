
var test = require('tape'),
    RecordSet = require('./index.js').RecordSet,
    encode = require('record-pack').toString,
    Immutable = require('immutable'),
    sinon = require('sinon'),
    _ = require('lodash');


var findById = function(coll, id){
  return coll.find(function(el){ return (el.get('id') == id); });
};

test('new RecordSet', function(t){
  var set = new RecordSet(),
      expected = Immutable.List();

  t.ok(expected.equals(set.value()));
  t.end();
});


//////////////////////////////
//    Convenience Methods
//////////////////////////////

test('#create fires change event', function(t){

  var spy = sinon.spy(),
      set = new RecordSet();

  set.on('change', spy);
  set.create({"things": "stuff", "numbers": [53, 45]});

  t.ok(spy.calledOnce, 'listener called exectly once');
  t.ok(set.value().equals(spy.firstCall.args[0]), 'value matches expectation');
  t.end();

});

test('#create returns id', function(t){

  var set = new RecordSet(),
      id = set.create(),
      value = set.value();

  t.ok(findById(value, id));
  t.end();

});

test('#create updates the value', function(t){

  var set = new RecordSet(),
      props = {"things": "stuff", "numbers": [53, 45]};

  props.id = set.create(props);
  var expected = Immutable.fromJS([props]);

  t.ok(expected.equals(set.value()), 'value matches expectation');
  t.end();

});


test('#create can be done multiple times', function(t){

  var set = new RecordSet(),
      cid1 = set.create({things: "herp"}),
      cid2 = set.create({things: "derp"}),
      cid3 = set.create({things: 4}),
      list = set.value();

  var c1 = findById(list, cid1),
      c2 = findById(list, cid2),
      c3 = findById(list, cid3);


  t.equals(c1.get('id'), cid1);
  t.equals(c1.get('things'), "herp");

  t.equals(c2.get('id'), cid2);
  t.equals(c2.get('things'), "derp");

  t.equals(c3.get('id'), cid3);
  t.equals(c3.get('things'), 4);

  t.end();

});

test('#create does not need values', function(t){

  var set = new RecordSet(),
      cid = set.create();

  var el = findById(set.value(), cid);

  t.equals(el.get('id'), cid);
  t.end();
  
});

test('#create event noted in local changes stream', function(t){

  var spy = sinon.spy(),
      set = new RecordSet();

  set.changes.local.pipe(spy);
  var cid = set.create({"things": "stuff"});

  t.ok(spy.calledOnce, 'listener called exectly once');

  var arg = spy.firstCall.args[0];

  t.ok(_.isString(arg), 'called with string');

  // Assert local create/update is 2 lines long (1 for create, 1 for property)
  t.equal(arg.split("\n").length, 2, 'Two updates in event');
  t.end();

});

test('#update throws if entity does not exist', function(t){

  var set = new RecordSet();

  t.throws(function(){
    set.update("id-that-does-not-exist", {things: "stuff", stuff: 45});
  });

  t.end();

});

test('#update changes the property (or properties)', function(t){

  var set = new RecordSet(),
      cid = set.create();

  set.update(cid, {"herp": 4});
  t.ok(set.value().equals(Immutable.fromJS([{id: cid, "herp": 4}])));

  set.update(cid, {"herp": "derp"});
  t.ok(set.value().equals(Immutable.fromJS([{id: cid, "herp": "derp"}])));

  t.end();

});

test('#update fires a change event', function(t){

  var spy = sinon.spy(),
      set = new RecordSet(),
      cid = set.create();

  set.on('change', spy);
  set.update(cid, {"things": "stuff", "numbers": [53, 45]});

  t.ok(spy.calledOnce, 'listener called exectly once');
  t.ok(set.value().equals(spy.firstCall.args[0]), 'value matches expectation');
  t.end();

});

test('#update does not fire a change event if no change occured', function(t){

  var spy = sinon.spy(),
      set = new RecordSet(),
      cid = set.create({"things": "stuff"});

  set.on('change', spy);
  set.update(cid, {"things": "stuff"});

  t.ok(! spy.called, 'listener called exectly once');
  t.end();

});

test('#update changes .value()', function(t){

  var set = new RecordSet(),
      cid = set.create(),
      previous = set.value();

  set.update(cid, {"herp": 4});

  t.ok(! previous.equals(set.value()));
  t.end();

});

test('#update event noted in local changes stream', function(t){

  var spy = sinon.spy(),
      set = new RecordSet(),
      cid = set.create({"things": "stuff"});

  set.changes.local.pipe(spy);

  // Issue on update statement of 2 properties
  set.update(cid, {"things": "merp", "stuff": 4});

  t.ok(spy.calledOnce, 'listener called exectly once');

  var arg = spy.firstCall.args[0];

  t.ok(_.isString(arg), 'called with string');

  // Assert local update is 2 lines long (1 for each property)
  t.equal(arg.split("\n").length, 2, 'Two updates in event');
  t.end();

});

test('#update does not trigger event in auth change stream', function(t){

  var spy = sinon.spy(),
      set = new RecordSet(),
      cid = set.create();

  set.changes.auth.pipe(spy);
  set.update(cid, {"herp": "derp"});

  t.ok(! spy.called);
  t.end();

});

test('#update fires a local change, even if value is the same', function(t){

  var spy = sinon.spy(),
      set = new RecordSet(),
      cid = set.create({"herp": "derp"});

  set.changes.local.pipe(spy);
  set.update(cid, {"herp": "derp"});

  t.ok(spy.called);
  t.end();

});

test('#destroy fires a change event, when destroying', function(t){

  var spy = sinon.spy(),
      set = new RecordSet(),
      cid = set.create();

  set.on('change', spy);
  set.destroy(cid);

  t.ok(spy.calledOnce, 'listener called exectly once');
  t.ok(set.value().equals(spy.firstCall.args[0]), 'value matches expectation');
  t.end();

});

test('#destroy doesnt fire a change event, when nothing to destroy', function(t){

  var spy = sinon.spy(),
      set = new RecordSet();

  set.on('change', spy);
  set.destroy("aoeu-aoeu-aoeu");

  t.ok(! spy.called, 'listener not called');
  t.ok(set.value().equals(Immutable.List()), 'value matches expectation');
  t.end();

});

test('#destroy throws if anything other than string is passed', function(t){

  var set = new RecordSet();

  t.throws(function(){ set.destroy(53); }, /Identifier/);
  t.throws(function(){ set.destroy({}); }, /Identifier/);
  t.throws(function(){ set.destroy([]); }, /Identifier/);

  t.end();

});

test('#destroy event noted in local changes stream', function(t){

  var spy = sinon.spy(),
      set = new RecordSet(),
      cid = set.create({"herp": "derp"});

  set.changes.local.pipe(spy);
  set.destroy(cid);

  t.ok(spy.called);
  t.end();

});


test('#destroy changes value', function(t){

  var set = new RecordSet(),
      cid = set.create({"herp": "derp"}),
      prev = set.value();

  set.destroy(cid);

  t.ok(! prev.equals(set.value()));
  t.ok(Immutable.List().equals(set.value()));
  t.end();

});

test('#updates do not cause destroyed objects to reappear', function(t){

  var set = new RecordSet(),
      cid = set.create();

  set.destroy(cid);
  var u1 = set.builder.buildUpdateRecord(cid, "herp", "merp");

  set.apply(encode(u1));

  t.ok(Immutable.List().equals(set.value()));
  t.end();

});

test('#destroy is idempotent', function(t){

  var set = new RecordSet(),
      cid = set.create();

  set.destroy(cid);
  set.destroy(cid);
  set.destroy(cid);

  t.ok(Immutable.List().equals(set.value()));
  t.end();

});

test('#on throws if non-"change" type is used', function(t){
  var set = new RecordSet();
  t.throws(function(){
    set.on('herp', function(){});
  });
  t.end();
});

// test('#off removes listener');

//////////////////////////////
//    Core Method
//////////////////////////////

// TODO -- local change event fires even if nothing has changed
// TODO -- test that auth changes are not issued for local changes
// TODO -- auth change events need to be tested just as local changes are
// TODO -- test that local changes are not issued for auth changes


// test('#apply "update" does nothing if there is a more recent local change', function(t){}); // and no events
// test('#apply "update" does nothing if there is a more recent auth change', function(t){}); // and no events
// test('#apply permits one change', function(t){});
// test('#apply permits multiple changes', function(t){});
// test('#apply only emits one change event', function(t){});
// test('#apply changes value', function(t){});


