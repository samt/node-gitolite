# gitolite [![Build Status](https://secure.travis-ci.org/samt/node-gitolite.png)](http://travis-ci.org/samt/node-gitolite)

This is a Work-in-progress.

Node.js interface to a gitolite backend system, inspired by the ruby gem [gitolite](https://github.com/wingrunr21/gitolite)

This works by maintaining interal data structures to represent the gitoltie
admin repository. It does not require you to relinquish external control over
the repository as it will rebuild the data structures based upon the current
state of the repository, the configuration files, and the user keys.

## Features

* Creation and management of Repositories, Users, Keys, and Groups
* Fine control over permissions
* Manage repo-level configuration
* Custom commit messages to admin repo

## Requirements

* Working [gitolite](http://gitolite.com/) installation
* Node version 0.4.1 or newer

## Installation

    npm install gitolite

## Usage

### Get the admin repo object

```javascript
var gitolite = require('gitolite');
gitolite('/path/to/gitolite/repo', function (err, admin) {
  if (err) throw err;
  // manage here
});

// Dump internal data structures and reload the repo
// This will call `git fetch origin master && git merge --no-commit origin/master`
admin.reload(function (err, admin) {
  if (err) throw err;
  // manage here
});
```

### User/Key management

```javascript
// Basic user addition with keys
var bobsLaptopSSHkey = 'ssh-rsa AAAAB3Nz...cPel5ufw== Bob@TAHOE';
var bobsDesktopSSHkey = 'ssh-rsa AAS1i5aV...Fg90SKJ4== Bob@NATOMA'
var bobsSSHkey = 'ssh-rsa AAAA53bd...uV36sBsm== Bob@SHASTA';

admin.addUser('bob');
var bob = admin.users['bob'];
bob.addKey('laptop', bobsLaptopSSHkey);   // creates 'keydir/laptop/bob.pub'
bob.addKey('desktop', bobsDesktopSSHkey);
bob.removeKey('laptop');

// Fluent interface
var alicesMacbookSSHkey = 'ssh-rsa AAAA7b4p...5iK2kFSD== Alice@OAKLAND';
var alice = admin.addUser('alice');
alice.addKey('macbook', alicesMacbookSSHkey) // creates keydir/macbook/alice.pub
  .addKey('ubuntu', alicesUbuntuSSHkey)      // creates keydir/ubuntu/alice.pub
  .addKey('ubuntulaptop', alicesUbuntuLaptopSSHkey);

// View all keys a given user has
for (var label in alice.keys)
  console.log(label + ' => ' + alice.keys[label]); // macbook => ssh-rsa AAAA7b4p...5iK2kFSD== Alice@OAKLAND;

// Delete user
admin.removeUser('alice');

// Please note that users who are created but who are not given SSH keys
// will NOT be added to the admin repository. This is a limitation of
// gitolite itself.
var carol = admin.addUser('carol');
admin.commit(function (err, admin) {
  admin.users['carol'] // does not exist
});
```

### Group management

```javascript
admin.addGroup('@admins', [ 'alice', 'bob' ]);
var adminGroup = admin.groups['@admins'];
adminGroup.add('dave');
adminGroup.remove('bob');
console.log(adminGroup.users.join(', ')); // alice, dave

// get group object from 'addGroup()'
var devs = admin.addGroup('@devs', [ 'ryan', 'sally', 'thomas' ]);
console.log(devs.users.join(', ')); // alice, dave
```

### Repo management

```javascript
var fooRepo = admin.addRepo('foo');

// Delete the repo
admin.removeRepo('bar');
```

### User/Group permissions

```javascript
var fooRepo = admin.repos['foo'];
fooRepo.addPermission('@admins', 'RW+');
fooRepo.addPermission('john', 'RW+');
fooRepo.addPermission('john', 'R', 'development');
fooRepo.addPermission('jane', '-');

// removes permission, DOES NOT deny access
fooRepo.removePermission('jane'); // partial match of line
```

### Repo configuration

```javascript
var fooRepo = admin.repos['foo'];
fooRepo.addConfig('hook.foo', './runfoobar.sh');
fooRepo.removeConfig('hook.bar');
var hookFoobarValue = fooRepo.configs['hook.foo'];

// commit changes to repo and push
admin.commit(function (err, admin) {
  if (err) throw err;
  console.log('admin repo updated');
});
```

## License

The MIT License (MIT)

Copyright (c) 2014 Sam Thompson <contact@samt.us>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
