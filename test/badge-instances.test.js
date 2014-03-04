const test = require('tap').test
const app = require('../')
const spawn = require('./spawn')

spawn(app).then(function (api) {
  test('creating a new badge instance', function (t) {
    const now = (Date.now()/1000|0)
    const expires = now + 8600
    api.post('/systems/chicago/badges/chicago-badge/instances', {
      garbage: 'yep',
      nonsense: 'totally'
    }).then(function (res) {
      t.same(res.statusCode, 400, 'should get validation errors')
      return api.post('/systems/chicago/badges/chicago-badge/instances', {
        email: 'brian@example.org',
        expires: expires,
      })
    }).then(function (res) {
      const assertionUrl = res.headers.location
      t.same(res.statusCode, 201, 'should get created')
      t.same(assertionUrl, res.body.location, 'should have right location')
      t.ok(/^\/public\/assertions\/[0-9a-f]+$/.test(assertionUrl), 'correct location format')
      return api.get(assertionUrl)
    }).then(function(res) {
      t.same(res.statusCode, 200, 'should be found')
      const assertion = res.body
      const badgeClassUrl = assertion.badge
      t.same(badgeClassUrl, '/public/systems/chicago/badges/chicago-badge', 'should have the right badgeclass')
      t.same(assertion.verify.type, 'hosted', 'should be a hosted badge')
      t.ok(/^\/public\/assertions\/[0-9a-f]+$/.test(assertion.verify.url), 'matchs URL format')
      t.ok(assertion.issuedOn >= now && assertion.issuedOn <= now + 60, 'reasonable issuedOn')
      t.same(assertion.expires, expires, 'right expiration date')
      return api.get(badgeClassUrl)
    }).then(function(res) {
      t.same(res.statusCode, 200, 'should be found')
      const badgeClass = res.body
      const issuerUrl = badgeClass.issuer
      t.same(badgeClass.name, 'Chicago Badge')
      t.same(badgeClass.description, 'A consumer description of the Chicago Badge')
      t.same(badgeClass.criteria, 'http://example.org/chicagoCriteria')
      t.same(badgeClass.image, 'http://example.org/test.png')
      t.same(issuerUrl, '/public/systems/chicago')
      return api.get(issuerUrl)
    }).then(function(res) {
      const issuerOrg = res.body
      t.same(issuerOrg.name, 'Chicago')
      t.same(issuerOrg.url, 'http://cityofchicago.org')
      t.same(issuerOrg.description, 'The City of Chicago')
      t.same(issuerOrg.email, 'mayor-emanuel@cityofchicago.org')
      t.end()
    })
  })

  test(':cleanup:', function (t) {
    api.done(); t.end()
  })
})
