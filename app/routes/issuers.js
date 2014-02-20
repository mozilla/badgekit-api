const safeExtend = require('../lib/safe-extend')
const Issuers = require('../models/issuer');

const imageHelper = require('../lib/image-helper')
const errorHelper = require('../lib/error-helper')
const middleware = require('../lib/middleware')

const putIssuer = imageHelper.putModel(Issuers)
const dbErrorHandler = errorHelper.makeDbHandler('issuer')

exports = module.exports = function applyIssuerRoutes (server) {
  server.get('/systems/:systemSlug/issuers', [
    middleware.findSystem(),
    showAllIssuers,
  ]);
  function showAllIssuers(req, res, next) {
    const options = {relationships: true};
    Issuers.get({}, options, function foundRows(error, rows) {
      if (error)
        return dbErrorHandler(error, null, res, next)
      return res.send({issuers: rows.map(issuerFromDb)});
    });
  }

  server.get('/systems/:systemSlug/issuers/:issuerSlug', [
    middleware.findSystem(),
    middleware.findIssuer({relationships: true}),
    showOneIssuer,
  ]);
  function showOneIssuer(req, res, next) {
    return res.send({issuer: issuerFromDb(req.issuer)});
  }

  server.post('/systems/:systemSlug/issuers', [
    middleware.findSystem(),
    saveIssuer,
  ]);
  function saveIssuer(req, res, next) {
    const row = fromPostToRow(req.body);
    const image = imageHelper.getFromPost(req)
    row.systemId = req.system.id

    putIssuer(row, image, function savedRow(err, issuer) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, row, res, next);
        return res.send(400, errorHelper.validation(err));
      }

      res.send(201, {
        status: 'created',
        issuer: issuerFromDb(issuer)
      });
    });
  }

  server.del('/systems/:systemSlug/issuers/:issuerSlug', [
    middleware.findSystem(),
    middleware.findIssuer(),
    deleteIssuer
  ]);
  function deleteIssuer(req, res, next) {
    const row = req.issuer
    const query = {id: row.id, slug: row.slug}
    Issuers.del(query, function deletedRow(error, result) {
      if (error)
        return dbErrorHandler(error, row, req, next)
      return res.send({
        status: 'deleted',
        issuer: issuerFromDb(row)
      });
    });
  }

  server.put('/issuers/:issuerId', updateIssuer);
  function updateIssuer(req, res, next) {
    getIssuer(req, res, next, function (row) {
      const updated = safeExtend(row, req.body)
      const image = imageHelper.getFromPost(req)

      delete updated.image
      delete updated.system
      delete updated.programs

      putIssuer(updated, image, function updatedRow(err, issuer) {
        if (err) {
          if (!Array.isArray(err))
            return dbErrorHandler(err, row, res, next);
          return res.send(400, errorHelper.validation(err));
        }

        return res.send({
          status: 'updated',
          issuer: issuerFromDb(issuer)
        });
      });
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
    description: post.description,
    email: post.email,
    systemId: post.systemId,
  }
}

function issuerFromDb(row) {
  return {
    id: row.id,
    slug: row.slug,
    url: row.url,
    name: row.name,
    description: row.description,
    email: row.email,
    imageUrl: row.image ? row.image.toUrl() : null
  }
}
