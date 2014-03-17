const test = require('tap').test;
const Applications = require('../app/models/application');

const closeDb = Applications.db.close.bind(Applications.db);

test('validating rows', function (t) {
  var errors;

  errors = Applications.validateRow({
    slug: null,
    badgeId: null,
    learner: null
  });
  t.same(errors.length, 3);

  errors = Applications.validateRow({
    id: 'tote',
    slug: Array(255).join('lo'),
    badgeId: 'bag',
    learner: 'ridiculous-email',
    assignedTo: 'not an email address',
    assignedExpiration: 'decidely non-datelike',
    webhook: 'what is this nonsense',
    processed: 'also definitely not a date'
  });
  t.same(errors.length, 8);

  errors = Applications.validateRow({
    id: 1,
    slug: 'app-1',
    badgeId: 1,
    learner: 'normal.email@example.org',
    assignedTo: 'plain.email@example.org',
    assignedExpiration: 'March 9, 1979 12:00:00',
    webhook: 'http://example.org/webhook',
    processed: '3-22-2013 12:11 PM'
  });
  t.same(errors.length, 0);

  closeDb(); t.end();
})
