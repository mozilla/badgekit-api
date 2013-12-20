const crypto = require('crypto');
const fs = require('fs');
const xtend = require('xtend');

const Badges = require('../models/badge');
const Images = require('../models/image');

exports = module.exports = function applyBadgeRoutes (server) {

  server.get('/badges', showAllBadges);
  function showAllBadges (req, res, next) {
    Badges.get({}, function foundRows (error, rows) {
      if (error)
        return handleError(error, null, res, next);

      res.send({badges: rows.map(badgeFromDb)});
      return next();
    });
  }

  server.post('/badges', saveBadge);
  function saveBadge (req, res, next) {
    var row = fromPostToRow(req.body);
    var image = (req.files || {}).image || {};
    if (!image.size)
      image = req.body.image || {};

    putBadge(row, image, function (err, result) {
      if (err) {
        if (!isArray(err))
          return handleError(err, row, res, next);

        res.send(400, {errors: err});
        return next();
      }

      res.send(201, {status: 'created'});
    });
  }

  server.get('/badges/:badgeId', showOneBadge);
  function showOneBadge (req, res, next) {
    getBadge(req, res, next, function (row) {
      res.send({badge: badgeFromDb(row)});
      return next();
    });
  }

  server.del('/badges/:badgeId', deleteBadge);
  function deleteBadge (req, res, next) {
    getBadge(req, res, next, function (row) {
      Badges.del({id: row.id}, {debug: true}, function deletedRow (error, result) {
        if (error)
          return handleError(error, row, req, next);
        res.send({status: 'deleted', badge: badgeFromDb(row)});
      });
    });
  }

  server.put('/badges/:badgeId', updateBadge);
  function updateBadge (req, res, next) {
    getBadge(req, res, next, function (badge) {
      var row = xtend(badge, req.body);
      row.issuerId = row.issuerId || undefined;
      var image = (req.files || {}).image || {};
      if (!image.size)
        image = req.body.image || null;

      putBadge(row, image, function (err, result) {
        if (err) {
          if (!isArray(err))
            return handleError(err, row, res, next);

          res.send(400, {errors: err});
          return next();
        }

        res.send({status: 'updated'});
      });
    });
  }

};

function isArray (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
}

function putBadge (data, image, callback) {
  function finish (err, imageId) {
    if (err)
      return callback(err);

    if (imageId)
      data.imageId = imageId;

    Badges.put(data, callback);
  }

  var validationErrors = Badges.validateRow(data);

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

function getBadge (req, res, next, callback) {
  const query = {slug: req.params.badgeId};
  const options = {relationships: true};
  Badges.getOne(query, options, function foundBadge (error, row) {
    if (error)
      return handleError(error, row, res, next);

    if (!row) {
      res.send(404, {error: 'not found'});
      return next();
    }

    return callback(row);
  });
}

const errorCodes = {
  ER_DUP_ENTRY: [409, {error: 'A badge with that `slug` already exists'}]
};

function handleError (error, row, res, next) {
  const expected = knownError(error, row);
  if (!expected) return next(error);
  res.send.apply(res, expected);
  return next();
}

function knownError (error, row) {
  const err = errorCodes[error.code];
  if (!err) return;
  if (row) err[1].received = row;
  return err;
}

function fromPostToRow (post) {
  return {
    slug: post.slug,
    name: post.name,
    strapline: post.strapline,
    description: post.description
  };
}

function badgeFromDb (row) {
  var image = row.image;

  if (image.url)
    image = image.url;
  else
    image = '/images/' + image.slug;

  return {
    slug: row.slug,
    name: row.name,
    strapline: row.strapline,
    description: row.description,
    image: image
  };
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
      console.log(err, result);
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
