const db = require('../lib/db');
const validation = require('../lib/validation');
const async = require('async');

const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

const Criteria = db.table('criteria', {
  fields: [
    'id',
    'description',
    'badgeId',
    'required', 
    'note'
  ]
});

const Badges = db.table('badges', {
  fields: [
    'id',
    'slug',
    'name',
    'strapline',
    'earnerDescription',
    'consumerDescription',
    'issuerUrl', 
    'rubricUrl',
    'criteriaUrl',
    'timeValue',
    'timeUnits',
    'limit',
    'unique',
    'created',
    'archived',
    'imageId',
    'systemId',
    'issuerId',
    'programId'
  ],
  relationships: {
    image: {
      type: 'hasOne',
      local: 'imageId',
      foreign: { table: 'images', key: 'id' },
      optional: true
    },
    system: {
      type: 'hasOne',
      local: 'systemId',
      foreign: { table: 'systems', key: 'id' },
      optional: true,
    },
    issuer: {
      type: 'hasOne',
      local: 'issuerId',
      foreign: { table: 'issuers', key: 'id' },
      optional: true,
    },
    program: {
      type: 'hasOne',
      local: 'programId',
      foreign: { table: 'programs', key: 'id' },
      optional: true,
    },
    criteria: {
      type: 'hasMany',
      local: 'id',
      foreign: { table: 'criteria', key: 'badgeId' }
    }
  },
  methods: {
    setCriteria: setCriteria
  }
});

Badges.validateRow = makeValidator({
  id: optional('isInt'),
  slug: required('len', 1, 50),
  name: required('len', 1, 255),
  strapline: optional('len', 0, 140),
  earnerDescription: required('len', 1),
  consumerDescription: required('len', 1),
  timeValue: optional('isInt'),
  timeUnits: optional('isIn', ['minutes','hours','days','weeks']),
  limit: optional('isInt'),
  unique: required('isIn', ['0','1','true','false']),
  criteriaUrl: required('isUrl'),
  imageId: optional('isInt'),
  programId: optional('isInt'),
  issuerId: optional('isInt'),
  systemId: optional('isInt'),
});

Criteria.validateRow = makeValidator({
  id: optional('isInt'),
  description: required('len', 1),
  required: required('isIn', ['0','1'])
});

function setCriteria(criteria, callback) {
  var criteriaIds = [];
  const badgeId = this.id;
  async.each(criteria, function(criterion, done) {
    criterion.badgeId = badgeId;
    Criteria.put(criterion, function(err, result) {
      if (err)
        return done(err);

      const rowId = result.insertId || result.row.id;
      criteriaIds.push(rowId);

      return done();
    });
  },
  function done(err) {
    if (err)
      return callback(err);

    // Now that we have added all the new criteria, we want to delete any old criteria attached to this badge
    const deleteQuery = { 
      badgeId: {
        value: badgeId,
        op: '='
      }
    };

    if (criteriaIds.length) {
      deleteQuery.id = criteriaIds.map(function(criterionId) {
        return {
          op: '!=',
          value: criterionId
        };
      });
    }

    Criteria.del(deleteQuery, function(err) {
      if (err)
        return callback(err);

      Badges.getOne({ id: badgeId }, { relationships: true }, callback);
    });
  });
}

exports = module.exports = Badges;
