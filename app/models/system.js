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
  methods: {
    toResponse: function () {
      return Systems.toResponse(this)
    }
  }
});

Systems.toResponse = function toResponse(row) {
  return {
    id: row.id,
    slug: row.slug,
    url: row.url,
    name: row.name,
    email: row.email,
    imageUrl: row.image ? row.image.toUrl() : null,
    issuers: row.issuers,
  }
}

Systems.validateRow = makeValidator({
  id: optional('isInt'),
  slug: required('len', 1, 255),
  name: required('len', 1, 255),
  url: required('isUrl'),
  description: optional('len', 0, 255),
  email: optional('isEmail'),
  imageId: optional('isInt'),
});

exports = module.exports = Systems;
