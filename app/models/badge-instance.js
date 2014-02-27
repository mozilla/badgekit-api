const crypto = require('crypto')
const db = require('../lib/db');
const makeValidator = require('../lib/make-validator')

const BadgeInstances = db.table('badgeInstances', {
  fields: [
    'id',
    'slug',
    'email',
    'issuedOn',
    'expires',
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
    issuedOn: obj.issuedOn,
    expires: obj.expires ? dateFromUnixtime(obj.expires) : null,
  }
}

BadgeInstances.makeAssertion = function makeAssertion(instance) {
  const badge = instance.badge
  return {
    uid: instance.slug,
    recipient: {
      identity: 'sha256$' + sha256(instance.email),
      type: 'email',
      hashed: true,
    },
    badge: '/public/badges/' + [badge.id, badge.slug].join('-'),
    verify: {
      url: '/public/assertions/' + instance.slug,
      type: 'hosted',
    },
    issuedOn: instance.issuedOn ? +instance.issuedOn/1000|0 : undefined,
    expires: instance.expires ? +instance.expires/1000|0 : undefined,
  }
}

BadgeInstances.validateRow = makeValidator({
  id: optionalInt,
  email: function (email) {
    this.check(email).isEmail();
  },
  badgeId: function (id) {
    this.check(id).isInt();
  },
})

function optionalInt(id) {
  if (typeof id == 'undefined' || id === null) return;
  this.check(id).isInt();
}

exports = module.exports = BadgeInstances

function dateFromUnixtime(ut) {
  if ((''+ut).length === 13)
    return new Date(parseInt(ut, 10))
  const date = new Date(parseInt(ut, 10) * 1000)
  if ((''+date) === 'Invalid Date')
    return null
  return date
}
function sha256(body) {
  return crypto.createHash('sha256').update(body).digest('hex')
}
function sha1(body) {
  return crypto.createHash('sha1').update(body).digest('hex')
}
