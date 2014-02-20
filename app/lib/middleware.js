module.exports = {
  findSystem: findSystem,
}

const log = require('../lib/logger')
const restify = require('restify')
const Systems = require('../models/system')

const http404 = restify.ResourceNotFoundError
const http500 = restify.InternalError

function findSystem(opts) {
  opts = opts || {}
  const param = opts.param || 'systemSlug'
  const key = opts.key || 'system'
  const relationships = typeof opts.relationships !== 'undefined'
    ? opts.relationships
    : true
  return function finder(req, res, next) {
    const slug = req.params[param]
    const query = {slug: slug}
    const opts = {relationships: relationships}
    Systems.getOne(query, opts, function (error, system) {
      if (error) {
        log.error(error)
        return next(new http500('An internal error occured'))
      }
      if (!system) {
        log.warn({code: 'ResourceNotFound', model: 'system', slug: slug})
        return next(new http404('Could not find system `'+slug+'`'))
      }
      req[key] = system
      return next()
    })
  }
}
