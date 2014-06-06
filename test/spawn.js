const Stream = require('stream')
const http = require('http')
const request = require('request')
const FormData = require('form-data')
const concat = require('concat-stream')
const Promise = require('bluebird')
const fs = require('fs')
const db = require('../app/lib/db')
const migrations = require('../app/lib/migrations')
const path = require('path')
const async = require('async')

if (!/test$/.exec(process.env.NODE_ENV)) {
  console.error('Must be in test environment: expected, NODE_ENV=test, got NODE_ENV='+process.env.NODE_ENV)
  process.exit(1)
}

/**
 * Here's the idea:
 *  1. Run the `up` migration to make sure the database is
 *     up-to-date. If it is, this is a no-op.
 *  2. Get a list of the current tables (omitting the `migrations`
 *     table) and create `TRUNCATE` statements for each of them.
 *  3. Read the fixtures file and split it into statements.
 *  4. Concat the list of fixture statements onto the list of truncate
 *     statements.
 *
 *  This approach is *much* faster than doing an `up` and a `down` since
 *  `loadDatabase` will be called at least once per test file.
 */
function loadDatabase(callback) {
  const options = { config: db.getDbConfig() }

  migrations.up(options, function (err) {
    if (err) throw err;

    db.query('SHOW TABLES', function (err, tableData) {

      const truncateSql = ['SET `foreign_key_checks` = 0'];
      tableData.forEach(function (obj) {
        var table = obj[Object.keys(obj)[0]];
        if (table == 'migrations') return;
        truncateSql.push('TRUNCATE TABLE `' + table + '`');
      })
      truncateSql.push('SET `foreign_key_checks` = 1');

      const fixturePath = path.join(__dirname, 'test-data.sql');
      const fixtureSql = fs.readFileSync(fixturePath, 'utf8')
        .trim()
        .split(';')
        .map(function (s) {return s.trim()})
        .filter(Boolean);

      const statements = truncateSql.concat(fixtureSql);
      async.each(statements, db.query.bind(db), callback);
    });
  })
}

function hasBufferOrStream(obj) {
  for (var field in obj) {
    if (Buffer.isBuffer(obj[field]))
      return true;
    if (obj[field] instanceof Stream)
      return true;
  }
  return false;
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
        var req, formData;
        const options = {
          url: baseUrl + url,
          method: method.toUpperCase(),
        }
        if (hasBufferOrStream(form)) {
          formData = new FormData()

          for (var field in form) {
            formData.append(field, form[field])
          }

          options.headers = formData.getHeaders()

          req = request(options)
          formData.pipe(req)
        } else {
          formData = JSON.stringify(form)
          options.headers = {
            'Content-Type': 'application/json',
            'Content-Length': formData.length,
          }
          req = request(options)
          req.write(formData)
          req.end()
        }
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
