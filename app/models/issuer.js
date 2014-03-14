const db = require('../lib/db');
const validation = require('../lib/validation')

const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

const Issuers = db.table('issuers', {
  fields: [
    'id',
    'slug',
    'name',
    'url',
    'description',
    'email',
    'imageId',
    'systemId',
  ],
  relationships: {
    image: {
      type: 'hasOne',
      local: 'imageId',
      foreign: { table: 'images', key: 'id' },
      optional: true,
    },
    system: {
      type: 'hasOne',
      local: 'systemId',
      foreign: { table: 'systems', key: 'id' },
      optional: true,
    },
    programs: {
      type: 'hasMany',
      local: 'id',
      foreign: { table: 'programs', key: 'issuerId' },
      optional: true,
    },
  },
});

Issuers.validateRow = makeValidator({
  id: optional('isInt'),
  slug: required('len', 1, 255),
  name: required('len', 1, 255),
  url: required('isUrl'),
  description: optional('len', 0, 255),
  email: optional('isEmail'),
  imageId: optional('isInt'),
  systemId: optional('isInt'),
});

exports = module.exports = Issuers;
