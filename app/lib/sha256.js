const crypto = require('crypto')
module.exports = function sha256(body) {
  return crypto.createHash('sha256').update(body).digest('hex')
}
