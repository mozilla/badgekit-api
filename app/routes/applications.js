const safeExtend = require('../lib/safe-extend')
const Applications = require('../models/application');

const errorHelper = require('../lib/error-helper')
const middleware = require('../lib/middleware')
const hash = require('../lib/hash').hash

const dbErrorHandler = errorHelper.makeDbHandler('application')

exports = module.exports = function applyApplicationRoutes (server) {
  server.get('/systems/:systemSlug/applications', [
    middleware.findSystem(),
    showAllApplications,
  ]);
  server.get('/systems/:systemSlug/badges/:badgeSlug/applications', [
    middleware.findSystem(),
    middleware.findBadge({where: {systemId: ['system', 'id']}}),
    showAllApplications,
  ]);
  server.get('/systems/:systemSlug/issuers/:issuerSlug/applications', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    showAllApplications,
  ]);
  server.get('/systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug/applications', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findBadge({where: {issuerId: ['issuer', 'id']}}),
    showAllApplications,
  ]);
  server.get('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/applications', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    showAllApplications,
  ]);
  server.get('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug/applications', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    middleware.findBadge({where: {programId: ['program', 'id']}}),  
    showAllApplications,
  ]);
  function showAllApplications (req, res, next) {
    var query = {};
    var options = {
      relationships: true,
      relationshipsDepth: 2,
      sort: ['badgeId', 'created'],
    };

    if (req.badge) query.badgeId = req.badge.id;
    if (req.system) query.systemId = req.system.id;
    if (req.issuer) query.issuerId = req.issuer.id;
    if (req.program) query.programId = req.program.id;

    Applications.get(query, options, function foundRows (error, rows) {
      if (error)
        return dbErrorHandler(error, null, res, next);

      res.send({applications: rows.map(function (application) {
        return Applications.toResponse(application, req);
      })});

      return next();
    });
  }

  server.get('/systems/:systemSlug/badges/:badgeSlug/applications/:applicationSlug', [
    middleware.findSystem(),
    middleware.findBadge({relationships: true, where: {systemId: ['system', 'id']}}),
    middleware.findApplication({relationships: true, where: {badgeId: ['badge', 'id']}}),
    showOneApplication,
  ]);
  server.get('/systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug/applications/:applicationSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findBadge({relationships: true, where: {issuerId: ['issuer', 'id']}}),
    middleware.findApplication({relationships: true, where: {badgeId: ['badge', 'id']}}),
    showOneApplication,
  ]);
  server.get('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug/applications/:applicationSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    middleware.findBadge({relationships: true, where: {programId: ['program', 'id']}}),
    middleware.findApplication({relationships: true, where: {badgeId: ['badge', 'id']}}),
    showOneApplication,
  ]);
  function showOneApplication (req, res, next) {

    var application = req.application;
    application.badge = req.badge;

    res.send({application: application.toResponse()});
    return next();
  }

  server.post('/systems/:systemSlug/badges/:badgeSlug/applications', [
    middleware.findSystem(),
    middleware.findBadge({where: {systemId: ['system', 'id']}}),
    createApplication,
  ]);
  server.post('/systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug/applications', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findBadge({where: {issuerId: ['issuer', 'id']}}),
    createApplication,
  ]);
  server.post('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug/applications', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    middleware.findBadge({where: {programId: ['program', 'id']}}),
    createApplication,
  ]);
  function createApplication (req, res, next) {
    const evidence = req.body.evidence || [];
    const row = fromPostToRow(req.body);

    if (req.badge) row.badgeId = req.badge.id
    if (req.system) row.systemId = req.system.id;
    if (req.issuer) row.issuerId = req.issuer.id;
    if (req.program) row.programId = req.program.id;

    row.slug = hash('md5', Date.now().toString() + row.learner),

    putApplication(row, evidence, function (err, application) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, row, res, next);
        return res.send(400, errorHelper.validation(err));
      }

      return res.send(201, {
        status: 'created',
        application: application.toResponse()
      });
    });
  }

  server.put('/systems/:systemSlug/badges/:badgeSlug/applications/:applicationSlug', [
    middleware.findSystem(),
    middleware.findBadge({where: {systemId: ['system', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    updateApplication,
  ]);
  server.put('/systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug/applications/:applicationSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findBadge({where: {issuerId: ['issuer', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    updateApplication,
  ]);
  server.put('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug/applications/:applicationSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    middleware.findBadge({where: {programId: ['program', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    updateApplication,
  ]);
  function updateApplication (req, res, next) {
    const row = safeExtend(req.application, req.body);
    const evidence = req.body.evidence;

    if (row.processed) {
      row.processed = new Date(row.processed);
    }

    delete row.created;

    putApplication(row, evidence, function (err, application) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, row, res, next);
        return res.send(400, errorHelper.validation(err));
      }

      res.send({
        status: 'updated',
        application: application.toResponse()
      });
    });
  }

  server.del('/systems/:systemSlug/badges/:badgeSlug/applications/:applicationSlug', [
    middleware.findSystem(),
    middleware.findBadge({where: {systemId: ['system', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    deleteApplication,
  ]);
  server.del('/systems/:systemSlug/issuers/:issuerSlug/badges/:badgeSlug/applications/:applicationSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findBadge({where: {issuerId: ['issuer', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    deleteApplication,
  ]);
  server.del('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug/badges/:badgeSlug/applications/:applicationSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    middleware.findBadge({where: {programId: ['program', 'id']}}),
    middleware.findApplication({where: {badgeId: ['badge', 'id']}}),
    deleteApplication,
  ]);
  function deleteApplication (req, res, next) {
    Applications.getOne({id: req.application.id}, function (err, row) {
      if (err)
        return dbErrorHandler(err, row, req, next);

      row.del(function(err) {
        res.send({
          status: 'deleted',
          application: row.toResponse()
        });
      });
    });
  }
};

function putApplication (row, evidence, callback) {
  var validationErrors = Applications.validateRow(row);
  if (validationErrors.length) {
    return callback(validationErrors);
  }

  Applications.put(row, function(err, result) {
    if (err)
      return callback(err);

    const rowId = result.insertId || result.row.id;

    if (typeof evidence == 'undefined') {
      Applications.getOne({id: rowId}, {relationships: true}, callback);
    }
    else {
      Applications.getOne({id: rowId}, function(err, row) {
        if (err)
          return callback(err);

        return row.setEvidence(evidence, callback);
      });
    }
  });
};

function fromPostToRow (post) {
  return {
    learner: post.learner,
    assignedTo: post.assignedTo,
    assignedExpiration: post.assignedExpiration
  };
}


