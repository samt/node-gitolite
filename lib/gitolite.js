/*
 * node-gitolite
 *
 * Entry point to the application
 */

var AdminRepo = require('./AdminRepo'),
  git = require('gift');

function gitolite(path, cb) {
  var a = new AdminRepo(path, function (err, arp) {
    cb(err || null, arp);
  });
}

module.exports = gitolite;
