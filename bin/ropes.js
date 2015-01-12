#!/usr/bin/env node

var ropes = require('commander');

ropes
  .version('0.0.1')
  .command('weave [app-name]', 'pulls in ropes for you to alter')
  .command('braid [name] [weave-location]', 'creates a new app based on a particular weave')
  .parse(process.argv);
