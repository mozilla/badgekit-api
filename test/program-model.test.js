const test = require('tap').test
const Programs = require('../app/models/program')

const closeDb = Programs.db.close.bind(Programs.db)

test('validating rows', function (t) {
  var errors;

  errors = Programs.validateRow({
    id: 'hi',
    slug: null,
    name: null,
    description: Array(500).join('lo'),
    url: null,
    email: 'not an email',
  })
  t.same(errors.length, 6)

  errors = Programs.validateRow({
    id: 1,
    slug: 'chicago',
    name: 'City of Chicago',
    description: Array(255).join('l'),
    url: 'http://cityofchicago.org',
    email: 'definitely-an-email@example.org',
  })
  t.same(errors.length, 0)


  errors = Programs.validateRow({
    slug: 'brian',
    name: 'Brian',
    url: 'https://bjb.io',
  })
  t.same(errors.length, 0)


  closeDb(); t.end()
})
