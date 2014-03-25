const db = require('../lib/db');
const validation = require('../lib/validation');
const async = require('async');

const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

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
  methods: {
    setReviewItems: setReviewItems,
    del: del,
    toResponse: function () {
      return Reviews.toResponse(this)
    },
  }
});

Reviews.toResponse = function toResponse(row) {
  return {
    id: row.id,
    slug: row.slug,
    author: row.author,
    comment: row.comment,
    reviewItems: (row.reviewItems || []).map(function(reviewItem) {
      return ReviewItems.toResponse(reviewItem);
    })
  };
};

Reviews.validateRow = makeValidator({
  id: optional('isInt'),
  slug: required('len', 1, 255),
  applicationId: required('isInt'),
  author: required('isEmail')
});

function setReviewItems(reviewItems, callback) {
  var reviewItemIds = [];
  const reviewId = this.id;
  async.each(reviewItems, function(reviewItem, done) {
    reviewItem.reviewId = reviewId;
    ReviewItems.put(reviewItem, function(err, result) {
      if (err)
        return done(err);

      const rowId = result.insertId || result.row.id;
      reviewItemIds.push(rowId);

      return done();
    });
  },
  function done(err) {
    if (err)
      return callback(err);

    // Now that we have added all the new reviewItems, we want to delete any old reviewItems attached to this review
    const deleteQuery = { 
      reviewId: {
        value: reviewId,
        op: '='
      }
    };

    if (reviewItemIds.length) {
      deleteQuery.id = reviewItemIds.map(function(reviewItemId) {
        return {
          op: '!=',
          value: reviewItemId
        };
      });
    }

    ReviewItems.del(deleteQuery, function(err) {
      if (err)
        return callback(err);

      Reviews.getOne({ id: reviewId }, { relationships: true }, callback);
    });
  });
}

function del(callback) {
  const reviewId = this.id;
  ReviewItems.del({ reviewId: reviewId }, function(err) {
    if (err)
      callback(err);

    Reviews.del({ id: reviewId }, callback);
  });
};

exports = module.exports = Reviews;
