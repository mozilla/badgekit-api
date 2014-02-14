const safeExtend = require('../lib/safe-extend')
const Systems = require('../models/system');

const imageHelper = require('../lib/image-helper')
const errorHelper = require('../lib/error-helper')

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

  server.get('/systems/:systemId', showOneSystem);
  function showOneSystem(req, res, next) {
    getSystem(req, res, next, function (row) {
      return res.send({system: systemFromDb(row)});
    });
  }

  server.del('/systems/:systemId', deleteSystem);
  function deleteSystem(req, res, next) {
    getSystem(req, res, next, function (row) {
      const query = {id: row.id, slug: row.slug}
      Systems.del(query, function deletedRow(error, result) {
        if (error)
          return dbErrorHandler(error, row, req, next)
        return res.send({
          status: 'deleted',
          system: systemFromDb(row)
        });
      });
    });
  }

  server.put('/systems/:systemId', updateSystem);
  function updateSystem(req, res, next) {
    getSystem(req, res, next, function (row) {
      const updated = safeExtend(row, req.body)
      const image = imageHelper.getFromPost(req)

      delete updated.image
      delete updated.issuers

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
    });
  }

};

function getSystem(req, res, next, callback) {
  const query = {slug: req.params.systemId};
  const options = {relationships: true};

  Systems.getOne(query, options, function foundSystem(error, row) {
    if (error)
      return dbErrorHandler(error, row, res, next)

    if (!row)
      return next(errorHelper.notFound('Could not find system with slug `'+query.slug+'`'));

    return callback(row)
  });
}

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
