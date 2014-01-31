const db = require('../lib/db');
const makeValidator = require('../lib/make-validator')

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

Programs.validateRow = makeValidator({
  id: function (id) {
    if (typeof id == 'undefined') return;
    this.check(id).isInt();
  },
  slug: function (slug) {
    this.check(slug).len(1, 50);
  },
  url: function (url) {
    this.check(url).isUrl();
  },
  email: function (email) {
    if (typeof email == 'undefined') return;
    this.check(email).isEmail();
  },
  name: function (name) {
    this.check(name).len(1, 255);
  },
  description: function (desc) {
    this.check(desc).len(1, 255);
  },
  imageId: function (id) {
    if (typeof id == 'undefined') return;
    this.check(id).isInt();
  },
});

exports = module.exports = Programs;
