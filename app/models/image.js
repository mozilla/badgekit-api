const db = require('../lib/db');
const validation = require('../lib/validation');

const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

const Images = db.table('images', {
  fields: [
    'id',
    'slug',
    'url',
    'mimetype',
    'data'
  ],
  methods: {
    toUrl: function toUrl () {
      if (this.url)
        return this.url.toString('ascii');

      if (!this.slug)
        return null;

      return '/images/' + this.slug.toString('ascii');
    }
  },
});

Images.validateRow = makeValidator({
  id: optional('isInt'),
  slug: required('len', 1, 255),
  url: optional('isUrl'),
  mimetype: optional('is', /^[a-z]+\/\w+([-.]\w+)*(\+\w+)?$/i),
});

exports = module.exports = Images;
