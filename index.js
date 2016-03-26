
var EventEmitter2 = require('eventemitter2').EventEmitter2,
    Immutable = require('immutable'),
    _ = require('lodash'),
    RecordPack = require('record-pack'),
    encode = RecordPack.toString,
    decode = RecordPack.fromString;

findById = function(coll, id){
  return _.find(coll, function(el){ return (el.id == id); });
};

genFoldp = function(){
  var previous = {
    _value: [],
    objRecords: {}
  };

  var create = function(record, prev){
    if (findById(prev._value, record.entity_id)) {
      console.warn("Record " + record.entity_id + " already exists." );
      return;
    }

    prev.objRecords[record.entity_id] = { id: record.entity_id, _destroyed: null };
    prev._value.push({id: record.entity_id});
  };

  var update = function(record, prev) {
    var objectRecord = prev.objRecords[record.entity_id];

    if (_.isNil(objectRecord)) {
      console.warn("Cannot update. Element does not exist.");
      return;
    }

    if (! _.isNil(objectRecord._destroyed)) {
      console.warn("Cannot update. Element has been destroyed.");
      return;
    }

    var latestTs = objectRecord[record.key];
    if ( (_.isString(latestTs)) && (latestTs > record.timestamp) ) {
      console.warn("Cannot update. Record is outdated. Ignoring. (" +latestTs+" > "+record.timestamp+")");
      return;
    }

    var el = findById(prev._value, record.entity_id);
    el[record.key] = record.value;
    objectRecord[record.key] = record.timestamp;

  };

  var destroy = function(record, prev){
    var objectRecord = prev.objRecords[record.entity_id];
    objectRecord[record.entity_id] = {_destroyed: true};

    _.remove(prev._value, function(el){ return el.id == record.entity_id; });
  };

  return function(record){
    if (! _.isNil(record)) {
      console.log("Making changes for record.")
      switch (record.type) {
        case "create":
          create(record, previous);
          break;
        case "update":
          update(record, previous);
          break;
        case "destroy":
          destroy(record, previous);
          break;
      }
    }

    return Immutable.fromJS(previous._value);
  };
};

function RecordSet(){
  this.foldp = genFoldp();
  this.ee = new EventEmitter2();
  this.builder = new RecordPack.Builder();
  this._value = Immutable.List();
}

RecordSet.prototype.value = function(){
  return this._value;
};

RecordSet.prototype.on = function(ev, fn){
  if (ev != "change"){
    throw "Event type '" + Object.prototype.toString(ev) + "' not supported.";
  }

  if (! _.isFunction(fn)) {
    throw "Second argument must be callable";
  }

  this.ee.on("change", fn);
};

RecordSet.prototype.create = function(props){
  var c1 = this.builder.buildCreateRecord(),
      changes = [c1];

  _.forOwn(props, function(v, k, obj){
    changes.push(this.builder.buildUpdateRecord(c1.entity_id, k, v));
  }.bind(this));

  this.apply(encode(changes));

  return c1.entity_id;
};

RecordSet.prototype.apply = function(updates, authoritative){
  if (_.isNil(authoritative)) { authoritative = true; }

  var previousValue = this.foldp();
  if (authoritative) {
    // notify on.changes.auth
  } else {
    // notify on.changes.local
  }

  _.each(decode(updates), function(record){
    this.foldp(record);
  }.bind(this));

  var nextValue = this.foldp();
  if (! nextValue.equals(previousValue)) {
    this.ee.emit('change', nextValue);
  }
};


module.exports = {RecordSet: RecordSet};

