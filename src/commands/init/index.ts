import type { CommandModule } from 'yargs';
import { init } from './init';

export const command: CommandModule<{}> = {
  command: ['$0', 'init'],
  describe: 'initialize the AI Cli',
  handler: () => init(),
};
