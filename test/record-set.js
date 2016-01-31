
import test from 'ava'
import assert from 'assert'
import RecordSet from '../bundle.js'
import sinon from 'sinon'

///////////////////////
/// .create(proprs) ///
///////////////////////

test("fires 'local' event", t => {
  let x = new RecordSet();
  let s = sinon.spy();
  x.on('local', s);

  x.create({x: "x", y: "y"});

  assert(s.calledThrice);
});

test("fires 'data' event", t => {
  let x = new RecordSet();
  let s = sinon.spy();
  x.on('data', s);

  x.create({x: "x", y: "y"});

  assert(s.called);
});

// var RecordSet = require('../bundle.js');

// let x = new RecordSet();

// changes.on('auth', x); // 'auth' changes (eg, from socket)
// changes.on('data', x); // 'data' any changes (local, or authoritative)
// changes.on('local', x); // 'local' changes
// 
// x.pipe(localChanges); // (eg, to socket)
// 
// x.create({k1: 'v1', k2: 'v2', k3: 'v3'}); // local change
// x.update('some-id', {k1: 'v1', k2: 'v2'}); // local change
// x.remove('some-id'); // local change
// 
// x.value();
// x.latest();
// 
// // 'data' events
// // 'local' change
