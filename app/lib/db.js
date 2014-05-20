var streamsql = require('streamsql');
var mysql = require('mysql');

var options = {
  driver: 'mysql',
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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
