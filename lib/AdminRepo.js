var git = require('gift')

var User = require('./User'),
  Group = require('./Group'),
  Repo = require('./Repo');

/*
 * node-gitolite
 * AdminRepo
 * Base class for managing the admin repo
 */

/*
 * Constructor
 * @param String path - Path to repo
 * @param Boolean reload - (optional) Reload from remote
 * @param function callback - callback when everything is done
 *   callback params:
 *   - err: Error object if error, null otherwise
 *   - adminRepo - Instance of the admin repo (this)
 */
function AdminRepo(path, reload, callback) {
  this.adminRepo = null;
  this.users = {};
  this.groups = {};
  this.repos = {};

  if (typeof reload == 'function') {
    callback = reload;
    reload = false;
  }

  this.adminRepo = git(path);

  var fn = !!reload ? this.reload : this.syncData;
  fn(function (err, admrepo) {
    callback(null, admrepo);
  });
}

AdminRepo.prototype.reload = function (callback) {
  var _this = this;
  this.adminRepo.sync(function (err) {

    if (err) {
      return callback(err, null);
    }

    this.syncData(function(err) {
      callback(err || null, _this);
    });
  });
}

AdminRepo.prototype.syncData = function (callback) {
  // @TODO
  callback(null, this);
}

/*
 * commit the changes (and push them to master)
 */
AdminRepo.prototype.commit = function (callback) {
  var _this = this;
  this.adminRepo.add('.', function (err) {

    if (err) {
      return callback(err, _this);
    }

    this.adminRepo.commit('Automated Update', function (err) {
      callback(err || null, _this);
    });
  });
}

/*
 * User Operation: add
 */
AdminRepo.prototype.addUser = function (user) {
  if (user in this.users) {
    return this.users[user];
  }

  return this.users[user] = new User(user);
};

/*
 * User Operation: remove
 */
AdminRepo.prototype.removeUser = function (user) {
  return user in this.users && delete this.users[user];
};

/*
 * Group Operation: add
 */
AdminRepo.prototype.addGroup = function (group) {
  if (group in this.groups) {
    return this.groups[group];
  }

  return this.groups[group] = new Group(group);
};

/*
 * Group Operation: remove
 */
AdminRepo.prototype.removeGroup = function (group) {
  return group in this.groups && delete this.groups[group];
};

/*
 * Repo Operation: add
 */
AdminRepo.prototype.addRepo = function (repo) {
  if (repo in this.repos) {
    return this.repos[repo];
  }

  return this.repos[repo] = new Repo(repo);
};

/*
 * Repo Operation: remove
 */
AdminRepo.prototype.removeRepo = function (repo) {
  return repo in this.repos && delete this.repos[repo];
};
