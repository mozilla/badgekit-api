const validatorContext = require('validator')

module.exports = function makeValidator(validation) {
  return function (row) {
    return this.fields.reduce(function (errors, field) {
      const value = row[field]
      try {
        const validator = validation[field] || noop;
        validator.call(validatorContext, value);
      }
      catch(e) {
        e.field = field;
        e.value = value || ''
        delete e.name
        errors.push(e);
      }
      return errors;
    }, []);
  };
};

function noop() {}
