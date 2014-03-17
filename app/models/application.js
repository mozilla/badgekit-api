const db = require('../lib/db');
const makeValidator = require('../lib/make-validator');
const async = require('async');
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
    'webhook',
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
    },
  },
  methods: {
    setEvidence: setEvidence
  }
});

Applications.validateRow = makeValidator({
  id: optionalInt,
  slug: function (slug) {
    this.check(slug).len(1, 50);
  },
  badgeId: function (id) {
    this.check(id).isInt();
  },
  learner: function (email) {
    this.check(email).isEmail();
  },
  assignedTo: function (email) {
    if (typeof email == 'undefined' || email === null) return;
    this.check(email).isEmail();
  },
  assignedExpiration: function(date) {
    if (typeof date == 'undefined' || date === null) return;
    this.check(date).isDate();
  },
  webhook: function(url) {
    if (typeof url == 'undefined' || url === null) return;
    this.check(url).isUrl();
  },
  programId: optionalInt,
  issuerId: optionalInt,
  systemId: optionalInt
});

function optionalInt(id) {
  if (typeof id == 'undefined' || id === null) return;
  this.check(id).isInt();
}

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

    // Now that we have added all the new evidence, we want to delete any old evidence attached to this badge
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


exports = module.exports = Applications;
