
var Immutable = require('immutable'),
    _ = require('lodash'),
    RecordPack = require('record-pack'),
    encode = RecordPack.toString,
    decode = RecordPack.fromString,
    LogMinimum = require('./log-minimum');

function RecordSet(){

  this.logs = new LogMinimum();
  this.set = Immutable.Map({});

}

function build(records) {
  var types = _(records).map("type").uniq();

  if (  types.includes('destroy')) return null;
  if (! types.includes('create') ) return null;

  var map = Immutable.Map({id: records[0].entity_id});
  _(records).each(function(rec){
    if (rec.type == 'update') {
      map = map.set(rec.key, rec.value);
    }
  });

  return map;
}

RecordSet.prototype.apply = function(recs){
  var records = (_.isString(recs)) ? [].concat(decode(recs)) : [].concat(recs);

  this.logs.apply(records);

  _(records).map("entity_id").uniq().each(function(eid){
    var entity = build(this.logs.getRecords(eid));
    if (! _.isNull(entity)) {
      this.set = this.set.set(eid, entity);
    } else {
      this.set = this.set.remove(eid);
    }
  }.bind(this));
  return this;
};

RecordSet.prototype.toJS = function(){
  return this.set.toSet().toJS();
};

RecordSet.prototype.toImmutable = function(){
  return this.set.toSet();
};

RecordSet.prototype.toRecords = function(){
  return this.logs.getRecords();
};


RecordSet.RecordPack = RecordPack;
module.exports = RecordSet;

