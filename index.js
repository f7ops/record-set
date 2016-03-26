
var EventEmitter2 = require('eventemitter2').EventEmitter2,
    Immutable = require('immutable'),
    _ = require('lodash'),
    RecordPack = require('record-pack'),
    encode = RecordPack.toString,
    decode = RecordPack.fromString;

genFoldp = function(){
  var previous = {
    _value: [],
    objRecords: {}
  };

  var findById = function(coll, id){
    return _.find(coll, function(el){ return (el.id == id); });
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
    prev.objRecords[record.entity_id] = { _destroyed: true };
    _.remove(prev._value, function(el){ return el.id == record.entity_id; });
  };

  return function(record){
    if (! _.isNil(record)) {
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
  this.changes = {
    local: {
      pipe: function(fn){
        this.ee.on('local', function(data){
          fn(data);
        });
      }.bind(this)
    },
    auth: {
      pipe: function(fn){
        this.ee.on('auth', function(data){
          fn(data);
        });
      }.bind(this)
    }
  };
}

RecordSet.prototype.value = function(){
  return this.foldp();
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

  this.apply(encode(changes), false);

  return c1.entity_id;
};

var findById = function(coll, id){
  return coll.find(function(el){ return (el.get('id') == id); });
};

RecordSet.prototype.update = function(id, props) {
  if(_.isNil(findById(this.value(), id))){
    throw "Cannot update nonexistent id '" +id+ "'.";
  }

  var changes = [];
  _.forOwn(props, function(v, k, obj){
    changes.push(this.builder.buildUpdateRecord(id, k, v));
  }.bind(this));

  this.apply(encode(changes), false);
};

RecordSet.prototype.destroy = function(id){
  if (! _.isString(id)) {
    throw "Identifier must be a string.";
  }

  var change = this.builder.buildDestroyRecord(id);

  this.apply(encode(change), false);
};

RecordSet.prototype.apply = function(updates, authoritative){
  if (_.isNil(authoritative)) { authoritative = true; }

  var previousValue = this.foldp();
  if (authoritative) {
    this.ee.emit('auth', updates);
  } else {
    this.ee.emit('local', updates);
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

