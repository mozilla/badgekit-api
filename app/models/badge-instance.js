const dateFromUnixtime = require('../lib/date-from-unixtime')
const db = require('../lib/db');
const validation = require('../lib/validation')
const sha1 = require('../lib/hash').sha1

const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

const BadgeInstances = db.table('badgeInstances', {
  fields: [
    'id',
    'slug',
    'email',
    'issuedOn',
    'expires',
    'claimCode',
    'badgeId',
  ],
  relationships: {
    badge: {
      type: 'hasOne',
      local: 'badgeId',
      foreign: { table: 'badges', key: 'id' },
      optional: false
    },
  },
});

BadgeInstances.formatUserInput = function formatUserInput(obj) {
  return {
    slug: obj.slug || sha1(Date.now() + JSON.stringify(obj)),
    email: obj.email,
    issuedOn: obj.issuedOn || dateFromUnixtime(Date.now()),
    expires: obj.expires ? dateFromUnixtime(obj.expires) : null,
    claimCode: obj.claimCode,
  };
};

BadgeInstances.validateRow = makeValidator({
  id: optional('isInt'),
  email: required('isEmail'),
  claimCode: optional('len', 0, 255),
  badgeId: required('isInt'),
});

exports = module.exports = BadgeInstances;
