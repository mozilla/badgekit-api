const db = require('../lib/db');
const makeValidator = require('../lib/make-validator')
const check = require('validator').check;

const Issuers = db.table('issuers', {
  fields: [
    'id',
    'slug',
    'name',
    'url',
    'description',
    'email',
    'imageId'
  ],
});

Issuers.validateRow = makeValidator({
  id: function (id) {
    if (typeof id == 'undefined') return;
    check(id).isInt();
  },
  slug: function (slug) {
    check(slug).len(1, 50);
  },
  name: function (name) {
    check(name).len(1, 50);
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
})

exports = module.exports = Issuers;
