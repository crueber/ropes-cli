#!/usr/bin/env node

var fs    = require('fs');
var ropes = require('commander');
var Git   = require('git-wrapper');
var ropes_location = 'https://github.com/crueber/mean-coffee-starter.git';

ropes
  // .option('-f, --force', 'force installation')
  .parse(process.argv);

var dir = process.cwd();
if (Array.isArray(ropes.args)) {
  ropes.args = ropes.args.join(' ');
}
var new_repo_dir = dir+'/'+ropes.args;


if (!new_repo_dir && new_repo_dir.length < 1) {
  console.error('New weave name is required.');
  process.exit(1);
}

if (fs.existsSync(new_repo_dir)) {
  console.error(ropes.args + ' directory already exists.')
  process.exit(1);
}

console.log('Pulling ropes repository.')
new Git({'git-dir': dir}).exec('clone', [ropes_location, new_repo_dir], function (err) {
  if (err) {
    console.log(err);
    process.exit(1);
  }
  console.log('Setting up ropes remote.')

  process.chdir(new_repo_dir)
  new Git().exec('remote', ['rename', 'origin', 'ropes'], function (err) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    
    process.exit(0);
  });
  
});



