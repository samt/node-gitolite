/*
 * gitolite
 *
 * (c) 2014 Sam Thompson <contact@samt.us>
 * The MIT License 
 */

var git = require('gift'),
  AdminRepo = require('./lib/adminrepo');

function gitolite(path, cb) {
  var repo = git(path),
    adminRepo = null,
    err = 'E_REPO_NOT_FOUND';

  if (!repo) {
    adminRepo = new AdminRepo(repo);
    err = false;
  }

  cb(err, adminRepo);
}

module.exports = gitolite;
