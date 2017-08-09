var _ = require('lodash');

// DataStruct to maintain a store of log LUB
function LogMinimum() {
  this.logs = {};
}

function compact(old, addition) {
  var x = old || [];
  var y = addition || [];

  var z = x.concat(y);

  var res = _.reduce(z, function(acc, next){
    if (acc.destroyed) return acc;

    switch (next.type) {
      case 'create':
        acc.created = next;
        break;
      case 'update':
        var key = "update." + next.key;

        if (acc[key]) {
          acc[key] = (acc[key].timestamp < next.timestamp) ? next : acc[key];
        } else {
          acc[key] = next;
        }

        break;
      case 'destroy':
        acc.destroyed = next;
        break;
    }

    return acc;

  }, {destroyed: false});

  if (res.destroyed) {
    return [res.destroyed];
  } else {
    delete res.destroyed;
  }

  var out = [];

  if (res.create) out = [res.create];
  delete res.create;

  return out.concat(_.values(res));
}


LogMinimum.prototype.apply = function(recs){
  if (_.isString(recs)) {
    throw "Cannot apply encoded records";
  }

  var records = _.isArray(recs) ? recs : [recs];
  var recordsByEid = _.groupBy(records, "entity_id");
  var touchedIds = _.keys(recordsByEid);

  _this = this;
  _.each(touchedIds, function(eid){
    _this.logs[eid] = compact(_this.logs[eid], recordsByEid[eid]);
  });
}

LogMinimum.prototype.getRecords = function(eid){ 
  if (_.isString(eid)) {
    return this.logs[eid];
  } else {
    return _(this.logs).values().flattenDeep().value();
  }
}

module.exports = LogMinimum;

