const test = require('tap').test
const app = require('../')
const fs = require('fs')
const path = require('path')
const spawn = require('./spawn')

spawn(app).then(function (api) {

  test('get issuer list', function (t) {
    api.get('/issuers').then(function (res) {
      t.ok(res.issuers, 'should have issuers')
      t.same(res.issuers[0].slug, 'chicago')
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
