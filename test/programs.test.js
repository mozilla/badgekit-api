const test = require('tap').test
const app = require('../')
const fs = require('fs')
const path = require('path')
const spawn = require('./spawn')

spawn(app).then(function (api) {

  test('get program list', function (t) {
    api.get('/programs').then(function (res) {
      t.ok(res.body.programs, 'should have programs')
      t.same(res.body.programs[0].id, 1)
      t.same(res.body.programs[0].slug, 'mit-scratch')
      t.end()
    }).catch(api.fail(t))
  })

  test('get one program', function (t) {
    api.get('/programs/mit-scratch').then(function(res){
      console.dir(res)
      return api.get('/programs/not-a-program')
    }).then(function(res){
      console.dir(res)
      t.end()
    }).catch(api.fail(t))
  })


  test('add new program', function (t) {
    var form = {soAndSoAndSo: 'from wherever wherever'}
    api.post('/programs', form).then(function (res) {
      t.same(res.statusCode, 400, 'should have rest error')
      t.same(res.body.code, 'ValidationError', 'should be a validation error')
      return api.post('/programs', form = {
        slug: 'test-program',
        name: 'Test Program',
        url: 'http://example.org/test/',
        email: 'test@example.org',
        description: 'it is a test!',
        image: stream('test-image.png'),
      })
    }).then(function (res) {
      t.same(res.body.status, 'created')
      t.same(res.body.program.name, form.name)
      t.ok(res.body.program.imageUrl.match(/\/images\/.+/), 'should have right image url')
      t.end()
    }).catch(api.fail(t))
  })

  test('update program', function (t) {
    var form = {soAndSoAndSo: 'from wherever wherever'}
    api.put('/programs/test-program', form).then(function(res){
      t.same(res.statusCode, 200, 'no error')
      return api.put('/programs/test-program', form = {
        name: 'Test Program, obvi',
        description: 'it is still a test!',
      })
    }).then(function (res) {
      t.same(res.body.status, 'updated')
      t.same(res.body.program.name, form.name)
      t.same(res.body.program.description, form.description)
      t.end()
    }).catch(api.fail(t))
  })

  test('delete program', function (t) {
    const getProgram = api.get.bind(api, '/programs/test-program')
    api.del('/programs/test-program').then(function (res) {
      t.same(res.body.status, 'deleted')
      return api.get('/programs/test-program')
    }).then(function (res) {
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
