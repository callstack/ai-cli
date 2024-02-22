#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { command as prompt } from './commands/prompt';
import { command as init } from './commands/init';

void yargs(hideBin(process.argv)).command(init).command(prompt).help().demandCommand(1).parse();
