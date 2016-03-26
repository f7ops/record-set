
# Record Set

 { a, b, c } <== [ c, u, u, r, c, c, u ...

 c - create message
 u - update message
 r - remove message


```
var RecordSet = require('record-set'),
    set = new RecordSet(base = {});

// Hide record generation / convenience
set.create({things: "things", stuff: "stuff"}) // => id
set.update(id, {stuff: "things"})
set.remove(id);

// Core
set.apply(changeString, local = false)
set.value()

// Event stuff
set.on('change', function(){})
set.changes.applied // TODO -- probably not this..
set.changes.local

// TODO -- base backup method (probably all auth/local changes taken as authoritative)
```

Note: base-backups can just be applied using `apply`.



### Base backups

Base backups are just a compact version of the world at a particular point. They do not include the out-dated records that have since been usurped.


License
-------

Copyright 2016 Will O'Brien

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
