module.exports = {
  createFromFile: createFromFile,
  createFromUrl: createFromUrl,
  putModel: putModel,
}

const fs = require('fs')
const crypto = require('crypto')
const Images = require('../models/image')

function hashString (str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

function createFromFile (file, callback) {
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

function createFromUrl (url, callback) {
  const row = {
    slug: hashString(Date.now() + url),
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

      Model.put(data, callback);
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
