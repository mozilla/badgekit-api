const check = require('validator').check
const db = require('../lib/db');

const Issuers = db.table('issuers', {
  fields: [
    'id',
    'slug',
    'url',
    'name',
    'description',
    'email',
    'imageId'
  ],
});

Issuers.validateRow = function (row) {
  const errors = []
  this.fields.forEach(function (field) {
    try {
      const validator = validation[field] || noop
      validator(row[field])
    }
    catch(e) {
      e.field = field
      errors.push(e)
    }
  })
  return errors
}

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
  description: function (desc) {
    check(desc).len(0, 255);
  },
  email: function (email) {
    if (typeof email == 'undefined') return;
    check(email).isEmail();
  },
}

function noop() {}

exports = module.exports = Issuers;
