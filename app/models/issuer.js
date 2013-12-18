const db = require('../lib/db');

const table = db.table('issuers', {
  fields: [
    'id',
    'slug',
    'url',
    'name',
    'description',
    'email',
    'imageId'
  ],
});

exports = module.exports = table;
