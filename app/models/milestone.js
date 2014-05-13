const db = require('../lib/db');
const validation = require('../lib/validation');
const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

const Badges = require('./badge')
const MilestoneBadges = require('./milestone-badge')

const Milestones = db.table('milestones', {
  fields: ['id', 'systemId', 'primaryBadgeId', 'numberRequired', 'action'],
  relationships: {
    system: {
      type: 'hasOne',
      local: 'systemId',
      foreign: { table: 'systems', key: 'id' },
    },
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
        local: 'milestoneId',
        foreign: 'badgeId',
      },
    },
  },
  methods: {
    toResponse: function () {
      return Milestones.toResponse(this)
    },
  },
});

Milestones.toResponse = function toResponse(obj) {
  const primaryBadge = obj.primaryBadge
      ? Badges.toResponse(obj.primaryBadge)
      : null;
  return {
    id: obj.id,
    action: obj.action,
    numberRequired: obj.numberRequired,
    primaryBadge: primaryBadge,
    supportBadges: (obj.supportBadges || []).map(Badges.toResponse),
  };
}

Milestones.validateRow = makeValidator({
  id: optional('isInt'),
  primaryBadgeId: required('isInt'),
  numberRequired: required('isInt'),
});

module.exports = Milestones;
