
var fs = require('fs');
var ProtoBuf = require('protobufjs');

var nodeDef = fs.readFileSync("./proto/node.proto", {encoding: 'utf8'});
console.log(nodeDef);
var builder = ProtoBuf.loadProto(nodeDef, "node.proto");

console.log(builder.build("Nodes"));
var Node = builder.build("Nodes").Node;
var n = new Node({id: "aoeuaoeu", title: "i'm a title", description: "some lengthy description"});

console.log(n);
// console.log(n.encode().toArrayBuffer());
console.log(n.encode().toBase64());

var wstream = fs.createWriteStream('test.bin');
wstream.write(n.encode().toBuffer());
wstream.end();
