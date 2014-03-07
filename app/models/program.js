const db = require('../lib/db');
const validation = require('../lib/validation');

const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

const Programs = db.table('programs', {
  fields: [
    'id',
    'slug',
    'name',
    'url',
    'description',
    'email',
    'imageId',
    'issuerId',
  ],
  relationships: {
    image: {
      type: 'hasOne',
      local: 'imageId',
      foreign: { table: 'images', key: 'id' },
      optional: true,
    },
    issuer: {
      type: 'hasOne',
      local: 'issuerId',
      foreign: { table: 'issuers', key: 'id' },
      optional: true,
    },
  },
});

Programs.validateRow = makeValidator({
  id: optional('isInt'),
  slug: required('len', 1, 50),
  name: required('len', 1, 255),
  url: required('isUrl'),
  description: optional('len', 0, 255),
  email: optional('isEmail'),
  imageId: optional('isInt'),
  issuerId: optional('isInt'),
});

exports = module.exports = Programs;
