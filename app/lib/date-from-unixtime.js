function dateFromUnixtime(time, fallback) {
  fallback = fallback || null
  if (timeIsMilliseconds(time))
    return new Date(parseInt(time, 10))
  const date = new Date(parseInt(time, 10) * 1000)
  if (!dateIsValid(date))
    return fallback
  return date
}
function timeIsMilliseconds(time) {
  return (''+time).length === 13
}
function dateIsValid(date) {
  return (''+date) !== 'Invalid Date'
}

module.exports = dateFromUnixtime
