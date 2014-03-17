const db = require('../lib/db');
const validation = require('../lib/validation');

const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

const ReviewItems = db.table('reviewItems', {
  fields: [
    'id',
    'reviewId',
    'criterionId',
    'satisfied',
    'comment'
  ],
  relationships: {
    review: {
      type: 'hasOne',
      local: 'reviewId',
      foreign: { table: 'reviews', key: 'id' },
      optional: false
    },
    criteria: {
      type: 'hasOne',
      local: 'criterionId',
      foreign: { table: 'criteria', key: 'id' },
      optional: false
    }
  }
});

ReviewItems.validateRow = makeValidator({
  id: optional('isInt'),
  reviewId: required('isInt'),
  criterionId: required('isInt'),
  satisfied: required('isIn', ['1','0','true','false'])
});

exports = module.exports = ReviewItems;