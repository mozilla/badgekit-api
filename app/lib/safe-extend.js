const xtend = require('xtend');

module.exports = function safeExtend(target, source) {
  const safeKeys = Object.keys(target)
  const safeSource = {}

  Object.keys(source).forEach(function (key) {
    if (safeKeys.indexOf(key) !== -1)
      safeSource[key] = source[key]
  })

  return xtend(target, safeSource)
}
