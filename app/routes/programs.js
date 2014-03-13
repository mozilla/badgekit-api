const safeExtend = require('../lib/safe-extend')
const Programs = require('../models/program');

const imageHelper = require('../lib/image-helper')
const errorHelper = require('../lib/error-helper')
const middleware = require('../lib/middleware')

const putProgram = imageHelper.putModel(Programs)
const dbErrorHandler = errorHelper.makeDbHandler('program')

exports = module.exports = function applyProgramRoutes (server) {
  server.get('/systems/:systemSlug/issuers/:issuerSlug/programs', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    showAllPrograms,
  ])
  function showAllPrograms(req, res, next) {
    const options = {relationships: true}
    const query = {issuerId: req.issuer.id}
    Programs.get(query, options, function foundRows(error, rows) {
      if (error)
        return dbErrorHandler(error, null, res, next)

      res.send({programs: rows.map(programFromDb)});
      return next();
    });
  }

  server.get('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({
      relationships: true,
      where: {issuerId: ['issuer', 'id']}
    }),
    showOneProgram
  ])
  function showOneProgram(req, res, next) {
    res.send({program: programFromDb(req.program)});
    return next();
  }

  server.post('/systems/:systemSlug/issuers/:issuerSlug/programs', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    saveProgram
  ])
  function saveProgram(req, res, next) {
    const row = fromPostToRow(req.body);
    const image = imageHelper.getFromPost(req)

    row.issuerId = req.issuer.id

    putProgram(row, image, function savedRow(err, program) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, row, res, next);
        return res.send(400, errorHelper.validation(err));
      }

      res.send(201, {
        status: 'created',
        program: programFromDb(program)
      });
    });
  }

  server.del('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    deleteProgram
  ])
  function deleteProgram(req, res, next) {
    const row = req.program
    const query = {id: row.id, slug: row.slug}
    Programs.del(query, function deletedRow(error, result) {
      if (error)
        return dbErrorHandler(error, row, req, next);

      res.send({
        status: 'deleted',
        program: programFromDb(row)
      });
    });
  }

  server.put('/systems/:systemSlug/issuers/:issuerSlug/programs/:programSlug', [
    middleware.findSystem(),
    middleware.findIssuer({where: {systemId: ['system', 'id']}}),
    middleware.findProgram({where: {issuerId: ['issuer', 'id']}}),
    updateProgram
  ])
  function updateProgram(req, res, next) {
    const row = req.program
    const updated = safeExtend(row, req.body)
    const image = imageHelper.getFromPost(req)
    putProgram(updated, image, function updatedRow(err, program) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, row, res, next);
        return res.send(400, errorHelper.validation(err));
      }

      res.send({
        status: 'updated',
        program: programFromDb(program)
      });
    })
  }
}

function fromPostToRow(post) {
  return {
    slug: post.slug,
    url: post.url,
    name: post.name,
    description: post.description,
    email: post.email,
    issuerId: post.issuerId,
  }
}

function programFromDb(row) {
  return {
    id: row.id,
    slug: row.slug,
    url: row.url,
    name: row.name,
    description: row.description,
    email: row.email,
    imageUrl: row.image ? row.image.toUrl() : null,
  }
}
