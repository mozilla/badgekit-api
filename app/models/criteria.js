const db = require('../lib/db');
const makeValidator = require('../lib/make-validator');

const Criteria = db.table('criteria', {
  fields: [
    'id',
    'description',
    'badgeId',
    'required', 
    'note'
  ]
});

Criteria.validateRow = makeValidator({
  id: optional('isInt'),
  description: required('len', 1),
  required: required('isIn', ['0','1'])
});

exports = module.exports = Criteria;