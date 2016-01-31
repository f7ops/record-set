
import EventEmitter from 'wolfy87-eventemitter'

const AUTHORITATIVE_TYPE = 0
const LOCAL_TYPE = 1

let recordSetApply = function(self, type, msgs){
  if ( type != AUTHORITATIVE_TYPE && type != LOCAL_TYPE ) throw "Invalid type passed to 'recordSetApply'"

  switch (type) {
    case AUTHORITATIVE_TYPE:
      self.aChanges.append(msgs);
      dedupe(self.lChanges, msgs);
      break;
    case LOCAL_TYPE:
      self.lChanges.append(msgs);
      break;
  }

  self.rebuild();
};

function RecordSet(initial, options) {

  this.base = initial;
  this.aChanges = [];
  this.lChanges = [];
  this.ee = new EventEmitter();

}

RecordSet.prototype.on = function(){
  this.ee.on.apply(this.ee, arguments);
};

RecordSet.prototype.off = function(){
  this.ee.off.apply(this.ee, arguments);
};

RecordSet.prototype.create = function(attrs){
  let messages = [];
  let cMessage = RecordSet.cMessage();
  var update;

  messages.append(cMessage);

  _.forOwn(v, k => {
    update = RecordSet.uMessage(cMessage.entity_id, k, v);
    messages.append(update);
  });

  recordSetApply(this, LOCAL_TYPE, messages);
};

RecordSet.prototype.update = function(id, props){

};

RecordSet.prototype.rebuild = function(){
  // sort arrays
  // apply all auth changes to base
  // apply all local changes to new base
  // fire change event
};

module.exports = RecordSet;



