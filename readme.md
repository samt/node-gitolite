# gitolite [![Build Status](https://secure.travis-ci.org/samt/node-gitolite.png)](http://travis-ci.org/samt/node-gitolite)

Node.js interface to a gitolite backend system, inspired by the ruby gem [gitolite](https://github.com/wingrunr21/gitolite)

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

    var gitolite = require('gitolite');
    var myAdminRepo = gitolite('/path/to/gitolite/repo');
    
    // Dump internal data structures and reload the repo
    myAdminRepo.reload();

### User/Key management

    // Basic user addition with keys
    var bobsLaptopSSHkey = 'ssh-rsa AAAAB3Nz...cPel5ufw== Bob@TAHOE';
    var bobsDesktopSSHkey = 'ssh-rsa AAS1i5aV...Fg90SKJ4== Bob@NATOMA'
    var bobsSSHkey = 'ssh-rsa AAAA53bd...uV36sBsm== Bob@SHASTA';
    
    myAdminRepo.addUser('bob');
    var bob = myAdminRepo.users['bob'];
    bob.addKey('laptop', bobsLaptopSSHkey);   // creates 'keydir/laptop/bob.pub'
    bob.addKey('desktop', bobsDesktopSSHkey);
    bob.addKey(bobsSSHkey); // creates 'keydir/{ SHA1(bobsSSHkey) }/bob.pub'
    bob.removeKey('laptop');
    
    // Load key from file
    bob.addKeyFile('worklaptop', '/path/to/key.pub');
    
    // Fluent interface
    var alicesMacbookSSHkey = 'ssh-rsa AAAA7b4p...5iK2kFSD== Alice@OAKLAND';
    var alice = myAdminRepo.addUser('alice');
    alice.addKey('macbook', alicesMacbookSSHkey) // creates keydir/macbook/alice.pub
      .addKey('ubuntu', alicesUbuntuSSHkey)      // creates keydir/macbook/alice.pub
      .addKey('ubuntulaptop', alicesUbuntuLaptopSSHkey);
    
    // View all keys a given user has
    for (var label in alice.keys) 
      console.log(label + ' => ' + alice.keys[label]); // macbook => ssh-rsa AAAA7b4p...5iK2kFSD== Alice@OAKLAND;
    
    // Delete user
    myAdminRepo.removeUser('alice');

### Group management

    myAdminRepo.addGroup('@admins', [ 'alice', 'bob' ]);
	var adminGroup = myAdminRepo.groups['@admins'];
	adminGroup.add('dave');
	adminGroup.remove('bob');
    console.log(adminGroup.users.join(', ')); // alice, dave
    
    // get group object from 'addGroup()'
    var devs = myAdminRepo.addGroup('@devs', [ 'ryan', 'sally', 'thomas' ]);
    console.log(devs.users.join(', ')); // alice, dave

### Repo management

    var fooRepo = myAdminRepo.addRepo('foo');
    
    // Delete the repo
    myAdminRepo.removeRepo('bar');

### User/Group permissions

    var fooRepo = myAdminRepo.repos['foo'];
    fooRepo.addPermission('@admins', 'RW+');
    fooRepo.addPermission('john', 'RW+');
    fooRepo.addPermission('john', 'R', 'development');
    fooRepo.addPermission('jane', '-');

    // removes permission, DOES NOT deny access
    fooRepo.removePermission('jane'); // partial match of line
    
### Repo configuration 

    var fooRepo = myAdminRepo.repos['foo'];
    fooRepo.addConfig('hook.foo', './runfoobar.sh');
    fooRepo.removeConfig('hook.bar');
    var hookFoobarValue = fooRepo.configs['hook.foo'];
    
    // commit changes to repo and push
    myAdminRepo.commit(function (err) {
      if (err) throw err;
      console.log('admin repo updated');
    });

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
