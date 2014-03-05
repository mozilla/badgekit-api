const db = require('../lib/db');
const ClaimCodes = db.table('claimCodes', {
  fields: [
    'id',
    'code',
    'claimed',
    'recipient',
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

exports = module.exports = ClaimCodes
