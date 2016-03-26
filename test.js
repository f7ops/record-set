
var test = require('tape'),
    RecordSet = require('./index.js').RecordSet,
    Immutable = require('immutable'),
    sinon = require('sinon');


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

  var props = {"things": "stuff", "numbers": [53, 45]};
  var id = set.create(props);
  props.id = id;
  var expected = Immutable.fromJS([props]);

  t.ok(spy.calledOnce, 'listener called exectly once');
  t.ok(expected.equals(spy.firstCall.args[0]), 'value matches expectation');
  t.end();
});

// test('#create returns id', function(t){});
// test('#create updates the value', function(t){});
// test('#create can be done multiple times', function(t){});
// test('#create does not need values', function(t){});
// 
// test('#update throws if entity does not exist', function(t){});
// test('#update changes the property (or properties)', function(t){});
// test('#update fires a change event', function(t){});
// test('#update changes .value()', function(t){});
// test('#update event noted in local changes stream', function(t){});
// 
// test('#destroy fires a change event', function(t){});
// test('#destroy event noted in local changes stream', function(t){});
// test('#destroy changes value', function(t){});
// test('#updates do not cause destroyed objects to reappear', function(t){});
// test('#destroy is idempotent', function(t){});

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


// test('#apply "update" does nothing if there is a more recent local change', function(t){}); // and no events
// test('#apply "update" does nothing if there is a more recent auth change', function(t){}); // and no events
// test('#apply permits one change', function(t){});
// test('#apply permits multiple changes', function(t){});
// test('#apply only emits one change event', function(t){});
// test('#apply changes value', function(t){});


