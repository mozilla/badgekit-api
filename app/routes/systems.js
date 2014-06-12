const safeExtend = require('../lib/safe-extend')
const Systems = require('../models/system');

const imageHelper = require('../lib/image-helper')
const errorHelper = require('../lib/error-helper')
const middleware = require('../lib/middleware')
const sendPaginated = require('../lib/send-paginated');

const putSystem = imageHelper.putModel(Systems)
const dbErrorHandler = errorHelper.makeDbHandler('system')

exports = module.exports = function applySystemRoutes (server) {
  server.get('/systems', showAllSystems);
  function showAllSystems(req, res, next) {
    const query = {}
    const options = {relationships: true};
    Systems.get(query, options, function foundRows(error, rows) {
      if (error)
        return dbErrorHandler(error, null, res, next)

      var responseData = {systems: rows.map(Systems.toResponse)};
      return sendPaginated(req, res, responseData, 'systems');
    });
  }

  server.post('/systems', saveSystem);
  function saveSystem(req, res, next) {
    const row = fromPostToRow(req.body);
    const image = imageHelper.getFromPost(req)

    putSystem(row, image, function savedRow(err, system) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, row, res, next);
        return res.send(400, errorHelper.validation(err));
      }

      res.send(201, {
        status: 'created',
        system: system.toResponse(),
      });
    });
  }

  server.get('/systems/:systemSlug', [
    middleware.findSystem({relationships: true}),
    showOneSystem,
  ]);
  function showOneSystem(req, res, next) {
    res.send({system: req.system.toResponse()})
    return res.next()
  }

  server.del('/systems/:systemSlug', [
    middleware.findSystem(),
    deleteSystem,
  ]);
  function deleteSystem(req, res, next) {
    const system = req.system
    const query = {id: system.id, slug: system.slug}
    Systems.del(query, function deletedRow(error, result) {
      if (error)
        return dbErrorHandler(error, system, req, next)
      return res.send({
        status: 'deleted',
        system: system.toResponse(),
      });
    });
  }

  server.put('/systems/:systemSlug', [
    middleware.findSystem(),
    updateSystem,
  ]);
  function updateSystem(req, res, next) {
    const system = req.system
    const updated = safeExtend(system, req.body)
    const image = imageHelper.getFromPost(req)

    putSystem(updated, image, function updatedRow(err, system) {
      if (err) {
        if (!Array.isArray(err))
          return dbErrorHandler(err, system, res, next);
        return res.send(400, errorHelper.validation(err));
      }

      return res.send({
        status: 'updated',
        system: system.toResponse()
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
  }
}
