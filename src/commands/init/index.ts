import type { CommandModule } from 'yargs';
import { init } from './init.js';

export const command: CommandModule<{}> = {
  command: ['init'],
  describe: 'Automates basic configuration of AI CLI.',
  handler: () => init(),
};
