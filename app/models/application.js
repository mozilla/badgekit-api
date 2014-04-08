const db = require('../lib/db');
const validation = require('../lib/validation');
const async = require('async');

const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

const Evidence = require('./evidence');
const Reviews = require('./review');

const Applications = db.table('applications', {
  fields: [
    'id',
    'slug',
    'badgeId',
    'learner',
    'created',
    'assignedTo',
    'assignedExpiration',
    'processed',
    'programId',
    'issuerId',
    'systemId'
  ],
  relationships: {
    badge: {
      type: 'hasOne',
      local: 'badgeId',
      foreign: { table: 'badges', key: 'id' },
      optional: false,
    },
    reviews: {
      type: 'hasMany',
      local: 'id',
      foreign: { table: 'reviews', key: 'applicationId' },
      optional: true
    },
    evidence: {
      type: 'hasMany',
      local: 'id',
      foreign: { table: 'evidence', key: 'applicationId' },
      optional: true
    }
  },
  methods: {
    setEvidence: setEvidence,
    del: del,
    toResponse: function (request) {
      return Applications.toResponse(this, request)
    }
  }
});

Applications.toResponse = function toResponse(row, request) {
  return {
    id: row.id,
    slug: row.slug,
    learner: row.learner,
    created: row.created,
    assignedTo: row.assignedTo,
    assignedExpiration: row.assignedExpiration,
    badge: row.badge ? row.badge.toResponse(request) : null,
    evidence: (row.evidence || []).map(function(evidence) {
      return Evidence.toResponse(evidence, request);
    })
  };
};

Applications.validateRow = makeValidator({
  id: optional('isInt'),
  slug: required('len', 1, 255),
  badgeId: required('isInt'),
  learner: required('isEmail'),
  assignedTo: optional('isEmail'),
  assignedExpiration: optional('isDate'),
  processed: optional('isDate'),
  programId: optional('isInt'),
  issuerId: optional('isInt'),
  systemId: optional('isInt')
});

function setEvidence(evidence, callback) {
  var evidenceIds = [];
  const applicationId = this.id;
  async.each(evidence, function(evidenceItem, done) {
    evidenceItem.applicationId = applicationId;
    Evidence.put(evidenceItem, function(err, result) {
      if (err)
        return done(err);

      const rowId = result.insertId || result.row.id;
      evidenceIds.push(rowId);

      return done();
    });
  },
  function done(err) {
    if (err)
      return callback(err);

    // Now that we have added all the new evidence, we want to delete any old evidence attached to this application
    const deleteQuery = { 
      applicationId: {
        value: applicationId,
        op: '='
      }
    };

    if (evidenceIds.length) {
      deleteQuery.id = evidenceIds.map(function(evidenceId) {
        return {
          op: '!=',
          value: evidenceId
        };
      });
    }

    Evidence.del(deleteQuery, function(err) {
      if (err)
        return callback(err);

      Applications.getOne({ id: applicationId }, { relationships: true }, callback);
    });
  });
}

function del(callback) {
  const applicationId = this.id;
  Evidence.del({ applicationId: applicationId }, function(err) {
    if (err)
      callback(err);

    Applications.del({ id: applicationId }, callback);
  });
};

exports = module.exports = Applications;
