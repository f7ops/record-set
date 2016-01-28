
import EventEmitter from 'wolfy87-eventemitter'

function RecordSet(initial, options) {

  this.base = initial;
  this.aChanges = [];
  this.lChanges = [];
  this.ee = new EventEmitter();

}

RecordSet.prototype.on = function(){
  console.log(this.ee);
}


module.exports = RecordSet;



