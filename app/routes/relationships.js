const Systems = require('../models/system')
const Issuers = require('../models/issuer')
const Programs = require('../models/program')
const Badges = require('../models/badge')
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

  server.get('/issuers/:issuerSlug/programs', showIssuerPrograms);
  function showIssuerPrograms(req, res, next) {
    const issuerSlug = req.params.issuerSlug
    Programs.getByIssuer(issuerSlug, function (error, rows) {
      if (error)
        return dbErrorHandler(error, null, res, next)
      if (!rows)
        return next(errorHelper.notFound('Could not find issuer with slug `'+issuerSlug+'`'))
      return res.send({programs: rows.map(itemFromDb)});
    });
  }

  server.get('/issuers/:issuerSlug/badges', showIssuerBadges);
  function showIssuerBadges(req, res, next) {
    const issuerSlug = req.params.issuerSlug
    Badges.getByIssuer(issuerSlug, function (error, rows) {
      if (error)
        return dbErrorHandler(error, null, res, next)
      if (!rows)
        return next(errorHelper.notFound('Could not find issuer with slug `'+issuerSlug+'`'))
      return res.send({badges: rows.map(badgeFromDb)});
    });
  }

  server.get('/programs/:programSlug/badges', showProgramBadges);
  function showProgramBadges(req, res, next) {
    const programSlug = req.params.programSlug
    Badges.getByProgram(programSlug, function (error, rows) {
      if (error)
        return dbErrorHandler(error, null, res, next)
      if (!rows)
        return next(errorHelper.notFound('Could not find program with slug `'+programSlug+'`'))
      return res.send({badges: rows.map(badgeFromDb)});
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

function badgeFromDb (row) {
  function basicInfo(obj) {
    if (!obj) return null
    return {
      id: obj.id,
      slug: obj.slug,
      name: obj.name,
    }
  }
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    strapline: row.strapline,
    description: row.description,
    imageUrl: row.image ? row.image.toUrl() : null,
    archived: !!row.archived,
    system: basicInfo(row.system),
    issuer: basicInfo(row.issuer),
    program: basicInfo(row.program),
  };
}
