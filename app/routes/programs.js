const restify = require('restify')
const safeExtend = require('../lib/safe-extend')
const Programs = require('../models/program');

const ImageHelper = require('../lib/image-helper')
const putProgram = ImageHelper.putModel(Programs)

exports = module.exports = function applyProgramRoutes (server) {
  server.get('/programs', showAllPrograms);
  function showAllPrograms(req, res, next) {
    const query = {}
    const options = {relationships: true};
    Programs.get(query, options, function foundRows(error, rows) {
      if (error)
        return handleError(error, null, res, next)

      res.send({programs: rows.map(programFromDb)});
      return next();
    });
  }

  server.post('/programs', saveProgram);
  function saveProgram(req, res, next) {
    const row = fromPostToRow(req.body);
    var image = (req.files || {}).image || {};
    if (!image.size)
      image = req.body.image || {};

    putProgram(row, image, function savedRow(err, result) {
      if (err) {
        if (!Array.isArray(err))
          return handleError(err, row, res, next);

        return res.send(400, {
          code: 'ValidationError',
          message: 'Could not validate required fields',
          details: err,
        });
      }

      res.send(201, {status: 'created', program: row});
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
          return handleError(error, row, req, next)
        res.send({status: 'deleted', program: row});
      });
    });
  }

  server.put('/programs/:programId', updateProgram);
  function updateProgram(req, res, next) {
    getProgram(req, res, next, function (row) {
      const updated = safeExtend(row, req.body)
      delete updated.image

      row.issuerId = row.issuerId || undefined;

      var image = (req.files || {}).image || {};
      if (!image.size)
        image = req.body.image || null;

      putProgram(updated, image, function updatedRow(err, result) {
        if (err) {
          if (!Array.isArray(err))
            return handleError(err, row, res, next);

          return res.send(400, {
            code: 'ValidationError',
            message: 'Could not validate required fields',
            details: err,
          });
        }

        res.send({status: 'updated', program: row});
      })
    });
  }
};

function getProgram(req, res, next, callback) {
  const query = {slug: req.params.programId};
  const options = {relationships: true};
  Programs.getOne(query, options, function foundProgram(error, row) {
    if (error)
      return handleError(error, row, res, next)

    if (!row) {
      const notFoundErr = new restify.ResourceNotFoundError('Could not find program with slug `'+query.slug+'`')
      return next(notFoundErr);
    }

    return callback(row)
  });
}

const errorCodes = {
  ER_DUP_ENTRY: [409, {error: 'A program with that `slug` already exists'}]
}

function handleError(error, row, res, next) {
  const expected = knownError(error, row)
  if (!expected) return next(error)
  res.send.apply(res, expected)
  return next()
}

function knownError(error, row) {
  const err = errorCodes[error.code];
  if (!err) return;
  if (row) err[1].received = row
  return err;
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
