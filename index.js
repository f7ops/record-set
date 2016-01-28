

// Server
//
// GET  /base
// GET  /changes?since=0
// POST /changes
// WS   /changes

import ProtoBuf from 'protobufjs'
import Timestamp from './src/timestamp.js'
import RecordSet from './src/record-set.js'

console.log(Timestamp("snth"));

let nodeDef = require("raw!./proto/node.proto");
let builder = ProtoBuf.loadProto(nodeDef, "node.proto");

console.log(builder.build("Nodes"))
let Node = builder.build("Nodes").Node;
let n = new Node({id: "aoeuaoeu", title: "i'm a title", description: "some lengthy description"});

console.log(n);
// console.log(n.encode().toArrayBuffer());
console.log(n.encode().toBase64());

var x;
console.log(x = new RecordSet());
export default RecordSet
