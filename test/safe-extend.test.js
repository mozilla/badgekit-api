const test = require('tap').test
const safeExtend = require('../app/lib/safe-extend')

test('safe extend', function (t) {
  const obj = {a: true, b: false}
  t.same(safeExtend(obj, {a: false, c: 'this should not set'}),
         {a: false, b: false})
  t.end()
})
