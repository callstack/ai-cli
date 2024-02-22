#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { command as prompt } from './commands/prompt';
import { command as init } from './commands/init';

void yargs(hideBin(process.argv))
  .command(prompt)
  .command(init)
  .help()
  .demandCommand(1)
  .recommendCommands()
  .parse();
