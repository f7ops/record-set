
import LamportTimestamp from 'swarm-stamp'
import { base64 as base64module } from 'swarm-stamp'


let base64 = base64module.int2base;

function Timestamp() {
  var opNumber = -1;
  var lastSecond = 0;
  return function (client){
    var seconds = (new Date()).valueOf() / 1000;
    var adjustedDate = Math.round(date % (1 << 30)); // range required by swarm-stamp
    lastSecond = seconds;
    opNumber++;
    if (opNumber > (1 << 30)) {
      throw "Too many ops / second. Expand op-limit or slow down.";
    }
    return new LamportTimestamp(base64(adjustedDate) + base64(opNumber), client).toString();
  };
}

module.exports = Timestamp;
