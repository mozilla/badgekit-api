var streamsql = require('streamsql');
var mysql = require('mysql');
const config = require('./config');

var options = {
  driver: 'mysql',
  host: config( 'DB_HOST'),
  user: config( 'DB_USER'),
  password: config( 'DB_PASSWORD'),
  database: config( 'DB_NAME'),
}

var db = streamsql.connect(options);

db.getDbConfig = function () {
  return options;
}

function handleDisconnect() {
  db.connection = mysql.createConnection(options);
  db.connection.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
    db.query = db.driver.getQueryFn(db.connection);
    db.queryStream = db.driver.getStreamFn(db.connection);
  });

  setErrorHandler();
}

function setErrorHandler() {
  db.connection.on('error', function(err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    }
    else {
      console.error(err);
    }
  });
}

setErrorHandler();

exports = module.exports = db;
