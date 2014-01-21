const test = require('tap').test
const app = require('../')
const fs = require('fs')
const path = require('path')
const spawn = require('./spawn')

spawn(app).then(function (api) {

  test('get program list', function (t) {
    api.get('/programs').then(function (res) {
      t.ok(res.programs, 'should have programs')
      t.same(res.programs[0].id, 1)
      t.same(res.programs[0].slug, 'mit-scratch')
      t.end()
    })
  })

  test('add new program', function (t) {
    const form = {
      slug: 'test-program',
      name: 'Test Program',
      url: 'http://example.org/test/',
      email: 'test@example.org',
      description: 'it is a test!',
      image: stream('test-image.png'),
    }

    const createProgram = api.post.bind(api, '/programs', form)
    const getProgram = api.get.bind(api, '/programs/test-program')

    createProgram().then(function (res) {
      t.same(res.status, 'created')
      return api.get('/programs/test-program')
    }).then(function (res) {
      t.same(res.program.name, form.name)
      t.ok(res.program.imageUrl.match(/\/images\/.+/), 'should have right image url')
      t.end()
    })
  })

  test('update program', function (t) {
    const diff = {
      name: 'Test Program, obvi',
      description: 'it is still a test!',
    }
    var originalImageUrl
    api.put('/programs/test-program', diff).then(function (res) {
      t.same(res.status, 'updated')
      return api.get('/programs/test-program')
    }).then(function (res) {
      t.same(res.program.name, diff.name)
      t.same(res.program.description, diff.description)
      t.end()
    })
  })

  test('delete program', function (t) {
    const getProgram = api.get.bind(api, '/programs/test-program')
    api.del('/programs/test-program').then(function (res) {
      t.same(res.status, 'deleted')
      return api.get('/programs/test-program')
    }).then(function (res) {
      t.same(res.error, 'not found')
      t.end()
    })
  })

  test(':cleanup:', function (t) {
    api.done(); t.end()
  })

})

function stream(file) {
  return fs.createReadStream(path.join(__dirname, file))
}
function read(file) {
  return fs.readFileSync(path.join(__dirname, file))
}
