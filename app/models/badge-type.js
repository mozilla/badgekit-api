const util = require('util');
const db = require('../lib/db');
const validation = require('../lib/validation');

const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

const BadgeTypes = db.table('badgeTypes', {
  fields: [
    'id',
    'name',
    'programId',
    'issuerId',
    'systemId'
  ],
  relationships: {
    system: {
      type: 'hasOne',
      local: 'systemId',
      foreign: { table: 'systems', key: 'id' },
      optional: true,
    },
    issuer: {
      type: 'hasOne',
      local: 'issuerId',
      foreign: { table: 'issuers', key: 'id' },
      optional: true,
    },
    program: {
      type: 'hasOne',
      local: 'programId',
      foreign: { table: 'programs', key: 'id' },
      optional: true,
    }
  }
});

BadgeTypes.validateRow = makeValidator({
  id: optional('isInt'),
  name: required('len', 1, 255),
  issuerId: optional('isInt'),
  programId: optional('isInt'),
  systemId: optional('isInt')
});

exports = module.exports = BadgeTypes;
