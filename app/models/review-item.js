const db = require('../lib/db');
const makeValidator = require('../lib/make-validator');

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
  id: function (id) {
    if (typeof id == 'undefined' || id === null) return;
    this.check(id).isInt();
  },
  reviewId: function (id) {
    this.check(id).isInt();
  },
  criterionId: function (id) {
    this.check(id).isInt();
  },
  satisfied: function (bool) {
    this.check(bool).isIn(['0','1','true','false']);
  }
});

exports = module.exports = ReviewItems;