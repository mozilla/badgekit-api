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
      description: 'it is a test!',
      image: stream('test-image.png'),
    }

    api.post('/programs', form).then(function (res) {
      t.same(res.status, 'created')
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
