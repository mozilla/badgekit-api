const test = require('tap').test;
const Badges = require('../app/models/badge');

const closeDb = Badges.db.close.bind(Badges.db);

test('validating rows', function (t) {
  var errors;

  errors = Badges.validateRow({
    id: 'hi',
    slug: null,
    name: null,
    strapline: Array(500).join('lo'),
    earnerDescription: '',
    consumerDescription: '',
    timeValue: 'not an int',
    timeUnits: 'not one of the enums',
    evidenceType: 'not one of the enums',
    unique: '2',
    criteriaUrl: 'what sort of wizardry is this'
  });
  t.same(errors.length, 11);

  errors = Badges.validateRow({
    id: 1,
    slug: 'chicago-badge',
    name: 'Chicago Badge',
    strapline: Array(140).join('l'),
    earnerDescription: Array(255).join('l'),
    consumerDescription: Array(255).join('l'),
    timeValue: '5',
    timeUnits: 'minutes',
    evidenceType: 'URL',
    unique: '1',
    criteriaUrl: 'http://definitely-a-url.com/'
  });
  t.same(errors.length, 0);

  errors = Badges.validateRow({
    slug: 'test-badge',
    name: 'Test Badge',
    strapline: 'A badge for testing',
  });
  t.same(errors.length, 4);

  closeDb(); t.end();
})
