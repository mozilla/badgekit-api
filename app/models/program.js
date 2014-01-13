const check = require('validator').check;
const db = require('../lib/db');

const Programs = db.table('programs', {
  fields: [
    'id',
    'slug',
    'name',
    'description',
    'url',
    'email',
    'imageId',
  ],
  relationships: {
    image: {
      type: 'hasOne',
      local: 'imageId',
      foreign: { table: 'images', key: 'id' },
      optional: true,
    }
  }
});

Programs.validateRow = function (row) {
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
    check(url).isUrl();
  },
  email: function (email) {
    if (typeof email == 'undefined') return;
    check(email).isEmail();
  },
  name: function (name) {
    check(name).len(1, 255);
  },
  description: function (desc) {
    check(desc).len(1, 255);
  },
  imageId: function (id) {
    if (typeof id == 'undefined') return;
    check(id).isInt();
  },
};

function noop() {}

exports = module.exports = Programs;
