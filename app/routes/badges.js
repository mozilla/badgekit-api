const safeExtend = require('../lib/safe-extend')
const Badges = require('../models/badge');

const imageHelper = require('../lib/image-helper')
const errorHelper = require('../lib/error-helper')
const middleware = require('../lib/middleware')

const putBadge = imageHelper.putModel(Badges)
const dbErrorHandler = errorHelper.makeDbHandler('badge')

exports = module.exports = function applyBadgeRoutes (server) {

  server.get('/systems/:systemSlug/badges', [
    middleware.findSystem(),
    showAllBadges,
  ]);
  server.get('/systems/:systemSlug/issuers/:issuerSlug/badges', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    showAllBadges,
  ]);
  server.get('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    showAllBadges,
  ]);
  function showAllBadges (req, res, next) {
    var query;
    var options = {relationships: true};

    switch ('' + req.query.archived) {
      case 'true':
      case '1':
        query = {archived: true};
        break;

      case 'false':
      case '0':
      case 'undefined':
        query = {archived: false};
        break;

      case 'any':
      case '':
        query = {};
        break;

      default:
        return res.send(400, {
          code: 'InvalidParameter',
          parameter: 'archived',
          message: 'Invalid `archived` parameter. Expecting one of \'true\', \'false\' or \'any\'.',
        });
    }

    if (req.system) query.systemId = req.system.id
    if (req.issuer) query.issuerId = req.issuer.id
    if (req.program) query.programId = req.program.id

    Badges.get(query, options, function foundRows (error, rows) {
      if (error)
        return dbErrorHandler(error, null, res, next);

      res.send({badges: rows.map(badgeFromDb)});
      return next();
    });
  }

  server.post('/systems/:systemSlug/badges', [
    middleware.findSystem(),
    saveBadge,
  ]);
  server.post('/systems/:systemSlug/issuers/:issuerSlug/badges', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    saveBadge,
  ]);
  server.post('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    saveBadge,
  ]);
  function saveBadge (req, res, next) {
    const row = fromPostToRow(req.body);
    const image = imageHelper.getFromPost(req, {required: true})

    if (req.system) row.systemId = req.system.id
    if (req.issuer) row.issuerId = req.issuer.id
    if (req.program) row.programId = req.program.id

    putBadge(row, image, function (err, badge) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, row, res, next);
        return res.send(400, errorHelper.validation(err));
      }

      return res.send(201, {
        status: 'created',
        badge: badgeFromDb(badge)
      });
    });
  }

  server.get('/systems/:systemSlug/badges/:badgeSlug', [
    middleware.findSystem(),
    middleware.findBadge({
      relationships: true,
      where: {systemId: ['system', 'id']},
    }),
    showOneBadge,
  ]);
  server.get('/systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findBadge({
      relationships: true,
      where: {
        systemId: ['system', 'id'],
        issuerId: ['issuer', 'id'],
      }
    }),
    showOneBadge,
  ]);
  server.get('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    middleware.findBadge({
      relationships: true,
      where: {
        systemId: ['system', 'id'],
        issuerId: ['issuer', 'id'],
        programId: ['program', 'id'],
      }
    }),
    showOneBadge,
  ]);
  function showOneBadge (req, res, next) {
    res.send({badge: badgeFromDb(req.badge)});
    return next();
  }

  server.del('/systems/:systemSlug/badges/:badgeSlug', [
    middleware.findSystem(),
    middleware.findBadge({
      where: {systemId: ['system', 'id']},
    }),
    deleteBadge,
  ]);
  server.del('/systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findBadge({
      where: {
        systemId: ['system', 'id'],
        issuerId: ['issuer', 'id'],
      }
    }),
    deleteBadge,
  ]);
  server.del('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    middleware.findBadge({
      where: {
        systemId: ['system', 'id'],
        issuerId: ['issuer', 'id'],
        programId: ['program', 'id'],
      }
    }),
    deleteBadge,
  ]);
  function deleteBadge (req, res, next) {
    const row = req.badge
    Badges.del({id: row.id}, function deletedRow (error, result) {
      if (error)
        return dbErrorHandler(error, row, req, next);

      res.send({
        status: 'deleted',
        badge: badgeFromDb(row)
      });
    });
  }

  server.put('/systems/:systemSlug/badges/:badgeSlug', [
    middleware.findSystem(),
    middleware.findBadge({
      where: {systemId: ['system', 'id']},
    }),
    updateBadge,
  ]);
  server.put('/systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findBadge({
      where: {
        systemId: ['system', 'id'],
        issuerId: ['issuer', 'id'],
      }
    }),
    updateBadge,
  ]);
  server.put('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    middleware.findBadge({
      where: {
        systemId: ['system', 'id'],
        issuerId: ['issuer', 'id'],
        programId: ['program', 'id'],
      }
    }),
    updateBadge,
  ]);
  function updateBadge (req, res, next) {
    const row = safeExtend(req.badge, req.body);
    const image = imageHelper.getFromPost(req);

    putBadge(row, image, function (err, badge) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, row, res, next);
        return res.send(400, errorHelper.validation(err));
      }

      res.send({
        status: 'updated',
        badge: badgeFromDb(badge)
      });
    });
  }

};

function fromPostToRow (post) {
  return {
    slug: post.slug,
    name: post.name,
    strapline: post.strapline,
    description: post.description,
    systemId: post.systemId,
    issuerId: post.issuerId,
    programId: post.programId,
  };
}

function badgeFromDb (row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    strapline: row.strapline,
    description: row.description,
    imageUrl: row.image ? row.image.toUrl() : null,
    archived: !!row.archived,
    system: maybeObject(row.system),
    issuer: maybeObject(row.issuer),
    program: maybeObject(row.program),
  };
}

function maybeObject(obj) {
  return (obj && obj.id) ? obj : null
}
