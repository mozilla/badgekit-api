const crypto = require('crypto')

module.exports = function hashString (str) {
  return crypto.createHash('md5').update(str).digest('hex');
}