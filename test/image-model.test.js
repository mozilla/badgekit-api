const test = require('tap').test;
const Images = require('../app/models/image');

const closeDb = Images.db.close.bind(Images.db);

test('validating rows', function (t) {
  var errors;

  errors = Images.validateRow({
    id: 'hi',
    slug: null,
    url: 'NOT A URL AT ALL',
    mimetype: 'what is this nonsense',
  });
  t.same(errors.length, 4);

  // This doesn't actually confirm that an image must have either a URL or
  // mimetype/data.

  errors = Images.validateRow({
    id: 1,
    slug: 'image',
    url: 'http://example.org/image.png',
    mimetype: 'image/png'
  });
  t.same(errors.length, 0);

  errors = Images.validateRow({
    slug: 'image',
    url: 'https://example.org/image.png',
    mimetype: 'image/png'
  });
  t.same(errors.length, 0);

  closeDb(); t.end();
})
