const xtend = require('xtend')
const Issuers = require('../models/issuer');

exports = module.exports = function applyIssuerRoutes (server) {

  server.get('/issuers', showAllIssuers);
  function showAllIssuers(req, res, next) {
    Issuers.get({}, function foundRows(error, rows) {
      if (error)
        return handleError(error, null, res, next)

      res.send({issuers: rows.map(issuerFromDb)});
      return next();
    });
  }

  server.post('/issuers', saveIssuer);
  function saveIssuer(req, res, next) {
    const row = fromPostToRow(req.body);
    const validationErrors = Issuers.validateRow(row);

    if (validationErrors.length) {
      res.send(400, {errors: validationErrors})
      return next()
    }

    Issuers.put(row, function savedRow(error, result) {
      if (error)
        return handleError(error, row, res, next)

      res.send(201, {status: 'created'})
      return next();
    });
  }

  server.get('/issuers/:issuerId', showOneIssuer);
  function showOneIssuer(req, res, next) {
    getIssuer(req, res, next, function (row) {
      res.send({issuer: issuerFromDb(row)});
      return next();
    });
  }

  server.del('/issuers/:issuerId', deleteIssuer);
  function deleteIssuer(req, res, next) {
    getIssuer(req, res, next, function (row) {
      Issuers.del(row, function deletedRow(error, result) {
        if (error)
          return handleError(error, row, req, next)
        res.send({status: 'deleted', row: row});
      });
    });
  }

  server.put('/issuers/:issuerId', updateIssuer);
  function updateIssuer(req, res, next) {
    getIssuer(req, res, next, function (row) {
      const updated = xtend(row, req.body)
      Issuers.put(updated, function updatedRow(error, result) {
        if (error)
          return handleError(error, row, res, next)
        res.send({status: 'updated'})
      })
    });
  }

};

function getIssuer(req, res, next, callback) {
  const query = {slug: req.params.issuerId};
  Issuers.getOne(query, function foundIssuer(error, row) {
    if (error)
      return handleError(error, row, res, next)

    if (!row) {
      res.send(404, {error: 'not found'});
      return next()
    }

    return callback(row)
  });
}

const errorCodes = {
  ER_DUP_ENTRY: [409, {error: 'An issuer with that `slug` already exists'}]
}

function handleError(error, row, res, next) {
  const expected = knownError(error, row)
  if (!expected) return next(error)
  res.send.apply(res, expected)
  return next()
}

function knownError(error, row) {
  const err = errorCodes[error.code];
  if (!err) return;
  if (row) err[1].received = row
  return err;
}

function fromPostToRow(post) {
  return {
    slug: post.slug,
    url: post.url,
    name: post.name,
    email: post.email,
  }
}

function issuerFromDb(row) {
  return {
    id: row.id,
    slug: row.slug,
    url: row.url,
    name: row.name,
    email: row.email,
  }
}
