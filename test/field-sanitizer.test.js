const test = require('tap').test
const makeFieldSanitizer = require('../app/lib/make-field-sanitizer')

test('field sanitizer', function (t) {
  const fieldSanitizer = makeFieldSanitizer({fields: ['id', 'name', 'description']})
  console.dir(fieldSanitizer.fields)
  t.same(fieldSanitizer({id: 10, a: true, b: false}), {id: 10})
  t.same(fieldSanitizer({name: 'hi', id: 10, a: true, b: false}), {name: 'hi', id: 10})
  t.end()
})
