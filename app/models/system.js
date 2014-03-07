const db = require('../lib/db');
const validation = require('../lib/validation')

const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

const Systems = db.table('systems', {
  fields: [
    'id',
    'slug',
    'name',
    'url',
    'description',
    'email',
    'imageId',
    'webhook',
  ],
  relationships: {
    image: {
      type: 'hasOne',
      local: 'imageId',
      foreign: { table: 'images', key: 'id' },
      optional: true,
    },
    issuers: {
      type: 'hasMany',
      local: 'id',
      foreign: { table: 'issuers', key: 'systemId' },
      optional: true,
    },
  },
});

Systems.validateRow = makeValidator({
  id: optional('isInt'),
  slug: required('len', 1, 50),
  name: required('len', 1, 255),
  url: required('isUrl'),
  description: optional('len', 0, 255),
  email: optional('isEmail'),
  imageId: optional('isInt'),
  webhook: optional('isUrl')
});

exports = module.exports = Systems;
