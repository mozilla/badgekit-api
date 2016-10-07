const secret = process.env.MASTER_SECRET='shhh.secret'
const env = process.env.NODE_ENV='auth-test'

const test = require('tap').test
const jws = require('jws')
const http = require('http')
const uri = require('url')
const util = require('util')
const concat = require('concat-stream')
const crypto = require('crypto')
const app = require('../')
const spawn = require('./spawn')

spawn(app).then(function (api) {

  test('GET request, missing auth', function (t) {
    const url = api.makeUrl('/systems/chicago')
    http.get(reqOpts(url), function (res) {
      t.same(res.statusCode, 403, 'should get 403')
      res.pipe(concat(function (data) {
        const result = JSON.parse(data)
        t.same(result.code, 'NotAuthorized', 'should get the right code')
        t.end()
      }))
    })
  })

  test('GET request, master key', function (t) {
    const url = api.makeUrl('/systems/chicago?with=query')
    var token = jws.sign({
      secret: secret,
      header: {typ: "JWT", alg: "HS256"},
      payload: {
        key: 'master',
        path: '/systems/chicago?with=query',
        method: "GET",
        exp: (Date.now()/1000|0) + 60
      }
    })

    const opts = reqOpts(url, token)
    http.get(opts, function (res) {
      res.pipe(concat(function (data) {
        const result = JSON.parse(data)
        t.same(result.system.slug, 'chicago')
        t.end()
      }))
    })
  })

  test('POST request, master key, hash string', function (t) {
    const url = api.makeUrl('/systems')
    const body = '{"slug": "test-system", "name": "Test System ∞", "url":"http://example.org"}'
    const token = jws.sign({
      secret: secret,
      header: {typ: "JWT", alg: "HS256"},
      payload: {
        key: 'master',
        path: '/systems',
        method: 'POST',
        exp: (Date.now()/1000|0) + 60,
        body: {
          alg: 'sha256',
          hash: sha256(body),
        },
      }
    })

    const opts = reqOpts(url, token)
    opts.method = 'POST'
    opts.headers['Content-Type'] = 'application/json'
    const req = http.request(opts, function (res) {
      res.pipe(concat(function (data) {
        const result = JSON.parse(data)
        t.same(result.status, 'created')
        t.end()
      }))
    })

    req.write(body)
    req.end()
  })

  test('POST request, master key, hash buffer', function (t) {
    const url = api.makeUrl('/systems')
    const body = Buffer('{"slug": "test-system-two", "name": "Test System ∞", "url":"http://example.org"}')
    const token = jws.sign({
      secret: secret,
      header: {typ: "JWT", alg: "HS256"},
      payload: {
        key: 'master',
        path: '/systems',
        method: 'POST',
        exp: (Date.now()/1000|0) + 60,
        body: {
          alg: 'sha256',
          hash: sha256(body),
        },
      }
    })

    const opts = reqOpts(url, token)
    opts.method = 'POST'
    opts.headers['Content-Type'] = 'application/json'
    const req = http.request(opts, function (res) {
      res.pipe(concat(function (data) {
        const result = JSON.parse(data)
        t.same(result.status, 'created')
        t.end()
      }))
    })

    req.write(body)
    req.end()
  })

  test('GET requests, chicago key', function (t) {
    const chicagoSecret = 'At9p1PVNW5jQAV8LnvfGdpbnuAcxq765pBNNhV9Kjnvgyn4S7YEs7KgVla1OGyny'
    const url = api.makeUrl('/systems/chicago?with=query')
    var token, opts, jwsOpts
    const makeJwsOpts = function(){ return {
      secret: chicagoSecret,
      header: {typ: "JWT", alg: "HS256"},
      payload: {
        key: 'radical',
        path: '/systems/chicago?with=query',
        method: "GET",
        exp: (Date.now()/1000|0) + 60
      }
    }}

    token = jws.sign(makeJwsOpts())
    opts = reqOpts(url, token)
    http.get(opts, function (res) {
      res.pipe(concat(function (data) {
        const result = JSON.parse(data)
        t.same(result.system.slug, 'chicago', 'should pass auth')
      }))
    })

    jwsOpts = makeJwsOpts()
    jwsOpts.secret = 'invalid secret'
    opts = reqOpts(url, jws.sign(jwsOpts))
    http.get(opts, function (res) {
      res.pipe(concat(function (data) {
        const result = JSON.parse(data)
        t.same(res.statusCode, 403, 'should get 403')
      }))
    })

    jwsOpts = makeJwsOpts()
    jwsOpts.payload.key = 'whatever'
    opts = reqOpts(url, jws.sign(jwsOpts))
    http.get(opts, function (res) {
      res.pipe(concat(function (data) {
        const result = JSON.parse(data)
        t.same(res.statusCode, 403, 'should get 403')
      }))
    })

    jwsOpts = makeJwsOpts()
    jwsOpts.payload.path = '/not/the/right/path'
    opts = reqOpts(url, jws.sign(jwsOpts))
    http.get(opts, function (res) {
      res.pipe(concat(function (data) {
        const result = JSON.parse(data)
        t.same(res.statusCode, 403, 'should get 403')
      }))
    })

    jwsOpts = makeJwsOpts()
    jwsOpts.payload.exp = Date.now()/1000|0 - 60
    opts = reqOpts(url, jws.sign(jwsOpts))
    http.get(opts, function (res) {
      res.pipe(concat(function (data) {
        const result = JSON.parse(data)
        t.same(res.statusCode, 403, 'should get 403')
      }))
    })

    jwsOpts = makeJwsOpts()
    jwsOpts.payload.method = 'PUT'
    opts = reqOpts(url, jws.sign(jwsOpts))
    http.get(opts, function (res) {
      res.pipe(concat(function (data) {
        const result = JSON.parse(data)
        t.same(res.statusCode, 403, 'should get 403')
      }))
    })

    jwsOpts = makeJwsOpts()
    jwsOpts.payload.method = null
    opts = reqOpts(url, jws.sign(jwsOpts))
    http.get(opts, function (res) {
      res.pipe(concat(function (data) {
        const result = JSON.parse(data)
        t.same(res.statusCode, 403, 'should get 403')
      }))
    })

    jwsOpts = makeJwsOpts()
    jwsOpts.payload.path = null
    opts = reqOpts(url, jws.sign(jwsOpts))
    http.get(opts, function (res) {
      res.pipe(concat(function (data) {
        const result = JSON.parse(data)
        t.same(res.statusCode, 403, 'should get 403')
      }))
    })

    const pittsurl = api.makeUrl('/systems/pittsburgh')
    jwsOpts = makeJwsOpts()
    jwsOpts.payload.path = '/systems/pittsburgh'
    opts = reqOpts(pittsurl, jws.sign(jwsOpts))
    http.get(opts, function (res) {
      res.pipe(concat(function (data) {
        const result = JSON.parse(data)
        t.same(res.statusCode, 403, 'should get 403')
      }))
    })

    t.plan(9)
  })

  test('GET a public url, should not 403 without auth', function (t) {
    http.get(api.makeUrl('/public/images/some-image'), function (res) {
      t.same(res.statusCode, 301)
      t.same(res.headers.location, 'http://example.org/test.png')
      res.setEncoding('utf8')
      res.pipe(concat(function (data) {
        t.same(data, '{"location":"http://example.org/test.png"}')
        t.end()
      }))
    })
  })

  test('GET the healthcheck endpoint', function (t) {
    http.get(api.makeUrl('/healthcheck'), function (res) {
      t.same(res.statusCode, 200)
      res.setEncoding('utf8')
      res.pipe(concat(function (data) {
        t.same(JSON.parse(data).app, 'BadgeKit API')
        t.end()
      }))
    })
  })

  test(':cleanup:', function (t) {
    api.done(); t.end()
  })
})

function reqOpts(url, token) {
  const opts = uri.parse(url)
  if (token) {
    opts.headers = opts.headers || {}
    opts.headers['Authorization'] = util.format('JWT token="%s"', token)
  }
  return opts
}

function sha256(stuff) {
  return crypto.createHash('sha256').update(stuff).digest('hex')
}
