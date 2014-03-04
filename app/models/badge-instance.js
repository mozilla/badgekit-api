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
function sha1(body) {
  return crypto.createHash('sha1').update(body).digest('hex')
}
