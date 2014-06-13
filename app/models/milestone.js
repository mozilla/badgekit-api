const Promise = require('bluebird')
const _ = require('lodash')
const db = require('../lib/db');
const customError = require('../lib/custom-error')
const validation = require('../lib/validation');
const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

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


Milestones.findEligible = function findEligible(user, recentBadge) {
  const NoMilestonesError = customError('NoMilestonesError');
  const NoUnearnedError = customError('NoUnearnedError');
  const MilestoneBadges = require('./milestone-badge');
  const BadgeInstances = require('./badge-instance');

  var relatedMilestones;
  var unearnedMilestones;
  var userBadgeIds;

  return new Promise(function (resolve, reject) {
    const options = { relationships: true };
    const query = { badgeId: recentBadge.id };
    MilestoneBadges.get(query, options)
      .then(function (relatedMilestoneBadges) {
        if (!relatedMilestoneBadges.length)
          throw new NoMilestonesError('No related milestones');

        relatedMilestones = _.pluck(relatedMilestoneBadges, 'milestone');

        return BadgeInstances.get({ email: user });
      })
      .then(function (userBadges) {
        userBadgeIds = _.pluck(userBadges, 'badgeId');
        unearnedMilestones = relatedMilestones.filter(function (m) {
          return userBadgeIds.indexOf(m.primaryBadgeId) == -1;
        });

        if (!unearnedMilestones.length)
          throw new NoUnearnedError('No unearned milestones');

        const unearnedMilestoneIds = _.pluck(unearnedMilestones, 'id');
        const query = { id: unearnedMilestoneIds };
        const options = { relationships: true };

        return Milestones.get(query, options)
      })

      .then(function (unearnedMilestones) {
        const eligibleMilestones = unearnedMilestones.filter(function (m) {
          const supportBadgeIds = _.pluck(m.supportBadges, 'id');
          const earnedSupportBadges = _.intersection(supportBadgeIds, userBadgeIds);
          return earnedSupportBadges.length >= m.numberRequired;
        })

        return resolve(eligibleMilestones);
      })

      .catch(NoMilestonesError, NoUnearnedError, function () {
        return resolve([]);
      })

      .catch(reject);
  });
};

Milestones.findAndAward = function findAndAward(user, badge) {
  const BadgeInstances = require('./badge-instance')
  return new Promise(function (resolve, reject) {
    Milestones.findEligible(user, badge)
      .then(function (milestones) {
        return Promise.all(milestones.map(function (m) {
          const instance = BadgeInstances.formatUserInput({email: user})
          instance.badgeId = m.primaryBadgeId;
          return BadgeInstances.put(instance);
        }));
      })

      .then(function (results) {
        const rows = results.map(function (result) {
          result.row.id = result.insertId;
          return result.row
        })
        return resolve(rows);
      })

      .catch(reject)
  })
}

Milestones.toResponse = function toResponse(obj) {
  const Badges = require('./badge')
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
  action: optional(function (value) {
    const valid = ['issue', 'queue-application']
    if (valid.indexOf(value) == -1)
      throw new TypeError('Value must be one of the following: ' + valid.join(', '))
  })
});

function prop(name) {
  return function (o) {
    return o[name]
  }
}
module.exports = Milestones;
