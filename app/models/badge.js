const db = require('../lib/db');
const makeValidator = require('../lib/make-validator')
const check = require('validator').check;

const Badges = db.table('badges', {
  fields: [
    'id',
    'slug',
    'name',
    'strapline',
    'description',
    'imageId',
    'issuerId',
    'archived'
  ],
  relationships: {
    image: {
      type: 'hasOne',
      local: 'imageId',
      foreign: { table: 'images', key: 'id' },
      optional: true
    }
  }
});

Badges.validateRow = makeValidator({
  id: function (id) {
    if (typeof id == 'undefined') return;
    check(id).isInt();
  },
  slug: function (slug) {
    check(slug).len(1, 50);
  },
  name: function (name) {
    check(name).len(1, 255);
  },
  strapline: function (text) {
    check(text).len(0, 50);
  },
  description: function (desc) {
    check(desc).len(1, 255);
  },
  imageId: function (id) {
    if (typeof id == 'undefined') return;
    check(id).isInt();
  },
  issuerId: function (id) {
    if (typeof id == 'undefined') return;
    check(id).isInt();
  },
});


exports = module.exports = Badges;
