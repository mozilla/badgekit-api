const test = require('tap').test
const app = require('../')
const fs = require('fs')
const path = require('path')
const spawn = require('./spawn')

test('starting', function (t) {
  spawn(app).then(function (apiRequest) {
    const form = {lol: 'hi',}
    apiRequest.post('/test', form).then(function (res) {
      console.dir(res)
    })
  })
})
