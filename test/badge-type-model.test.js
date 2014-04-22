const test = require('tap').test;
const BadgeTypes = require('../app/models/badge-type');

const closeDb = BadgeTypes.db.close.bind(BadgeTypes.db);

test('validating rows', function(t) {
  var errors;

  errors = BadgeTypes.validateRow({
    id: 'foo',
    name: null,
    issuerId: 'foo',
    programId: 'foo',
    systemId: 'foo'
  });
  t.same(errors.length, 5);

  errors = BadgeTypes.validateRow({
    id: 1,
    name: 'SomeType',
    issuerId: 1,
    programId: 1,
    systemId: 1
  });
  t.same(errors.length, 0);

  closeDb(); t.end();
});
