const safeExtend = require('../lib/safe-extend')
const Badges = require('../models/badge');

const imageHelper = require('../lib/image-helper')
const errorHelper = require('../lib/error-helper')
const middleware = require('../lib/middleware')

const putBadgeHelper = imageHelper.putModel(Badges)
const dbErrorHandler = errorHelper.makeDbHandler('badge')

exports = module.exports = function applyBadgeRoutes (server) {

  server.get(
    {
      url:'/systems/:systemSlug/badges',
      swagger: {
        summary: 'My hello call description',
        notes: 'My hello call notes',
        nickname: 'sayHelloCall'
      },
      validation: {
        name: { isRequired: true, isIn: ['foo', 'bar'], scope: 'path', description: 'Your unreal name' },
        status: { isRequired: true, isIn: ['foo', 'bar'], scope: 'query', description: 'Are you foo or bar?' },
        email: { isRequired: false, isEmail: true, scope: 'query', description: 'Your real email address' },
        age: { isRequired: true, isInt: true, scope: 'query', description: 'Your age' },
        accept: { isRequired: true, isIn: ['true', 'false'], scope: 'query', swaggerType: 'boolean', description: 'Are you foo or bar?' },
        password: { isRequired: true, description: 'New password' },
        passwordRepeat: { equalTo: 'password', description: 'Repeated password'}
      }
    },
    [
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
    const criteria = req.body.criteria || [];
    const row = fromPostToRow(req.body);
    const image = imageHelper.getFromPost(req, {required: true})

    if (req.system) row.systemId = req.system.id
    if (req.issuer) row.issuerId = req.issuer.id
    if (req.program) row.programId = req.program.id

    putBadge(row, image, criteria, function (err, badge) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, row, res, next);
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
    res.send({badge: req.badge.toResponse()});
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
    const row = safeExtend(req.badge, req.body);
    const image = imageHelper.getFromPost(req);
    const criteria = req.body.criteria || [];
    delete row.created;
    putBadge(row, image, criteria, function (err, badge) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, row, res, next);
        return res.send(400, errorHelper.validation(err));
      }

      res.send({
        status: 'updated',
        badge: badge.toResponse(),
      });
    });
  }

};

function putBadge (row, image, criteria, callback) {
  putBadgeHelper(row, image, function(err, row) {
    if (err)
      return callback(err);

    return row.setCriteria(criteria, callback);
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
    limit: post.limit,
    unique: post.unique
  };
}
