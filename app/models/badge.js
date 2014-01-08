const check = require('validator').check;
const db = require('../lib/db');

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

Badges.validateRow = function (row) {
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
};

function noop() {}

exports = module.exports = Badges;
