const db = require('../lib/db');
const makeValidator = require('../lib/make-validator');

const Evidence = db.table('evidence', {
  fields: [
    'id',
    'applicationId',
    'url',
    'mediaType',
    'reflection'
  ],
});

Evidence.validateRow = makeValidator({
  id: function (id) {
    if (typeof id == 'undefined' || id === null) return;
    this.check(id).isInt();
  },
  applicationId: function (id) {
    this.check(id).isInt();
  },
  url: function (url) {
    if (typeof url == 'undefined' || url === null) return;
    this.check(url).isUrl();
  },
  mediaType: function (type) {
    if (typeof type == 'undefined' || type === null) return;
    this.check(type).isIn(['image','link']);
  }
});

exports = module.exports = Evidence;