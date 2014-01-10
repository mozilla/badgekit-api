const check = require('validator').check;
const db = require('../lib/db');

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

Images.validateRow = function (row) {
  return this.fields.reduce(function (errors, field) {
    try {
      const validator = validation[field] || noop;
      validator(row[field]);
    }
    catch(e) {
      e.field = field;
      errors.push(e);
    }
    return errors;
  }, []);
};

const validation = {
  id: function (id) {
    if (typeof id == 'undefined') return;
    check(id).isInt();
  },
  slug: function (slug) {
    check(slug).len(1, 50);
  },
  url: function (url) {
    if (typeof url == 'undefined') return;
    check(url).isUrl();
  },
  mimetype: function (type) {
    if (typeof type == 'undefined') return;
    // Do we need to check this against an actual list somewhere?
    check(type).is(/^[a-z]+\/\w+([-.]\w+)*(\+\w+)?$/i);
  }
};

function noop() {}

exports = module.exports = Images;
