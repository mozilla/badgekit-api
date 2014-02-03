const safeExtend = require('../lib/safe-extend')
const Programs = require('../models/program');

const imageHelper = require('../lib/image-helper')
const errorHelper = require('../lib/error-helper')

const putProgram = imageHelper.putModel(Programs)
const dbErrorHandler = errorHelper.makeDbHandler('program')

exports = module.exports = function applyProgramRoutes (server) {
  server.get('/programs', showAllPrograms);
  function showAllPrograms(req, res, next) {
    const query = {}
    const options = {relationships: true};
    Programs.get(query, options, function foundRows(error, rows) {
      if (error)
        return dbErrorHandler(error, null, res, next)

      res.send({programs: rows.map(programFromDb)});
      return next();
    });
  }

  server.post('/programs', saveProgram);
  function saveProgram(req, res, next) {
    const row = fromPostToRow(req.body);
    const image = imageHelper.getFromPost(req)

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

  server.get('/programs/:programId', showOneProgram);
  function showOneProgram(req, res, next) {
    getProgram(req, res, next, function (row) {
      res.send({program: programFromDb(row)});
      return next();
    });
  }

  server.del('/programs/:programId', deleteProgram);
  function deleteProgram(req, res, next) {
    getProgram(req, res, next, function (row) {
      const query = {id: row.id, slug: row.slug}
      Programs.del(query, function deletedRow(error, result) {
        if (error)
          return dbErrorHandler(error, row, req, next);
        res.send({status: 'deleted', program: row});
      });
    });
  }

  server.put('/programs/:programId', updateProgram);
  function updateProgram(req, res, next) {
    getProgram(req, res, next, function (row) {
      const updated = safeExtend(row, req.body)
      const image = imageHelper.getFromPost(req)
      delete updated.image

      row.issuerId = row.issuerId || undefined;


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
    });
  }
};

function getProgram(req, res, next, callback) {
  const query = {slug: req.params.programId};
  const options = {relationships: true};
  Programs.getOne(query, options, function foundProgram(error, row) {
    if (error)
      return dbErrorHandler(error, row, res, next)

    if (!row)
      return next(errorHelper.notFound('Could not find program with slug `'+query.slug+'`'));

    return callback(row)
  });
}

function fromPostToRow(post) {
  return {
    slug: post.slug,
    url: post.url,
    name: post.name,
    email: post.email,
    description: post.description,
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
