const test = require('tap').test
const jws = require('jws')
const url = require('url')
const concat = require('concat-stream')
const sha256 = require('../app/lib/hash').sha256
const app = require('../')
const spawn = require('./spawn')
const startWebhookServer = require('./test-webhook-server')

spawn(app).then(function (api) {
  test('creating a new badge instance', function (t) {
    const now = (Date.now()/1000|0)
    const expires = now + 8600
    const email = 'brian@example.org'

    api.post('/systems/chicago/badges/chicago-badge/instances', {
      garbage: 'yep',
      nonsense: 'totally'
    }).then(function (res) {
      t.same(res.statusCode, 400, 'should get validation errors')
      return api.post('/systems/chicago/badges/chicago-badge/instances', {
        email: email,
        expires: expires,
      })
    }).then(function (res) {
      const assertionUrl = res.headers.location
      t.same(res.statusCode, 201, 'should get created')
      t.ok(/^\/public\/assertions\/[0-9a-f]+$/.test(assertionUrl), 'correct location format')
      return api.get(assertionUrl)
    }).then(function(res) {
      t.same(res.statusCode, 200, 'should be found')

      const assertion = res.body
      const badgeClassUrl = assertion.badge
      const relativeBadgeClassUrl = url.parse(assertion.badge).pathname
      t.ok(/^http/.test(badgeClassUrl), 'badge class url should be absolute')
      t.same(relativeBadgeClassUrl, '/public/systems/chicago/badges/chicago-badge')
      t.same(assertion.verify.type, 'hosted', 'should be a hosted badge')

      const verifyUrl = assertion.verify.url
      const relativeVerifyUrl = url.parse(assertion.verify.url).pathname
      t.ok(/^http/.test(verifyUrl), 'verify url should be absolute')
      t.ok(/^\/public\/assertions\/[0-9a-f]+$/.test(relativeVerifyUrl), 'matchs URL format')
      t.ok(assertion.issuedOn >= now && assertion.issuedOn <= now + 60, 'reasonable issuedOn')
      t.same(assertion.expires, expires, 'right expiration date')

      return api.get(relativeBadgeClassUrl)
    }).then(function(res) {
      t.same(res.statusCode, 200, 'should be found')
      const badgeClass = res.body
      const issuerUrl = badgeClass.issuer
      const relativeIssuerUrl = url.parse(badgeClass.issuer).pathname
      t.same(badgeClass.name, 'Chicago Badge')
      t.same(badgeClass.description, 'A consumer description of the Chicago Badge')
      t.same(badgeClass.criteria, 'http://example.org/chicagoCriteria')
      t.same(badgeClass.image, 'http://example.org/test.png')
      t.ok(/^http/.test(issuerUrl), 'issuer url should be absolute')
      t.same(relativeIssuerUrl, '/public/systems/chicago')
      return api.get(relativeIssuerUrl)
    }).then(function(res) {
      const issuerOrg = res.body
      t.same(issuerOrg.name, 'Chicago')
      t.same(issuerOrg.url, 'http://cityofchicago.org')
      t.same(issuerOrg.description, 'The City of Chicago')
      t.same(issuerOrg.email, 'mayor-emanuel@cityofchicago.org')
      return api.get('/systems/chicago/instances/' + email + '?page=1&count=1')
    }).then(function(res) {
      t.same(res.statusCode, 200, 'should be found')
      t.ok(res.body.instances && res.body.instances.length === 1, 'should find one instance')
      t.same(res.body._pageData.total, 1)
      t.same(res.body._pageData.page, 1)
      t.same(res.body._pageData.count, 1)
      const instance = res.body.instances[0]
      t.same(instance.email, email, 'should be correct email')
      t.same(instance.badge.slug, 'chicago-badge', 'should be instance of chicago-badge')
      return api.get('/systems/chicago/badges/chicago-badge/instances/' + email)
    }).then(function(res) {
      t.same(res.statusCode, 200, 'should be found')
      t.ok(res.body.instance, 'should find instance')
      t.same(res.body.instance.email, email, 'should be correct email')
      t.same(res.body.instance.badge.slug, 'chicago-badge', 'should be instance of chicago-badge')
      return api.del('/systems/chicago/badges/chicago-badge/instances/' + email)
    }).then(function(res) {
      t.same(res.statusCode, 200, 'should be successful')
      t.ok(res.body.instance, 'should return deleted instance')
      t.same(res.body.instance.email, email, 'should be correct email')
      t.same(res.body.instance.badge.slug, 'chicago-badge', 'should be instance of chicago-badge')
      return api.get('/systems/chicago/badges/chicago-badge/instances/' + email)
    }).then(function(res) {
      t.same(res.statusCode, 404, 'should not be found')
      t.end()
    }).catch(api.fail(t))
  })

  test('Trying to get a missing assertion', function (t) {
    const url = '/public/assertions/slug-does-not-exist'
    api.get(url).then(function(res){
      t.same(res.statusCode, 404)
      t.end()
    })
  })

  test('Awarding a badge with a multi-use claim code', function (t) {
    const url = '/systems/chicago/badges/chicago-badge/instances'
    const email = 'brian+claimcode@example.org'
    const form = {
      email: email,
      claimCode: 'multiple-use',
    }
    api.post(url, form).then(function (res) {
      t.same(res.statusCode, 201, 'should be created')
      return api.get('/systems/chicago/badges/chicago-badge/codes/multiple-use')
    }).then(function (res) {
      t.same(res.body.claimCode.email, email, 'should have the right email')
      form.email = 'brian+should-work@example.org'
      return api.post(url, form)
    }).then(function (res) {
      t.same(res.statusCode, 201, 'should be created')
      t.end()
    }).catch(api.fail(t))
  })

  test('Awarding a badge with a single-use claim code', function (t) {
    const url = '/systems/chicago/badges/chicago-badge/instances'
    const email = 'brian+single@example.org'
    const form = {
      email: email,
      claimCode: 'single-use',
    }
    api.post(url, form).then(function (res) {
      return api.get('/systems/chicago/badges/chicago-badge/codes/single-use')
    }).then(function (res) {
      t.same(res.body.claimCode.email, email, 'should have the right email')
      form.email = 'brian+should-fail@example.org'
      return api.post(url, form)
    }).then(function (res) {
      t.same(res.statusCode, 400, 'should have failed')
      t.end()
    }).catch(api.fail(t))
  })

  test('Webhook fires when necessary', function (t) {
    const secret = 'shhh.very.secret'
    const email = 'brian-webhook@example.org'
    const now = Date.now()/1000|0
    startWebhookServer({
      systemId: 1,
      secret: secret
    }).then(function(server){
      server.once('request', function (req, res) {
        req.setEncoding('utf8')
        req.pipe(concat(function (body) {
          res.end('lollerskates')

          const match = /^JWT token="(.+?)"$/.exec(req.headers.authorization)
          t.ok(match, 'should have a proper auth header')

          const tokenString = match[1]
          t.ok(jws.verify(tokenString, secret), 'token should be verifiable')

          const token = jws.decode(tokenString)
          t.ok(token, 'token should be decodable')

          const hash = sha256(body)
          const auth = token.payload
          t.same(auth.body.hash, hash, 'should get expected body hash')

          const hookData = JSON.parse(body)
          const assertionUrlParts = url.parse(hookData.assertionUrl)
          const assertionUrl = assertionUrlParts.pathname
          t.same(hookData.action, 'award', 'should be correct action')
          t.same(hookData.email, email, 'should be correct email')
          t.ok(hookData.issuedOn >= now, 'should have good issuedOn')
          t.ok(/^\/public\/assertions\/[0-9a-f]+$/.test(assertionUrl), 'properly formed assertion url')
          
          server.once('request', function (req, res) {
            req.setEncoding('utf8')
            req.pipe(concat(function (body) {
              res.end('lollerskates')
              server.close()

              const match = /^JWT token="(.+?)"$/.exec(req.headers.authorization)
              t.ok(match, 'should have a proper auth header')

              const tokenString = match[1]
              t.ok(jws.verify(tokenString, secret), 'token should be verifiable')

              const token = jws.decode(tokenString)
              t.ok(token, 'token should be decodable')

              const hash = sha256(body)
              const auth = token.payload
              t.same(auth.body.hash, hash, 'should get expected body hash')

              const hookData = JSON.parse(body)
              t.same(hookData.action, 'revoke', 'should be correct action')
              t.same(hookData.email, email, 'should be correct email')

              t.end()
            }))
          })

          api.del('/systems/chicago/badges/chicago-badge/instances/' + email).then(function(res){
            t.same(res.statusCode, 200, 'should be deleted')
          }).catch(api.fail(t))
        }))
      })

      api.post('/systems/chicago/badges/chicago-badge/instances', {
        email: email,
      }).then(function(res){
        t.same(res.statusCode, 201, 'should be created')
      }).catch(api.fail(t))
    }).catch(api.fail(t))
  })


  test(':cleanup:', function (t) {
    api.done(); t.end()
  })
})
