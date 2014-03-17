const db = require('../lib/db');
const validation = require('../lib/validation');

const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

const Evidence = db.table('evidence', {
  fields: [
    'id',
    'applicationId',
    'url',
    'mediaType',
    'reflection'
  ],
});

Evidence.validateRow = makeValidator({
  id: optional('isInt'),
  applicationId: required('isInt'),
  url: optional('isUrl'),
  mediaType: optional('isIn', ['image','link'])
});

exports = module.exports = Evidence;