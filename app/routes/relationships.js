const Systems = require('../models/system')
const Issuers = require('../models/issuer')
const Programs = require('../models/program')
const errorHelper = require('../lib/error-helper')
const dbErrorHandler = errorHelper.makeDbHandler('system')

exports = module.exports = function applyRelationshipRoutes (server) {

  server.get('/systems/:systemSlug/issuers', showSystemIssuers);
  function showSystemIssuers(req, res, next) {
    const systemSlug = req.params.systemSlug
    Issuers.getBySystem(systemSlug, function (error, rows) {
      if (error)
        return dbErrorHandler(error, null, res, next)

      if (!rows)
        return next(errorHelper.notFound('Could not find system with slug `'+systemSlug+'`'))

      return res.send({issuers: rows.map(itemFromDb)});
    });
  }

}

function itemFromDb(row) {
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
