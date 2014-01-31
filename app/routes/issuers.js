const restify = require('restify')
const safeExtend = require('../lib/safe-extend')
const Issuers = require('../models/issuer');

const imageHelper = require('../lib/image-helper')
const putIssuer = imageHelper.putModel(Issuers)

exports = module.exports = function applyIssuerRoutes (server) {

  server.get('/issuers', showAllIssuers);
  function showAllIssuers(req, res, next) {
    const query = {}
    const options = {relationships: true};
    Issuers.get(query, options, function foundRows(error, rows) {
      if (error)
        return handleError(error, null, res, next)

      return res.send({issuers: rows.map(issuerFromDb)});
    });
  }

  server.post('/issuers', saveIssuer);
  function saveIssuer(req, res, next) {
    const row = fromPostToRow(req.body);
    var image = (req.files || {}).image || {};
    if (!image.size)
      image = req.body.image || null;

    putIssuer(row, image, function savedRow(err, result) {
      if (err) {
        if (!Array.isArray(err))
          return handleError(err, row, res, next);

        return res.send(400, {
          code: 'ValidationError',
          message: 'Could not validate required fields',
          details: err,
        });
      }

      res.send(201, {status: 'created', issuer: row});
    });
  }

  server.get('/issuers/:issuerId', showOneIssuer);
  function showOneIssuer(req, res, next) {
    getIssuer(req, res, next, function (row) {
      return res.send({issuer: issuerFromDb(row)});
    });
  }

  server.del('/issuers/:issuerId', deleteIssuer);
  function deleteIssuer(req, res, next) {
    getIssuer(req, res, next, function (row) {
      const query = {id: row.id, slug: row.slug}
      Issuers.del(query, function deletedRow(error, result) {
        if (error)
          return handleError(error, row, req, next)
        return res.send({status: 'deleted', issuer: row});
      });
    });
  }

  server.put('/issuers/:issuerId', updateIssuer);
  function updateIssuer(req, res, next) {
    getIssuer(req, res, next, function (row) {
      const updated = safeExtend(row, req.body)
      delete updated.image

      row.issuerId = row.issuerId || undefined;

      var image = (req.files || {}).image || {};
      if (!image.size)
        image = req.body.image || null;

      putIssuer(updated, image, function updatedRow(err, result) {
        if (err) {
          if (!Array.isArray(err))
            return handleError(err, row, res, next);

          return res.send(400, {
            code: 'ValidationError',
            message: 'Could not validate required fields',
            details: err,
          });
        }

        return res.send({status: 'updated', issuer: row})
      })
    });
  }

};

function getIssuer(req, res, next, callback) {
  const query = {slug: req.params.issuerId};
  const options = {relationships: true};

  Issuers.getOne(query, options, function foundIssuer(error, row) {
    if (error)
      return handleError(error, row, res, next)

    if (!row) {
      const notFoundErr = new restify.ResourceNotFoundError('Could not find issuer with slug `'+query.slug+'`')
      return next(notFoundErr);
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
    imageUrl: row.image ? row.image.toUrl() : null
  }
}
