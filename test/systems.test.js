const test = require('tap').test
const app = require('../')
const fs = require('fs')
const path = require('path')
const spawn = require('./spawn')

spawn(app).then(function (api) {

  test('get system list', function (t) {
    api.get('/systems').then(function (res) {
      t.ok(res.body.systems, 'should have systems')
      t.same(res.body.systems[0].slug, 'chicago')
      t.end()
    }).catch(api.fail(t))
  })

  test('add new system', function (t) {
    var form = {nonsense:'oajsldkf'}
    api.post('/systems', form).then(function (res) {
      t.same(res.statusCode, 400, 'should get 400')
      t.same(res.body.code, 'ValidationError', 'should have right error code')
      return api.post('/systems', form = {
        slug: 'test-system',
        name: 'Test System',
        url: 'https://example.org/system',
        email: 'guy@example.org',
        image: stream('test-image.png'),
      })
    }).then(function (res) {
      t.same(res.body.status, 'created', 'should be created')
      t.same(res.body.system.name, form.name)
      t.ok(res.body.system.imageUrl.match(/\/images\/.+/), 'should have right image url')
      form.image = stream('test-image.png')
      return api.post('/systems', form)
    }).then(function (res) {
      t.same(res.statusCode, 409, 'should get 409 conflict')
      t.end()
    }).catch(api.fail(t))
  })

  test('update system', function (t) {
    var form = {nonsense:'oajsldkf'}
    api.put('/systems/test-system', form).then(function (res) {
      t.same(res.statusCode, 200, 'should not error')
      return api.put('/systems/test-system', form = {
        name: 'Test System, okay?!',
        email: 'other-guy@example.org',
      })
    }).then(function (res) {
      t.same(res.body.status, 'updated', 'should be updated')
      t.same(res.body.system.name, form.name)
      t.same(res.body.system.email, form.email)
      t.ok(res.body.system.imageUrl.match(/\/images\/.+/), 'should have right image url')
      t.end()
    }).catch(api.fail(t))
  })

  test('delete system', function (t) {
    api.del('/systems/test-system').then(function(res){
      t.same(res.body.status, 'deleted')
      return api.del('/systems/test-system')
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
