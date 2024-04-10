#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { command as chat } from './commands/chat/index.js';
import { command as init } from './commands/init/index.js';
import { checkForUpdates } from './update-notifier.js';

checkForUpdates();

void yargs(hideBin(process.argv))
  .command(chat)
  .command(init)
  .help()
  .demandCommand(1)
  .recommendCommands()
  .parse();
