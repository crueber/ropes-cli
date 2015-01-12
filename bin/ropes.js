#!/usr/bin/env node

'use strict';

var ropes = require('commander');

ropes
  .version('0.1.0')
  .command('weave [app-name]', 'pulls in ropes for you to alter')
  .command('braid [name] [weave-location]', 'creates a new app based on a particular weave')
  .parse(process.argv);
