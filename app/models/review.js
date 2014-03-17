const db = require('../lib/db');
const makeValidator = require('../lib/make-validator');
const ReviewItems = require('./review-item');

const Reviews = db.table('reviews', {
  fields: [
    'id',
    'slug',
    'applicationId',
    'author',
    'comment'
  ],
  relationships: {
    application: {
      type: 'hasOne',
      local: 'applicationId',
      foreign: { table: 'applications', key: 'id' },
      optional: false
    },
    reviewItems: {
      type: 'hasMany',
      local: 'id',
      foreign: { table: 'reviewItems', key: 'reviewId' },
      optional: true
    }
  },
});

Reviews.validateRow = makeValidator({
  id: function (id) {
    if (typeof id == 'undefined' || id === null) return;
    this.check(id).isInt();
  },
  slug: function (slug) {
    this.check(slug).len(1, 50);
  },
  applicationId: function (id) {
    this.check(id).isInt();
  },
  author: function (email) {
    this.check(email).isEmail();
  }
});

exports = module.exports = Reviews;
