var streamsql = require('streamsql');

var options = {
  driver: 'mysql',
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
}

var db = streamsql.connect(options);

exports = module.exports = db;
