const test = require('tap').test;
const Badges = require('../app/models/badge');

const closeDb = Badges.db.close.bind(Badges.db);

test('validating rows', function (t) {
  var errors;

  errors = Badges.validateRow({
    id: 'hi',
    slug: null,
    name: null,
    strapline: null,
    description: Array(500).join('lo'),
  });
  t.same(errors.length, 5);

  errors = Badges.validateRow({
    id: 1,
    slug: 'chicago-badge',
    name: 'Chicago Badge',
    strapline: 'A badge for Chicago',
    description: Array(255).join('l'),
  });
  t.same(errors.length, 0);

  errors = Badges.validateRow({
    slug: 'test-badge',
    name: 'Test Badge',
    strapline: 'A badge for testing',
  });
  t.same(errors.length, 0);

  closeDb(); t.end();
})
