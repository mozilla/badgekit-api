const db = require('../lib/db');
const makeValidator = require('../lib/make-validator')

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
});

Systems.validateRow = makeValidator({
  id: optionalInt,
  slug: function (slug) {
    this.check(slug).len(1, 255);
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
    if (typeof email == 'undefined' || email === null) return;
    this.check(email).isEmail();
  },
  imageId: optionalInt,
});

function optionalInt(id) {
  if (typeof id == 'undefined' || id === null) return;
  this.check(id).isInt();
}

exports = module.exports = Systems;
