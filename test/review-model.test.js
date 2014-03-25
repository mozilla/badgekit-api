const test = require('tap').test;
const Reviews = require('../app/models/review');

const closeDb = Reviews.db.close.bind(Reviews.db);

test('validating rows', function (t) {
  var errors;

  errors = Reviews.validateRow({
    slug: null,
    applicationId: null,
    author: null
  });
  t.same(errors.length, 3);

  errors = Reviews.validateRow({
    id: 'tote',
    slug: Array(255).join('lo'),
    applicationId: 'bag',
    author: 'ridiculous-email'
  });
  t.same(errors.length, 4);

  errors = Reviews.validateRow({
    id: 1,
    slug: 'review-1',
    applicationId: 1,
    author: 'normal.email@example.org',
    comment: 'blah blah'
  });
  t.same(errors.length, 0);

  closeDb(); t.end();
})
