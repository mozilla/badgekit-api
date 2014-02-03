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
    var form = {nonsense:'oajsldkf'}
    api.post('/issuers', form).then(function (res) {
      t.same(res.statusCode, 400, 'should get 400')
      t.same(res.body.code, 'ValidationError', 'should have right error code')
      return api.post('/issuers', form = {
        slug: 'test-issuer',
        name: 'Test Issuer',
        url: 'https://example.org/issuer',
        email: 'guy@example.org',
        image: stream('test-image.png'),
      })
    }).then(function (res) {
      t.same(res.body.status, 'created', 'should be created')
      t.same(res.body.issuer.name, form.name)
      t.ok(res.body.issuer.imageUrl.match(/\/images\/.+/), 'should have right image url')
      form.image = stream('test-image.png')
      return api.post('/issuers', form)
    }).then(function (res) {
      t.same(res.statusCode, 409, 'should get 409 conflict')
      t.end()
    }).catch(api.fail(t))
  })

  test('update issuer', function (t) {
    var form = {nonsense:'oajsldkf'}
    api.put('/issuers/test-issuer', form).then(function (res) {
      t.same(res.statusCode, 200, 'should not error')
      return api.put('/issuers/test-issuer', form = {
        name: 'Test Issuer, okay?!',
        email: 'other-guy@example.org',
      })
    }).then(function (res) {
      t.same(res.body.status, 'updated', 'should be updated')
      t.same(res.body.issuer.name, form.name)
      t.same(res.body.issuer.email, form.email)
      t.ok(res.body.issuer.imageUrl.match(/\/images\/.+/), 'should have right image url')
      t.end()
    }).catch(api.fail(t))
  })

  test('delete issuer', function (t) {
    api.del('/issuers/test-issuer').then(function(res){
      t.same(res.body.status, 'deleted')
      return api.del('/issuers/test-issuer')
    }).then(function(res){
      t.same(res.statusCode, 404)
      t.same(res.body.code, 'ResourceNotFound')
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
