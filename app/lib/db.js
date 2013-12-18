var config = require('./config');
var streamsql = require('streamsql');

var db = streamsql.connect(config.find('db'));

exports = module.exports = db;
