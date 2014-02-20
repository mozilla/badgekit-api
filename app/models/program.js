const db = require('../lib/db');
const makeValidator = require('../lib/make-validator')
const Issuers = require('./issuer')

const Programs = db.table('programs', {
  fields: [
    'id',
    'slug',
    'name',
    'url',
    'description',
    'email',
    'imageId',
    'issuerId',
  ],
  relationships: {
    image: {
      type: 'hasOne',
      local: 'imageId',
      foreign: { table: 'images', key: 'id' },
      optional: true,
    },
    issuer: {
      type: 'hasOne',
      local: 'issuerId',
      foreign: { table: 'issuers', key: 'id' },
      optional: true,
    },
  },
});

Programs.getByIssuer = function getByIssuer(issuerSlug, callback) {
  Issuers.getOne({slug: issuerSlug}, function (err, issuer) {
    if (err) return callback(err)
    if (!issuer) return callback()
    const query = {issuerId: issuer.id}
    const opts = {relationships: true}
    Programs.get(query, opts, callback)
  })
}


Programs.validateRow = makeValidator({
  id: optionalInt,
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
  imageId: optionalInt,
  issuerId: optionalInt,
});

function optionalInt(id) {
  if (typeof id == 'undefined' || id === null) return;
  this.check(id).isInt();
}

exports = module.exports = Programs;
