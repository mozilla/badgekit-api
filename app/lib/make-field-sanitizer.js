module.exports = function makeFieldSanitizer(Model) {
  const fields = Model.fields
  function fieldSanitizer(obj) {
    return fields.reduce(function (safeObj, key) {
      if (obj[key]) safeObj[key] = obj[key]
      return safeObj
    }, {})
  }
  fieldSanitizer.fields = fields
  return fieldSanitizer
}
