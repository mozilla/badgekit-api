const API = require('../../lib/api.js');

var api = new API();
var sections = ['systems', 'issuers'];

exports = module.exports = sections.reduce(function(api, set) {
  return (api.append(require('./'+set+'.js')));
}, api);
