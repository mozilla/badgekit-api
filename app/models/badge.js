const db = require('../lib/db');
const makeValidator = require('../lib/make-validator')
const async = require('async')

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
    'timeValue',
    'timeUnits',
    'limit',
    'unique',
    'created',
    'archived',
    'imageId',
    'systemId',
    'issuerId',
    'programId',
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
  id: optionalInt,
  slug: function (slug) {
    this.check(slug).len(1, 50);
  },
  name: function (name) {
    this.check(name).len(1, 255);
  },
  strapline: function (text) {
    this.check(text).len(0, 140);
  },
  earnerDescription: function (desc) {
    this.check(desc).len(1);
  },
  consumerDescription: function (desc) {
    this.check(desc).len(1);
  },
  timeValue: function(val) {
    if (typeof val == 'undefined') return;
    this.check(val).isInt();
  },
  timeUnits: function(units) {
    if (typeof units == 'undefined') return;
    this.check(units).isIn(['minutes','hours','days','weeks']);
  },
  limit: optionalInt,
  unique: function(unique) {
    this.check(unique).isIn(['0','1']);
  },
  imageId: optionalInt,
  programId: optionalInt,
  issuerId: optionalInt,
  systemId: optionalInt,
});

Criteria.validateRow = makeValidator({
  id: optionalInt,
  description: function(desc) {
    this.check(desc).len(1);
  },
  required: function(required) {
    this.check(required).isIn(['0','1']);
  }
});

function optionalInt(id) {
  if (typeof id == 'undefined' || id === null) return;
  this.check(id).isInt();
}

function value(name) {
  return function (obj) {
    return obj[name]
  }
}

function setCriteria(criteria, callback) {
  var criteriaIds = [];
  const badgeId = this.id;
  async.each(criteria, function(criterion, innerCallback) {
    criterion.badgeId = badgeId;
    Criteria.put(criterion, function(err, result) {
      if (err) {
        return innerCallback(err);
      }

      if (result.insertId) {
        criteriaIds.push(result.insertId);
      }
      else {
        criteriaIds.push(result.row.id);
      }

      return innerCallback();
    });
  },
  function(err) {
    if (err)
      return callback(err);

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
