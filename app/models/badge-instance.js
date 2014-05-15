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
    'evidenceUrl',
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
})

BadgeInstances.formatUserInput = function formatUserInput(obj) {
  return {
    slug: obj.slug || sha1(Date.now() + JSON.stringify(obj)),
    email: obj.email,
    issuedOn: obj.issuedOn || dateFromUnixtime(Date.now()),
    expires: obj.expires ? dateFromUnixtime(obj.expires) : null,
    claimCode: obj.claimCode,
    evidenceUrl: obj.evidenceUrl || null
  }
}

BadgeInstances.toResponse = function toResponse(row, req) {
  const relativeAssertionUrl = '/public/assertions/' + row.slug;
  const assertionUrl = req.resolvePath(relativeAssertionUrl);

  return {
    slug: row.slug,
    email: row.email,
    expires: row.expires,
    issuedOn: row.issuedOn,
    claimCode: row.claimCode,
    assertionUrl: assertionUrl,
    evidenceUrl: row.evidenceUrl,
    badge: row.badge ? row.badge.toResponse(req) : null
  }
};

BadgeInstances.validateRow = makeValidator({
  id: optional('isInt'),
  email: required('isEmail'),
  claimCode: optional('len', 0, 255),
  badgeId: required('isInt'),
})

exports = module.exports = BadgeInstances
