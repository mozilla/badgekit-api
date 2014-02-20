const safeExtend = require('../lib/safe-extend')
const Systems = require('../models/system');

const imageHelper = require('../lib/image-helper')
const errorHelper = require('../lib/error-helper')
const middleware = require('../lib/middleware')

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

      return res.send({systems: rows.map(systemFromDb)});
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
        system: systemFromDb(system)
      });
    });
  }

  server.get('/systems/:systemSlug', [
    middleware.findSystem(),
    function showOneSystem(req, res, next) {
      res.send({system: systemFromDb(req.system)})
      return res.next()
    }
  ]);

  server.del('/systems/:systemSlug', [
    middleware.findSystem({relationships: false}),
    function deleteSystem(req, res, next) {
      const row = req.system
      const query = {id: row.id, slug: row.slug}
      Systems.del(query, function deletedRow(error, result) {
        if (error)
          return dbErrorHandler(error, row, req, next)
        return res.send({
          status: 'deleted',
          system: systemFromDb(row)
        });
      });
    }
  ]);

  server.put('/systems/:systemSlug', [
    middleware.findSystem({relationships: false}),
    function updateSystem(req, res, next) {
      const row = req.system
      const updated = safeExtend(row, req.body)
      const image = imageHelper.getFromPost(req)

      putSystem(updated, image, function updatedRow(err, system) {
        if (err) {
          if (!Array.isArray(err))
            return dbErrorHandler(err, row, res, next);
          return res.send(400, errorHelper.validation(err));
        }

        return res.send({
          status: 'updated',
          system: systemFromDb(system)
        });
      });
    }
  ]);
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

function systemFromDb(row) {
  return {
    id: row.id,
    slug: row.slug,
    url: row.url,
    name: row.name,
    email: row.email,
    imageUrl: row.image ? row.image.toUrl() : null,
    issuers: row.issuers,
  }
}
