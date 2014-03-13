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
    'systemId',
  ],
  relationships: {
    image: {
      type: 'hasOne',
      local: 'imageId',
      foreign: { table: 'images', key: 'id' },
      optional: true,
    },
    system: {
      type: 'hasOne',
      local: 'systemId',
      foreign: { table: 'systems', key: 'id' },
      optional: true,
    },
    programs: {
      type: 'hasMany',
      local: 'id',
      foreign: { table: 'programs', key: 'issuerId' },
      optional: true,
    },
  },
});

Issuers.validateRow = makeValidator({
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
    if (typeof email == 'undefined') return;
    this.check(email).isEmail();
  },
  imageId: optionalInt,
  systemId: optionalInt,
});

function optionalInt(id) {
  if (typeof id == 'undefined' || id === null) return;
  this.check(id).isInt();
}

exports = module.exports = Issuers;
