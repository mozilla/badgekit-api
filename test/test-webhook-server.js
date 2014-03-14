const Webhooks = require('../app/models/webhook')
const http = require('http')
const Promise = require('bluebird')

module.exports = function makeServer(data) {
  const deferred = Promise.defer()
  const server = http.createServer().listen(0)
  server.on('listening', function () {
    const serverUrl = 'http://127.0.0.1:' + this.address().port
    data.url = serverUrl
    Webhooks.put(data, function (err, webhook) {
      if (err) throw err
      deferred.resolve(server)
    })
  })

  return deferred.promise
}
