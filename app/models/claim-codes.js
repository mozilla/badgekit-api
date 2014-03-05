const db = require('../lib/db');
const crypto = require('crypto')
const ClaimCodes = db.table('claimCodes', {
  fields: [
    'id',
    'code',
    'claimed',
    'email',
    'multiuse',
    'badgeId',
  ],
  relationships: {
    badge: {
      type: 'hasOne',
      local: 'badgeId',
      foreign: { table: 'badges', key: 'id' },
      optional: false,
    }
  },
})

ClaimCodes.fromUserInput = function fromUserInput(obj) {
  return {
    code: obj.code,
    email: obj.email,
    claimed: isEmpty(obj.claimed) ?  false : true,
    multiuse: isEmpty(obj.multiuse) ? false : true,
  }
}

ClaimCodes.makeRandom = function makeRandom(len) {
  const letters = '0123456789abcdef'
  const rando = new Buffer(len)
  const bytes = crypto.randomBytes(len)
  for (var i = 0; i < bytes.length; i++)
    rando[i] = letters[bytes[i] % letters.length].charCodeAt(0)
  return rando.toString('utf8')
}

function sha1(data) {
  crypto.createHash('sha1').update(data).digest('hex')
}

function isEmpty(v) {
  return typeof v === 'undefined' || v === null
}

exports = module.exports = ClaimCodes
