const validatorContext = require('validator')

function makeValidator (validation) {
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

function required (fn) {
  fn = confirmValidatorFunction.apply(null, arguments);

  return function (value) {
    if (typeof value === 'undefined' || value === null)
      throw new Error('Required field');

    return fn.call(this, value);
  }
}

function optional (fn) {
  fn = confirmValidatorFunction.apply(null, arguments);

  return function (value) {
    if (typeof value === 'undefined' || value === null)
      return;

    return fn.call(this, value);
  }
}

function confirmValidatorFunction (fn) {
  if (typeof fn === 'function')
    return fn;

  var validator = '' + fn;
  var args = Array.prototype.slice.call(arguments, 1);

  return function (value) {
    var checker = validatorContext.check(value);
    checker[validator].apply(checker, args);
  }
}

exports = module.exports = {
  makeValidator: makeValidator,
  required: required,
  optional: optional
}
