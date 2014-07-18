const util = require('util')

module.exports.makeBadgeClassUrl =  function makeBadgeClassUrl(badge) {
  const badgeSlug = badge.slug
  const programSlug = badge.program && badge.program.slug
  const issuerSlug = badge.issuer && badge.issuer.slug
  const systemSlug = badge.system && badge.system.slug

  if (programSlug && issuerSlug && systemSlug)
    return util.format('/public/systems/%s/issuers/%s/programs/%s/badges/%s',
                       systemSlug, issuerSlug, programSlug, badgeSlug)

  if (!programSlug && issuerSlug && systemSlug)
    return util.format('/public/systems/%s/issuers/%s/badges/%s',
                       systemSlug, issuerSlug, badgeSlug)

  if (!programSlug && !issuerSlug && systemSlug)
    return util.format('/public/systems/%s/badges/%s',
                       systemSlug, badgeSlug)

  log.error({badge: badge}, 'badge has incomplete parantage – sending broken assertion')
  return '/public'
}
