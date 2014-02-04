module.exports = {
  validation: validationHelper,
  makeDbHandler: makeDbHandler,
  notFound: notFound,
}

const restify = require('restify')

function validationHelper(errors) {
  return {
    code: 'ValidationError',
    message: 'Could not validate required fields',
    details: errors,
  }
}

function notFound(message) {
  return new restify.ResourceNotFoundError(message)
}

function makeDbHandler(modelName) {
  const errorCodes = {
    ER_DUP_ENTRY: [409, {code: 'ResourceConflict', message: modelName + ' with that `slug` already exists'}]
  }

  function knownError(error, row) {
    const err = errorCodes[error.code];
    if (!err) return;
    if (row) err[1].details = row
    return err;
  }

  return function handleError(error, row, res, next) {
    const expected = knownError(error, row)
    if (!expected) return next(error)
    res.send.apply(res, expected)
    return next()
  }
}
