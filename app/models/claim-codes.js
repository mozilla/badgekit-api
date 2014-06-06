const db = require('../lib/db');
const crypto = require('crypto')
const validation = require('../lib/validation');

const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

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
  methods: {
    toResponse: function () {
      return ClaimCodes.toResponse(this)
    },
  }
})

ClaimCodes.toResponse = function toResponse (row) {
  return {
    id: row.id,
    code: row.code,
    claimed: !!row.claimed,
    email: row.email,
    multiuse: !!row.multiuse,
    badge: maybeObject(row.badge),
  }
}
function maybeObject(obj) {
  return (obj && obj.id) ? (obj.toResponse ? obj.toResponse() : obj) : undefined
}

ClaimCodes.validateRow = makeValidator({
  id: optional('isInt'),
  code: required('len', 1),
  email: optional('isEmail'),
  badgeId: required('isInt'),
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
  const alphanums = '0123456789abcdef'
  const rando = new Buffer(len)
  const bytes = crypto.randomBytes(len)
  for (var i = 0; i < bytes.length; i++)
    rando[i] = alphanums[bytes[i] % alphanums.length].charCodeAt(0)
  return rando.toString('utf8')
}

function isEmpty(v) {
  return typeof v === 'undefined' || v === null
}

exports = module.exports = ClaimCodes
