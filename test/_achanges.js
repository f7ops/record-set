
# Authoritative changes

describe "Authoritative changes"

  context "message is stale (base-backup accounts)"
    xit "ignores +C"
    xit "ignores +U"
    xit "ignores +D"

  context "message has more recent local change"
    xit "applies (id & changes) +C"
    xit "applies +U first, latter change second"
    xit "deletes +D"

  context "message is novel"
    xit "applies +C"
    xit "applies +U"
    xit "applies +D"

does not allow deleted things to be updated



  describe "update -- "
    context "when stale"
      xit "does nothing"
    context "when valid"
      xit "applies cleanly"
      xit "does not override more-recent local change"
      xit "overrides less-recent local change"
      xit "dedupes it's local counterpart"
  describe "add -- "
    context "when stale"
      xit "does nothing"
    context "when valid"
      xit "applies cleanly"
      xit "does not override more-recent local change"
      xit "overrides less-recent local change"
      xit "dedupes it's local counterpart"
  describe "remove -- "
    context "when stale"
      xit "result is still deleted"
      xit "result is still deleted"
    context "when valid"
      xit "applies cleanly"
      xit "does not override more-recent local change"
      xit "overrides less-recent local change"
      xit "dedupes it's local counterpart"

# Local changes

describe "Local change:"

   xit "overrides local if more recent"
   xit "does not override local if less recent"
context "change accounted for in base backup"
  xit  "AddMessage"
context "no local changes"

describe "typical updat"

describe "override local changes"
describe "do nothing if base backup is more recent"
describe "remove old local changes"
describe "do nothing if more recent things have happened locally"
