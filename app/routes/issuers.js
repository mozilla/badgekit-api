const safeExtend = require('../lib/safe-extend')
const Issuers = require('../models/issuer');

const imageHelper = require('../lib/image-helper')
const errorHelper = require('../lib/error-helper')
const middleware = require('../lib/middleware')
const sendPaginated = require('../lib/send-paginated');

const putIssuer = imageHelper.putModel(Issuers)
const dbErrorHandler = errorHelper.makeDbHandler('issuer')

exports = module.exports = function applyIssuerRoutes (server) {
  server.get('/systems/:systemSlug/issuers', [
    middleware.findSystem(),
    showAllIssuers,
  ]);
  function showAllIssuers(req, res, next) {
    const options = {relationships: true}
    const query = {systemId: req.system.id}
    
    if (req.pageData) {
      options.limit = req.pageData.count;
      options.page = req.pageData.page;
      options.includeTotal = true;
    }

    Issuers.get(query, options, function foundRows(error, result) {
      if (error)
        return dbErrorHandler(error, null, res, next)

      var total = 0;
      var rows = result;
      if (req.pageData) {
        total = result.total;
        rows = result.rows;
      }

      var responseData = {issuers: rows.map(Issuers.toResponse)}
      return sendPaginated(req, res, responseData, total)
    });
  }

  server.get('/systems/:systemSlug/issuers/:issuerSlug', [
    middleware.findSystem(),
    middleware.findIssuer({
      relationships: true,
      where: {systemId: ['system', 'id']}
    }),
    showOneIssuer,
  ]);
  function showOneIssuer(req, res, next) {
    return res.send({issuer: req.issuer.toResponse()});
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
        issuer: issuer.toResponse(),
      });
    });
  }

  server.del('/systems/:systemSlug/issuers/:issuerSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    deleteIssuer
  ]);
  function deleteIssuer(req, res, next) {
    const issuer = req.issuer
    const query = {id: issuer.id, slug: issuer.slug}
    Issuers.del(query, function deletedRow(error, result) {
      if (error)
        return dbErrorHandler(error, issuer, req, next)
      return res.send({
        status: 'deleted',
        issuer: issuer.toResponse(),
      });
    });
  }

  server.put('/systems/:systemSlug/issuers/:issuerSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    updateIssuer,
  ]);
  function updateIssuer(req, res, next) {
    const row = req.issuer
    const updated = safeExtend(row, req.body)
    const image = imageHelper.getFromPost(req)
    putIssuer(updated, image, function updatedRow(err, issuer) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, row, res, next);
        return res.send(400, errorHelper.validation(err));
      }

      return res.send({
        status: 'updated',
        issuer: issuer.toResponse(),
      });
    });
  }
};

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
