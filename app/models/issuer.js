const db = require('../lib/db');
const makeValidator = require('../lib/make-validator')

const Issuers = db.table('issuers', {
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
  },
});

Issuers.validateRow = makeValidator({
  id: function (id) {
    if (typeof id == 'undefined') return;
    this.check(id).isInt();
  },
  slug: function (slug) {
    this.check(slug).len(1, 50);
  },
  name: function (name) {
    this.check(name).len(1, 255);
  },
  url: function (url) {
    this.check(url).isUrl();
  },
  description: function (desc) {
    this.check(desc).len(0, 255);
  },
  email: function (email) {
    if (typeof email == 'undefined') return;
    this.check(email).isEmail();
  },
  imageId: function (id) {
    if (typeof id == 'undefined') return;
    this.check(id).isInt();
  },
});

exports = module.exports = Issuers;
