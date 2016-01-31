
### This section describes local changes and the state that results

## All tests start out with local set:
##  { A, B }

describe "adds", ->
  beforeEach
    @s = new RecSet(base, [], [])

  xit "was added"
  xit "has correct latest()", ->
  xit "emits 'data'"

  xit "issues an add message"

describe "update", ->

  beforeEach
    expected = {thing}
    @s = new RecSet(base, [], [])

  xit "has correct latest()"
  xit "emits 'data'"
  xit "issues an update message"

describe "remove", ->

  beforeEach ->
    start = {thing, stuff}
    expected = {thing}
    @s = new RecSet({thing, stuff}, [], [])

  xit "has correct latest()"
  xit "emits 'data'"
  xit "issues a delete message"

describe "tx", ->

  xit "emits one 'data'"
  xit "has correct latest()"
  xit "issues a compound message"


