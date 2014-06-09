/*jslint node: true */
/* jshint -W099 */
var dbm = require('db-migrate');

exports.up = function(db, callback) {
  db.runSql("ALTER TABLE `badges` "
          + "  ADD `evidenceType` ENUM('URL', 'Text', 'Photo', 'Video', 'Sound') "
          , callback);
};

exports.down = function(db, callback) {
  db.runSql("ALTER TABLE `badges` "
          + "  DROP COLUMN `evidenceType`"
          , callback);
};
