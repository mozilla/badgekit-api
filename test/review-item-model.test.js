const test = require('tap').test;
const ReviewItems = require('../app/models/review-item');

const closeDb = ReviewItems.db.close.bind(ReviewItems.db);

test('validating rows', function (t) {
  var errors;

  errors = ReviewItems.validateRow({
    reviewId: null,
    criterionId: null,
    satisfied: null
  });
  t.same(errors.length, 3);

  errors = ReviewItems.validateRow({
    id: 'tote',
    reviewId: 'yo',
    criterionId: 'bag',
    satisfied: 'brigg'
  });
  t.same(errors.length, 4);

  errors = ReviewItems.validateRow({
    id: 1,
    reviewId: 1,
    criterionId: 1,
    satisfied: true,
    comment: 'blah blah'
  });
  t.same(errors.length, 0);

  closeDb(); t.end();
})
