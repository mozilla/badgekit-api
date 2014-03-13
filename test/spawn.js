const http = require('http')
const request = require('request')
const FormData = require('form-data')
const concat = require('concat-stream')
const Q = require('q')
const fs = require('fs')
const db = require('../app/lib/db')
const path = require('path')

if (!/test$/.exec(process.env.NODE_ENV)) {
  console.error('Must be in test environment: expected, NODE_ENV=test, got NODE_ENV='+process.env.NODE_ENV)
  process.exit(1)
}

function loadDatabase(callback) {
  const lines = Buffer.concat([
    fs.readFileSync(path.join(__dirname, '..', 'schema.sql')),
    fs.readFileSync(path.join(__dirname, 'test-data.sql')),
  ]).toString('utf8')
    .trim()
    .split(';')
    .map(function (s) {return s.trim()})
    .filter(Boolean)

  ;(function next(i) {
    const sql = lines[i]
    if (!sql) return callback()

    db.query(sql, function (err) {
      if (err) return callback(err)
      return next(++i)
    })

  })(0)
}

module.exports = function spawner(app, callback) {
  function makeRequestFn(port) {
    const baseUrl = 'http://127.0.0.1:'+port
    function requester(method, url, form) {
      const deferred = Q.defer()

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

  const deferred = Q.defer()

  loadDatabase(function (err, result) {
    if (err) throw err

    const server = app.listen(0, function () {
      deferred.resolve(makeRequestFn(this.address().port))
    })

    server.unref()
  })

  return deferred.promise
}
