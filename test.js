
var test = require('tape'),
    RecordSet = require('./index.js').RecordSet;


// Constructor & base backup

test('new RecordSet', function(t){
  var set = new RecordSet();

  t.deepEqual(set.value(), []);
});


//////////////////////////////
//    Convenience Methods
//////////////////////////////

test.skip('#add fires change event');
test.skip('#add returns id');
test.skip('#add updates the value');
test.skip('#add can be done multiple times');
test.skip('#add does not need values');

test.skip('#update throws if entity does not exist');
test.skip('#update changes the property (or properties)');
test.skip('#update fires a change event');
test.skip('#update changes .value()');
test.skip('#update event noted in local changes stream');

test.skip('#destroy fires a change event');
test.skip('#destroy event noted in local changes stream');
test.skip('#destroy changes value');
test.skip('#updates do not cause destroyed objects to reappear');
test.skip('#destroy is idempotent');

test.skip('#apply "update" does nothing if there is a more recent local change'); // and no events
test.skip('#apply "update" does nothing if there is a more recent auth change'); // and no events
test.skip('#apply permits one change');
test.skip('#apply permits multiple changes');
test.skip('#apply only emits one change event');
test.skip('#apply changes value');


