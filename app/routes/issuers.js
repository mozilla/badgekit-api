const safeExtend = require('../lib/safe-extend')
const Issuers = require('../models/issuer');

const imageHelper = require('../lib/image-helper')
const errorHelper = require('../lib/error-helper')

const putIssuer = imageHelper.putModel(Issuers)
const dbErrorHandler = errorHelper.makeDbHandler('issuer')

exports = module.exports = function applyIssuerRoutes (server) {
  server.get('/issuers', showAllIssuers);
  function showAllIssuers(req, res, next) {
    const query = {}
    const options = {relationships: true};
    Issuers.get(query, options, function foundRows(error, rows) {
      if (error)
        return dbErrorHandler(error, null, res, next)

      return res.send({issuers: rows.map(issuerFromDb)});
    });
  }

  server.post('/issuers', saveIssuer);
  function saveIssuer(req, res, next) {
    const row = fromPostToRow(req.body);
    const image = imageHelper.getFromPost(req)

    putIssuer(row, image, function savedRow(err, result) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, row, res, next);
        return res.send(400, errorHelper.validation(err));
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
          return dbErrorHandler(error, row, req, next)
        return res.send({status: 'deleted', issuer: row});
      });
    });
  }

  server.put('/issuers/:issuerId', updateIssuer);
  function updateIssuer(req, res, next) {
    getIssuer(req, res, next, function (row) {
      const updated = safeExtend(row, req.body)
      const image = imageHelper.getFromPost(req)
      delete updated.image

      row.issuerId = row.issuerId || undefined;

      putIssuer(updated, image, function updatedRow(err, result) {
        if (err) {
          if (!Array.isArray(err))
            return dbErrorHandler(err, row, res, next);

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
      return dbErrorHandler(error, row, res, next)

    if (!row)
      return next(errorHelper.notFound('Could not find issuer with slug `'+query.slug+'`'));

    return callback(row)
  });
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
