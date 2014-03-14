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
  methods: {
    toResponse: function () {
      return Programs.toResponse(this)
    }
  }
});

Programs.toResponse = function toResponse(row) {
  return {
    id: row.id,
    slug: row.slug,
    url: row.url,
    name: row.name,
    description: row.description,
    email: row.email,
    imageUrl: row.image ? row.image.toUrl() : null,
  }
}

Programs.validateRow = makeValidator({
  id: optional('isInt'),
  slug: required('len', 1, 255),
  name: required('len', 1, 255),
  url: required('isUrl'),
  description: optional('len', 0, 255),
  email: optional('isEmail'),
  imageId: optional('isInt'),
  issuerId: optional('isInt'),
});

exports = module.exports = Programs;
