module.exports = {
  sha1: sha1,
  sha256: sha256,
  hash: hash,
}

const crypto = require('crypto')

function sha1(body) {
  return hash('sha1', body)
}
function sha256(body) {
  return hash('sha256', body)
}
function hash(alg, body) {
  return crypto.createHash(alg).update(body).digest('hex')
}
