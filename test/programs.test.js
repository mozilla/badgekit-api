const test = require('tap').test
const app = require('../')
const fs = require('fs')
const path = require('path')
const spawn = require('./spawn')

spawn(app).then(function (api) {

  test('get program list', function (t) {
    api.get('/systems/chicago/issuers/chicago-library/programs?page=1&count=5').then(function (res) {
      t.ok(res.body.programs, 'should have programs')
      t.same(res.body.programs[0].id, 1)
      t.same(res.body.programs[0].slug, 'mit-scratch')
      t.same(res.body._pageData.page, 1, 'page data should indicate page 1')
      t.same(res.body._pageData.count, 5, 'page data should indicate a count of 5')
      t.same(res.body._pageData.total, 1, 'page data should indicate a total of 1')
      t.end()
    }).catch(api.fail(t))
  })

  test('get one program', function (t) {
    const path = '/systems/chicago/issuers/chicago-library/programs/mit-scratch'
    api.get(path).then(function(res){
      t.same(res.body.program, {
        id: 1,
        slug: 'mit-scratch',
        url: 'http://scratch.mit.edu/',
        name: 'MIT Scratch',
        description: 'Create stories, games, and animations. Share with others around the world',
        email: 'admin@scratch.mit.edu',
        imageUrl: 'http://example.org/test.png',
      })
      return api.get('/systems/chicago/issuers/chicago-library/programs/not-a-program')
    }).then(function(res){
      t.same(res.statusCode, 404)
      t.same(res.body.code, 'ResourceNotFound')
      t.end()
    }).catch(api.fail(t))
  })


  test('add new program', function (t) {
    var form = {soAndSoAndSo: 'from wherever wherever'}
    const path = '/systems/chicago/issuers/chicago-library/programs/'
    api.post(path, form).then(function (res) {
      t.same(res.statusCode, 400, 'should have rest error')
      t.same(res.body.code, 'ValidationError', 'should be a validation error')
      return api.post(path, form = {
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
    const path = '/systems/chicago/issuers/chicago-library/programs/test-program'
    api.put(path, form).then(function(res){
      t.same(res.statusCode, 200, 'no error')
      return api.put(path, form = {
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
    const path = '/systems/chicago/issuers/chicago-library/programs/test-program'
    api.del(path).then(function (res) {
      t.same(res.body.status, 'deleted')
      return api.get(path)
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
