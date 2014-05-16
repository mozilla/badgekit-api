const db = require('../lib/db');
const validation = require('../lib/validation');
const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

const MilestoneBadges = db.table('milestoneBadges', {
  fields: ['id', 'badgeId', 'milestoneId'],
  relationships: {
    badge: {
      type: 'hasOne',
      local: 'badgeId',
      foreign: { table: 'badges', key: 'id' },
    },
    milestone: {
      type: 'hasOne',
      local: 'milestoneId',
      foreign: { table: 'milestone', key: 'id' },
    },
  },
});

MilestoneBadges.validateRow = makeValidator({
  id: optional('isInt'),
  badgeId: optional('isInt'),
  milestoneId: optional('isInt'),
});

module.exports = MilestoneBadges;
