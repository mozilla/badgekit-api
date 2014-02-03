const test = require('tap').test
const Systems = require('../app/models/system')

const closeDb = Systems.db.close.bind(Systems.db)

test('validating rows', function (t) {
  var errors;

  errors = Systems.validateRow({
    id: 'hi',
    slug: null,
    name: null,
    description: Array(500).join('lo'),
    url: null,
    email: 'not an email',
  })
  t.same(errors.length, 6)

  errors = Systems.validateRow({
    id: 1,
    slug: 'chicago',
    name: 'City of Chicago',
    description: Array(255).join('l'),
    url: 'http://cityofchicago.org',
    email: 'definitely-an-email@example.org',
  })
  t.same(errors.length, 0)


  errors = Systems.validateRow({
    slug: 'brian',
    name: 'Brian',
    url: 'https://bjb.io',
  })
  t.same(errors.length, 0)


  closeDb(); t.end()
})
