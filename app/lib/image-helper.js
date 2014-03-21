module.exports = {
  createFromFile: createFromFile,
  createFromUrl: createFromUrl,
  getFromPost: getFromPost,
  putModel: putModel,
}

const fs = require('fs')
const Images = require('../models/image')
const hash = require('./hash').hash

function getFromPost(req, opts) {
  opts = opts || {}
  // first see if we have an uploaded file
  var image = (req.files || {}).image || {};

  // if there's no size on it, we assume it's a url
  if (!image.size)
    image = req.body.image || req.body.imageUrl;

  if (opts.required)
    image = image || {}

  return image
}

function createFromFile (file, callback) {
  fs.readFile(file.path, function (err, data) {
    if (err)
      return callback(err);

    const row = {
      slug: hash('md5', Date.now() + file.path),
      mimetype: file.mimetype,
      data: data
    };

    Images.put(row, function (err, result) {
      callback(err, result.insertId);
    });
  });
}

function createFromUrl (url, callback) {
  const row = {
    slug: hash('md5', Date.now() + url),
    url: url
  };

  Images.put(row, function (err, result) {
    callback(err, result.insertId);
  });
}

function putModel(Model) {
  return function put(data, image, callback) {
    function finish(err, imageId) {
      if (err)
        return callback(err);

      if (imageId)
        data.imageId = imageId;

      Model.put(data, function (err, result) {
        if (err)
          return callback(err)

        const query = {slug: data.slug};
        const options = {relationships: true};
        return Model.getOne(query, options, callback)
      });
    }

    var validationErrors = Model.validateRow(data);

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
      return createFromFile(image, finish);

    if (image.url)
      return createFromUrl(image.url, finish);
  }
}
