const db = require('../lib/db');
const validation = require('../lib/validation');

const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

const Alignments = db.table('alignments', {
  fields: [
    'id',
    'badgeId',
    'name',
    'url', 
    'description'
  ]
});

Alignments.toResponse = function toResponse(row) {
  return {
    id: row.id,
    name: row.name.toString(),
    url: row.url.toString(),
    description: row.description.toString()
  };
};

Alignments.validateRow = makeValidator({
  id: optional('isInt'),
  name: required('len', 1),
  url: required('isUrl'),
  description: required('len', 1)
});

exports = module.exports = Alignments;