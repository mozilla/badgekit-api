const db = require('../lib/db');
const validation = require('../lib/validation');

const makeValidator = validation.makeValidator;
const optional = validation.optional;
const required = validation.required;

const Category = db.table('categories', {
  fields: [
    'id',
    'badgeId',
    'value'
  ],
  methods: {
    toResponse: function () {
      return Category.toResponse(this);
    }
  }
});

Category.toResponse = function toResponse(row) {
  return row.value;
};

Category.validateRow = makeValidator({
  id: optional('isInt'),
  badgeId: required('isInt'),
  value: required('len', 1),
});

exports = module.exports = Category;
