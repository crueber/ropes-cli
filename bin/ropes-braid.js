#!/usr/bin/env node

var fs    = require('fs');
var fse   = require('fs-extra');
var async = require('async');
var ropes = require('commander');
var Git   = require('git-wrapper');

ropes
  // .option('-f, --force', 'force installation')
  .parse(process.argv);

var ropes_location = 'https://github.com/crueber/mean-coffee-starter.git';
var dir = process.cwd();
var braid_dir = dir+'/'+ropes.args[0];

var logAndExit = function (message, code) {
  console.error(message);
  process.exit(code || 1);
}

if (!ropes.args[0] || ropes.args[0].length < 1)
  logAndExit('New application name is required.');
else
  console.log('Creating new application ' + ropes.args[0] + '.');

console.log('Initializing git repository for '+ropes.args[0]+'.');    
var git = new Git();

async.waterfall([
  function (callback) { 
    fs.exists(braid_dir, function (exists) {
      if (exists) { return callback(braid_dir + 'already exists.'); }
      fs.mkdir(braid_dir, callback); 
    });
  },
  function (callback) { 
    process.chdir(braid_dir);
    git.exec('init', callback); 
  },
  function (result, callback) { 
    fs.writeFile('README.md', 'Readme', { encoding: 'utf8' }, callback);  
  },
  function (callback) { 
    git.exec('add', ['*'], callback); 
  },
  function (result, callback) { 
    git.exec('commit', {m: true}, ['"Initial braid."'], callback);
  },
  function (result, callback) { 
    if (ropes.args[1]) {
      console.log('Pulling specified weave at '+ ropes.args[1]);
      git.exec('subtree', { prefix: 'framework', squash: true }, [ 'add', ropes.args[1], 'master' ], callback); 
    } else {
      console.log('Pulling down the standard ropes weave.');
      git.exec('subtree', { prefix: 'framework', squash: true }, [ 'add', ropes_location, 'master' ], callback); 
    }
  },
  function (result, callback) { 
    console.log('Setting up the braid.')
    fse.copy(braid_dir+'/framework/template', '.', callback); 
  },
  function (callback) { 
    fse.copy(braid_dir+'/framework/package.json', braid_dir+'/package.json', callback); 
  }
], function (err) { 
  if (err) {
    if (process.cwd() == braid_dir) process.chdir('..');
    fse.removeSync(braid_dir);
    console.error(err);
    logAndExit('Unable to create new braid for '+ ropes.args[0] + '.');
  } else {
    console.log('Successfully created ' + ropes.args[0] +'.');
  }
  
  process.exit(0);
});
