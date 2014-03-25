const test = require('tap').test;
const Evidence = require('../app/models/evidence');

const closeDb = Evidence.db.close.bind(Evidence.db);

test('validating rows', function (t) {
  var errors;

  errors = Evidence.validateRow({
    applicationId: null
  });
  t.same(errors.length, 1);

  errors = Evidence.validateRow({
    id: 'tote',
    applicationId: 'bag',
    url: 'ridiculous-url',
    mediaType: 'neitherImageNorLink'
  });
  t.same(errors.length, 4);

  errors = Evidence.validateRow({
    id: 1,
    applicationId: 1,
    url: 'http://example.org/evidenceUrl',
    mediaType: 'link'
  });
  t.same(errors.length, 0);

  closeDb(); t.end();
})
