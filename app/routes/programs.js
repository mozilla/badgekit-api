const xtend = require('xtend')
const Programs = require('../models/program');

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
    const validationErrors = Programs.validateRow(row);

    if (validationErrors.length) {
      res.send(400, {errors: validationErrors})
      return next()
    }

    Programs.put(row, function savedRow(error, result) {
      if (error)
        return handleError(error, row, res, next)

      res.send(201, {status: 'created'})
      return next();
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
      Programs.del(row, function deletedRow(error, result) {
        if (error)
          return handleError(error, row, req, next)
        res.send({status: 'deleted', row: row});
      });
    });
  }

  server.put('/programs/:programId', updateProgram);
  function updateProgram(req, res, next) {
    getProgram(req, res, next, function (row) {
      const updated = xtend(row, req.body)
      Programs.put(updated, function updatedRow(error, result) {
        if (error)
          return handleError(error, row, res, next)
        res.send({status: 'updated'})
      })
    });
  }

};

function getProgram(req, res, next, callback) {
  const query = {slug: req.params.programId};
  Programs.getOne(query, function foundProgram(error, row) {
    if (error)
      return handleError(error, row, res, next)

    if (!row) {
      res.send(404, {error: 'not found'});
      return next()
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
  }
}
