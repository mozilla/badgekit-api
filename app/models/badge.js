const db = require('../lib/db');
const makeValidator = require('../lib/make-validator')

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
    this.check(id).isInt();
  },
  slug: function (slug) {
    this.check(slug).len(1, 50);
  },
  name: function (name) {
    this.check(name).len(1, 255);
  },
  strapline: function (text) {
    this.check(text).len(0, 50);
  },
  description: function (desc) {
    this.check(desc).len(1, 255);
  },
  imageId: function (id) {
    if (typeof id == 'undefined') return;
    this.check(id).isInt();
  },
  issuerId: function (id) {
    if (typeof id == 'undefined') return;
    this.check(id).isInt();
  },
});


exports = module.exports = Badges;
