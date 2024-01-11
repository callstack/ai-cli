#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { command as prompt } from './commands/prompt';

void yargs(hideBin(process.argv)).command(prompt).help().demandCommand(1).parse();
