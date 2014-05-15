const http = require('http')
const request = require('request')
const FormData = require('form-data')
const concat = require('concat-stream')
const Promise = require('bluebird')
const fs = require('fs')
const db = require('../app/lib/db')
const path = require('path')
const migrations = require('../lib/migrations')
const async = require('async')

if (!/test$/.exec(process.env.NODE_ENV)) {
  console.error('Must be in test environment: expected, NODE_ENV=test, got NODE_ENV='+process.env.NODE_ENV)
  process.exit(1)
}

function loadFixtures(callback) {
  var sql = fs.createReadStream(path.join(__dirname, 'test-data.sql'), { encoding:'utf-8' });
  var statement = "";
  var statements = [];
  sql.on('readable', function(chunk) {
    while (null !== (chunk = sql.read(1))) {
      statement += chunk;
      if (chunk == ';') {
        statements.push(statement);
        statement = "";
      }
    };
  });

  sql.on('end', function() {
    async.each(statements, function(sqlStatement, done) {
      db.sql(sqlStatement);
      done();
    }, callback);
  });
};

function loadDatabase(callback) {
  var options = {};
  options.config = db.getDbConfig('DATABASE');
  //
  migrations.down(options, function(err) {
    if(err) throw(err); console.error("db dropppppped");
    migrations.up(options, function(err) {
      if (err) throw(err);
      console.error("db up'd");
      loadFixtures(callback)
    });
  });
}

module.exports = function spawner(app, callback) {
  function makeRequestFn(port) {
    const baseUrl = 'http://127.0.0.1:'+port
    function requester(method, url, form) {
      const deferred = Promise.defer()

      function resolve(status, body, headers) {
        return deferred.resolve({statusCode: status, body: body, headers: headers})
      }

      if (form) {
        const formData = new FormData()

        for (var field in form) {
          formData.append(field, form[field])
        }

        const options = {
          url: baseUrl + url,
          method: method.toUpperCase(),
          headers: formData.getHeaders(),
        }

        const req = request(options)
        formData.pipe(req)
        req.pipe(concat(function (body) {
          resolve(req.response.statusCode, JSON.parse(body), req.response.headers)
        }))

      } else {
        request[method.toLowerCase()](baseUrl + url, function (err, res, body) {
          if (err) throw err
          resolve(res.statusCode, JSON.parse(body), res.headers)
        })
      }
      return deferred.promise
    }
    return {
      makeUrl: function (url) {return baseUrl + url},
      get: requester.bind(null, 'get'),
      post: requester.bind(null, 'post'),
      put: requester.bind(null, 'put'),
      del: requester.bind(null, 'del'),
      fail: function fail(t) {
        return function catcher(err) {
          t.fail('Error: ' + err.message)
          console.log(err.stack)
          t.end()
        }
      },
      done: function done() {
        db.close()
      }
    }
  }

  const deferred = Promise.defer()

  loadDatabase(function (err, result) {
    if (err) throw err

    const server = app.listen(0, function () {
      deferred.resolve(makeRequestFn(this.address().port))
    })

    server.unref()
  })

  return deferred.promise
}
