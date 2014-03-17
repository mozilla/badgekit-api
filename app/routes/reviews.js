const safeExtend = require('../lib/safe-extend')
const Reviews = require('../models/review');
const Applications = require('../models/application');
const Badges = require('../models/badge');

const errorHelper = require('../lib/error-helper')
const middleware = require('../lib/middleware')
const hashString = require('../lib/hash-string')
const request = require('request')
const log = require('../lib/logger')

const dbErrorHandler = errorHelper.makeDbHandler('application')

exports = module.exports = function applyReviewRoutes (server) {
  server.get('/systems/:systemSlug/badges/:badgeSlug/applications/:applicationSlug/reviews', [
    middleware.findSystem(),
    middleware.findBadge({where: {systemId: ['system', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    showAllReviews,
  ]);
  server.get('/systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug/applications/:applicationSlug/reviews', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findBadge({where: {issuerId: ['issuer', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    showAllReviews,
  ]);
  server.get('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug/applications/:applicationSlug/reviews', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    middleware.findBadge({where: {programId: ['program', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    showAllReviews,
  ]);
  function showAllReviews (req, res, next) {
    var query = { applicationId : req.application.id };
    var options = {relationships: true};

    Reviews.get(query, options, function foundRows (error, rows) {
      if (error)
        return dbErrorHandler(error, null, res, next);

      res.send({reviews: rows.map(Reviews.toResponse)});
      return next();
    });
  }


  server.get('/systems/:systemSlug/badges/:badgeSlug/applications/:applicationSlug/reviews/:reviewSlug', [
    middleware.findSystem(),
    middleware.findBadge({where: {systemId: ['system', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    middleware.findReview({relationships: true, where: {applicationId: ['application', 'id']}}),
    showOneApplication,
  ]);
  server.get('/systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug/applications/:applicationSlug/reviews/:reviewSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findBadge({where: {issuerId: ['issuer', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    middleware.findReview({relationships: true, where: {applicationId: ['application', 'id']}}),
    showOneApplication,
  ]);
  server.get('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug/applications/:applicationSlug/reviews/:reviewSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    middleware.findBadge({where: {programId: ['program', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    middleware.findReview({relationships: true, where: {applicationId: ['application', 'id']}}),
    showOneApplication,
  ]);
  function showOneApplication (req, res, next) {
    res.send({review: req.review.toResponse()});
    return next();
  }

  server.post('/systems/:systemSlug/badges/:badgeSlug/applications/:applicationSlug/reviews', [
    middleware.findSystem(),
    middleware.findBadge({relationships: true, where: {systemId: ['system', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    createReview,
  ]);
  server.post('/systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug/applications/:applicationSlug/reviews', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findBadge({relationships: true, where: {issuerId: ['issuer', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    createReview,
  ]);
  server.post('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug/applications/:applicationSlug/reviews', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    middleware.findBadge({relationships: true, where: {programId: ['program', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    createReview,
  ]);
  function createReview (req, res, next) {
    const reviewItems = req.body.reviewItems;
    const row = fromPostToRow(req.body);

    row.applicationId  = req.application.id;

    row.slug = hashString(Date.now().toString() + row.author),

    putReview(row, req.application, reviewItems, req.badge.criteria, function (err, review) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, row, res, next);
        return res.send(400, errorHelper.validation(err));
      }

      return res.send(201, {
        status: 'created',
        review: review.toResponse()
      });
    });
  }

  server.put('/systems/:systemSlug/badges/:badgeSlug/applications/:applicationSlug/reviews/:reviewSlug', [
    middleware.findSystem(),
    middleware.findBadge({relationships: true, where: {systemId: ['system', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    middleware.findReview({where: {applicationId: ['application', 'id']}}),
    updateReview,
  ]);
  server.put('/systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug/applications/:applicationSlug/reviews/:reviewSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findBadge({relationships: true, where: {issuerId: ['issuer', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    middleware.findReview({where: {applicationId: ['application', 'id']}}),
    updateReview,
  ]);
  server.put('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug/applications/:applicationSlug/reviews/:reviewSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    middleware.findBadge({relationships: true, where: {programId: ['program', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    middleware.findReview({where: {applicationId: ['application', 'id']}}),
    updateReview,
  ]);
  function updateReview (req, res, next) {
    const row = safeExtend(req.review, req.body);
    const reviewItems = req.body.reviewItems;

    delete row.created;

    putReview(row, req.application, reviewItems, req.badge.criteria, function (err, review) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, row, res, next);
        return res.send(400, errorHelper.validation(err));
      }

      return res.send({
        status: 'updated',
        review: review.toResponse()
      });
    });
  }

  server.del('/systems/:systemSlug/badges/:badgeSlug/applications/:applicationSlug/reviews/:reviewSlug', [
    middleware.findSystem(),
    middleware.findBadge({where: {systemId: ['system', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    middleware.findReview({where: {applicationId: ['application', 'id']}}),
    deleteReview,
  ]);
  server.del('/systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug/applications/:applicationSlug/reviews/:reviewSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findBadge({where: {issuerId: ['issuer', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    middleware.findReview({where: {applicationId: ['application', 'id']}}),
    deleteReview,
  ]);
  server.del('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug/applications/:applicationSlug/reviews/:reviewSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    middleware.findBadge({where: {programId: ['program', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    middleware.findReview({where: {applicationId: ['application', 'id']}}),
    deleteReview,
  ]);
  function deleteReview (req, res, next) {
    const row = req.review;
    Reviews.del({id: row.id}, function (err, result) {
      if (err)
        return dbErrorHandler(err, row, req, next);

      res.send({
        status: 'deleted',
        review: row.toResponse()
      });
    });
  }
};

function putReview (row, application, reviewItems, criteria, callback) {
  reviewItems = reviewItems || [];
  criteria = criteria || [];

  function done(err, newRow) {
    if (err)
      return callback(err);

    if (application.webhook) {
      // quite likely we'll want to reuse the webhook.js model instead of handling these differently.
      // note that this is unsecured at the moment, need to investigate how to handle security for assessment webhooks
      request.post({
        url: application.webhook,
        json: {
          application: application.toResponse(),
          review: newRow.toResponse(),
          approved: checkCriteriaSatisifed()
        }
      }, function (err, res, body) {
        if (err)
          return log.warn({code: 'ReviewWebhookRequestError', error: err})
        else if (res.statusCode != 200)
          return log.warn({code: 'ReviewWebhookBadResponse', status: res.statusCode, body: body})
      });
    }

    callback(null, newRow);
  }

  function checkCriteriaSatisifed() {
    const requiredCriteriaIds = criteria.filter(function(criterion) { return criterion.required })
                                        .map(function(criterion) { return criterion.id })
                                        .sort();

    const satisfiedCriteriaIds = reviewItems.filter(function(item) { return item.satisfied })
                                            .map(function(item) { return item.criterionId })
                                            .sort();

    if (requiredCriteriaIds.length !== satisfiedCriteriaIds.length) {
      return false;
    }

    for (var i = 0; i < requiredCriteriaIds.length; i++) {
      if (requiredCriteriaIds[i] !== satisfiedCriteriaIds[i]) {
        return false;
      }
    }
    
    return true;
  }

  var validationErrors = Reviews.validateRow(row);
  if (validationErrors.length) {
    return callback(validationErrors);
  }

  Reviews.put(row, function(err, result) {
    if (err)
      return callback(err);

    const rowId = result.insertId || result.row.id;

    if (typeof reviewItems == 'undefined') {
      Reviews.getOne({id: rowId}, {relationships: true}, done);
    }
    else {
      Reviews.getOne({id: rowId}, function(err, row) {
        if (err)
          return callback(err);

        return row.setReviewItems(reviewItems, done);
      });
    }
  });
};


function fromPostToRow (post) {
  return {
    author: post.author,
    comment: post.comment
  };
}

