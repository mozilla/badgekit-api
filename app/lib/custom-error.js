module.exports = function createErrorObject(name) {
  function CustomError() {
    this.name = name;
    Error.apply(this, this.arguments)
  }
  CustomError.prototype = Object.create(Error.prototype);
  return CustomError;
}
