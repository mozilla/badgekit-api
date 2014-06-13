var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db, "CREATE TABLE IF NOT EXISTS `alignments` ("
                     + "  id INT AUTO_INCREMENT PRIMARY KEY, "
                     + "  badgeId INT NOT NULL REFERENCES `badges`(`id`), "
                     + "  name TEXT NOT NULL, "
                     + "  url TEXT NOT NULL, "
                     + "  description TEXT "
                     + ") CHARACTER SET utf8 "
                     + "ENGINE=InnoDB "
                  ),
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.runSql.bind(db, "DROP TABLE IF EXISTS `alignments`"),
  ], callback);
};
