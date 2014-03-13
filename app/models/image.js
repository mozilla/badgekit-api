const db = require('../lib/db');
const makeValidator = require('../lib/make-validator')

const Images = db.table('images', {
  fields: [
    'id',
    'slug',
    'url',
    'mimetype',
    'data'
  ],
  methods: {
    toUrl: function toUrl () {
      if (this.url)
        return this.url.toString('ascii');

      if (!this.slug)
        return null;

      return '/images/' + this.slug.toString('ascii');
    }
  },
});

Images.validateRow = makeValidator({
  id: function (id) {
    if (typeof id == 'undefined') return;
    this.check(id).isInt();
  },
  slug: function (slug) {
    this.check(slug).len(1, 255);
  },
  url: function (url) {
    if (typeof url == 'undefined') return;
    this.check(url).isUrl();
  },
  mimetype: function (type) {
    if (typeof type == 'undefined') return;
    // Do we need to check this against an actual list somewhere?
    this.check(type).is(/^[a-z]+\/\w+([-.]\w+)*(\+\w+)?$/i);
  }
});

exports = module.exports = Images;
