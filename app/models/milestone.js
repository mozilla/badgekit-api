const db = require('../lib/db');
const validation = require('../lib/validation');
const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

const Milestones = db.table('milestones', {
  fields: ['id', 'primaryBadgeId', 'numberRequired'],
  relationships: {
    primaryBadge: {
      type: 'hasOne',
      local: 'primaryBadgeId',
      foreign: { table: 'badges', key: 'id' },
    },
    supportBadges: {
      type: 'hasMany',
      local: 'id',
      foreign: {
        table: 'badges',
        key: 'id',
      },
      via: {
        table: 'milestoneBadges',
        local: 'id',
        foreign: 'badgeId',
      },
    },
  },
});

Milestones.validateRow = makeValidator({
  id: optional('isInt'),
  primaryBadge: required('isInt'),
  numberRequired: required('isInt'),
});

module.exports = Milestones;
