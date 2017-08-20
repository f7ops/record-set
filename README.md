
# Record Set

 { a, b, c } <== [ c, u, u, r, c, c, u ...

 c - create message
 u - update message
 r - remove message

Changes can be created with [`record-pack`](https://github.com/f7ops/record-pack).

```
var RecordSet = require('record-set'),
    set = new RecordSet();

// Apply a change from 'record-pack'
set.apply([ ... ])
  => return self

// Object representation
set.toJS()
  => { ... }
set.toImmutableJs()
  => Immutable.js hashmap
set.toRecords();
  => Array of records required to rebuild set

// RecordPack accessible for convenience
//   dont forget to `apply` changes!
var b = new RecordSet.RecordPack.Builder();

b.create()
  => c1
b.update(id, "d", 4);
  => u1
b.update(id, "e", 4);
  => u2
b.destroy(id)
  => d1

set.apply([c1, u1, u2, d1]);
```

#### Make Changes to Set

`apply` -- changes, in the form of RecordPack records, can update the set.

#### Display

`toJS`
`toImmutable`
`toRecords`

License
-------

Copyright 2016 Will O'Brien

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
