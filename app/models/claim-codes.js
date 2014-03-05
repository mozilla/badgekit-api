const db = require('../lib/db');
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

function isEmpty(v) {
  return typeof v === 'undefined' || v === null
}

exports = module.exports = ClaimCodes
