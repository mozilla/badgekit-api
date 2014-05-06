const db = require('../lib/db');
const validation = require('../lib/validation');

const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

const Tags = db.table('tags', {
  fields: [
    'id',
    'badgeId',
    'value'
  ]
});

Tags.toResponse = function toResponse(row) {
  return {
    id: row.id,
    value: row.value
  };
};

Tags.validateRow = makeValidator({
  id: optional('isInt'),
  value: required('len', 1)
});

exports = module.exports = Tags;