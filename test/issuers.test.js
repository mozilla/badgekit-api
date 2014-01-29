const test = require('tap').test
const app = require('../')
const fs = require('fs')
const path = require('path')
const spawn = require('./spawn')

spawn(app).then(function (api) {

  test('get issuer list', function (t) {
    api.get('/issuers').then(function (res) {
      t.ok(res.body.issuers, 'should have issuers')
      t.same(res.body.issuers[0].slug, 'chicago')
      t.end()
    }).catch(api.fail(t))
  })

  test('add new issuer', function (t) {
    const form = {
      slug: 'test-issuer',
      name: 'Test Issuer',
      url: 'https://example.org/issuer',
      email: 'guy@example.org',
    }
    api.post('/issuers', form).then(function (res) {
      t.same(res.body.status, 'created', 'should be created')
      return api.get('/issuers/test-issuer')
    }).then(function (res) {
      t.same(res.body.issuer.name, form.name)
      t.end()
    }).catch(api.fail(t))
  })

  test('update issuer', function (t) {
    const diff = {
      name: 'Test Issuer, okay?!',
      email: 'other-guy@example.org',
    }
    api.put('/issuers/test-issuer', diff).then(function (res) {
      t.same(res.body.status, 'updated', 'should be updated')
      return api.get('/issuers/test-issuer')
    }).then(function (res) {
      t.same(res.body.issuer.name, diff.name)
      t.same(res.body.issuer.email, diff.email)
      t.end()
    }).catch(api.fail(t))
  })

  test('delete issuer', function (t) {
    api.del('/issuers/test-issuer').then(function(res){
      t.same(res.body.status, 'deleted')
      t.end()
    }).catch(api.fail(t))
  })

  test(':cleanup:', function (t) {
    api.done(); t.end()
  })

})


function stream(file) {
  return fs.createReadStream(path.join(__dirname, file))
}
