module.exports = function unixtimeFromDate(date, fallback) {
  if (isNumber(date) && isSeconds(date))
    return date
  return millisecondsToSeconds(date) || fallback
}

function isNumber(thing) {
  return typeof thing === 'number' && !isNaN(thing)
}
function isSeconds(time) {
  return (''+time).length === 10
}
function millisecondsToSeconds(date) {
  // cast to a number, divide by a thousand to get seconds, XOR with 0 to
  // convert to integer (quick method of flooring)
  return +date/1000|0
}
