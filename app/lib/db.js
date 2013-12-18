var streamsql = require('streamsql');

var db = streamsql.connect({
  driver: 'mysql',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

exports = module.exports = db;
