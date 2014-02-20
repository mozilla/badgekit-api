const Programs = require('./program')
const Systems = require('./system')
const Issuers = require('./issuer')
const db = require('../lib/db');
const makeValidator = require('../lib/make-validator')

const Badges = db.table('badges', {
  fields: [
    'id',
    'slug',
    'name',
    'strapline',
    'description',
    'archived',
    'imageId',
    'systemId',
    'issuerId',
    'programId',
  ],
  relationships: {
    image: {
      type: 'hasOne',
      local: 'imageId',
      foreign: { table: 'images', key: 'id' },
      optional: true
    },
    system: {
      type: 'hasOne',
      local: 'systemId',
      foreign: { table: 'systems', key: 'id' },
      optional: true,
    },
    issuer: {
      type: 'hasOne',
      local: 'issuerId',
      foreign: { table: 'issuers', key: 'id' },
      optional: true,
    },
    program: {
      type: 'hasOne',
      local: 'programId',
      foreign: { table: 'programs', key: 'id' },
      optional: true,
    },
  }
});

Badges.getByProgram = function getByProgram(programSlug, callback) {
  Programs.getOne({slug: programSlug}, function (err, program) {
    if (err) return callback(err)
    if (!program) return callback()
    const query = {programId: program.id}
    const opts = {relationships: true}
    Badges.get(query, opts, callback)
  })
}
Badges.getByIssuer = function getByIssuer(issuerSlug, callback) {
  // should include all program badges as well
  const query = {slug: issuerSlug}
  const opts = {relationships: true}
  Issuers.getOne(query, opts, function (err, issuer) {
    if (err) return callback(err)
    if (!issuer) return callback()

    const programIds = issuer.programs.map(function (o) { return o.id })

    const query = {issuerId: issuer.id}
    const opts = {relationships: true}
    Badges.get(query, opts, function (err, issuerBadges) {
      if (err) return callback(err)

      const query = {programId: programIds}
      const opts = {relationships: true}
      Badges.get(query, opts, function (err, programBadges) {
        if (err) return callback(err)

        const allBadges = issuerBadges.concat(programBadges)
        return callback(null, allBadges)
      })
    })
  })
}



Badges.validateRow = makeValidator({
  id: optionalInt,
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
  imageId: optionalInt,
  programId: optionalInt,
  issuerId: optionalInt,
  systemId: optionalInt,
});

function optionalInt(id) {
  if (typeof id == 'undefined' || id === null) return;
  this.check(id).isInt();
}

exports = module.exports = Badges;
