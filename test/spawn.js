const http = require('http')
const request = require('request')
const FormData = require('form-data')
const concat = require('concat-stream')
const Q = require('q')
const fs = require('fs')
const db = require('../app/lib/db')
const path = require('path')

const sql = Buffer.concat([
  fs.readFileSync(path.join(__dirname, '..', 'schema.sql')),
  fs.readFileSync(path.join(__dirname, 'test-data.sql')),
]).toString('utf8')

if (process.env.NODE_ENV !== 'test') {
  console.error('Must be in test environment: expected, NODE_ENV=test, got NODE_ENV='+process.env.NODE_ENV)
  process.exit(1)
}

module.exports = function spawner(app, callback) {
  function makeRequestFn(port) {
    const baseUrl = 'http://127.0.0.1:'+port
    function requester(method, url, form) {
      const deferred = Q.defer()
      if (form) {
        const formData = new FormData()

        for (var field in form) {
          formData.append(field, form[field])
        }

        formData.submit(baseUrl + url, function (err, res) {
          res.resume()
          res.pipe(concat(function (data) {
            deferred.resolve(JSON.parse(data))
          }))
        })

      } else {
        const r = request[method.toLowerCase()](baseUrl + url)
        r.pipe(concat(function (data) {
          deferred.resolve(JSON.parse(data))
        }))
        r.end()
      }
      return deferred.promise
    }
    return {
      get: requester.bind(null, 'get'),
      post: requester.bind(null, 'post'),
      put: requester.bind(null, 'put'),
      del: requester.bind(null, 'del'),
      done: function () {
        db.close()
      }
    }
  }

  const deferred = Q.defer()

  db.query(sql, function (err, result) {
    if (err) throw err

    const server = app.listen(0, function () {
      deferred.resolve(makeRequestFn(this.address().port))
    })

    server.unref()
  })

  return deferred.promise
}
