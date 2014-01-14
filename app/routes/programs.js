const crypto = require('crypto');
const fs = require('fs');

const xtend = require('xtend')
const Programs = require('../models/program');
const Images = require('../models/image');

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

        res.send(400, {errors: err});
        return next();
      }

      res.send(201, {status: 'created'});
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
      row.issuerId = row.issuerId || undefined;
      var image = (req.files || {}).image || {};
      if (!image.size)
        image = req.body.image || null;

      putProgram(updated, image, function updatedRow(err, result) {
        if (err) {
          if (!Array.isArray(err))
            return handleError(err, row, res, next);

          res.send(400, {errors: err});
          return next();
        }

        res.send({status: 'updated'});
      })
    });
  }
};
function putProgram(data, image, callback) {
  function finish(err, imageId) {
    if (err)
      return callback(err);

    if (imageId)
      data.imageId = imageId;

    Programs.put(data, callback);
  }

  var validationErrors = Programs.validateRow(data);

  if (image) {
    if (typeof image === 'string') {
      image = {url: image};
    } else {
      image = {
        mimetype: image.type,
        size: image.size,
        path: image.path
      };
    }
    image.slug = 'tmp';

    validationErrors = validationErrors.concat(Images.validateRow(image));

    if (!image.size && !image.url) {
      validationErrors.push({
        name: 'ValidatorError',
        message: "Missing value",
        field: 'image'
      });
    }
  }

  if (validationErrors.length)
    return finish(validationErrors);

  if (!image)
    return finish();

  if (image.size)
    return createImageFromFile(image, finish);

  if (image.url)
    return createImageFromUrl(image.url, finish);
}

function getProgram(req, res, next, callback) {
  const query = {slug: req.params.programId};
  const options = {relationships: true};
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
    imageUrl: row.image ? row.image.toUrl() : null,
  }
}

function hashString (str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function createImageFromFile (file, callback) {
  fs.readFile(file.path, function (err, data) {
    if (err)
      return callback(err);

    const row = {
      slug: hashString(Date.now() + file.path),
      mimetype: file.mimetype,
      data: data
    };

    Images.put(row, function (err, result) {
      callback(err, result.insertId);
    });
  });
}

function createImageFromUrl (url, callback) {
  const row = {
    slug: hashString(Date.now() + url),
    url: url
  };

  Images.put(row, function (err, result) {
    callback(err, result.insertId);
  });
}
