const async = require('async')
const safeExtend = require('../lib/safe-extend')
const Badges = require('../models/badge');
const Milestones = require('../models/milestone');
const imageHelper = require('../lib/image-helper')
const errorHelper = require('../lib/error-helper')
const middleware = require('../lib/middleware')

const putBadgeHelper = imageHelper.putModel(Badges)
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

      res.send({badges: rows.map(Badges.toResponse)});
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
    var options = {
      row: fromPostToRow(req.body),
      criteria: req.body.criteria || [],
      alignments: req.body.alignments || [],
      categories: req.body.categories || [],
      tags: req.body.tags || [],
      image: imageHelper.getFromPost(req, {required: true})
    }

    if (req.system) options.row.systemId = req.system.id
    if (req.issuer) options.row.issuerId = req.issuer.id
    if (req.program) options.row.programId = req.program.id

    putBadge(options, function (err, badge) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, options.row, res, next);
        return res.send(400, errorHelper.validation(err));
      }

      return res.send(201, {
        status: 'created',
        badge: badge.toResponse(),
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
    const badge = req.badge;
    const system = req.system;
    const query = {
      primaryBadgeId: badge.id,
      systemId: system.id
    };
    const options = { relationships: true };

    Milestones.get(query, options)
      .then(function (milestones) {
        badge.milestones = milestones;
        return res.send({badge: Badges.toResponse(badge)});
      })
      .catch(function (err) {
        req.log.error(err);
        return next(err);
      });
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
    Badges.getOne({id: req.badge.id}, function (err, row) {
      if (err)
        return dbErrorHandler(err, row, req, next);

      row.del(function(err) {
        res.send({
          status: 'deleted',
          badge: row.toResponse()
        });
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
    var options = {
      row: safeExtend(req.badge, req.body),
      criteria: req.body.criteria || [],
      alignments: req.body.alignments || [],
      categories: req.body.categories || [],
      tags: req.body.tags || [],
      image: imageHelper.getFromPost(req)
    }

    delete options.row.created;
    putBadge(options, function (err, badge) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, options.row, res, next);
        return res.send(400, errorHelper.validation(err));
      }

      res.send({
        status: 'updated',
        badge: badge.toResponse(),
      });
    });
  }

};

function putBadge (options, callback) {
  putBadgeHelper(options.row, options.image, function(err, row) {
    if (err)
      return callback(err);

    async.parallel([
      row.setCriteria.bind(row, options.criteria),
      row.setAlignments.bind(row, options.alignments),
      row.setCategories.bind(row, options.categories),
      row.setTags.bind(row, options.tags)
    ], function (err, data) {
      callback(err, data[0])
    });
  });
};


function fromPostToRow (post) {
  return {
    slug: post.slug,
    name: post.name,
    strapline: post.strapline,
    systemId: post.systemId,
    issuerId: post.issuerId,
    programId: post.programId,
    earnerDescription: post.earnerDescription,
    consumerDescription: post.consumerDescription,
    issuerUrl: post.issuerUrl,
    rubricUrl: post.rubricUrl,
    criteriaUrl: post.criteriaUrl,
    timeValue: post.timeValue,
    timeUnits: post.timeUnits,
    evidenceType: post.evidenceType,
    limit: post.limit,
    type: post.type,
    unique: post.unique
  };
}
