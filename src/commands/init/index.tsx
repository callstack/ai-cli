import type { CommandModule } from 'yargs';
import React from 'react';
import { render } from 'ink';
import * as output from '../../output.js';
import { checkIfConfigExists } from '../../config-file.js';
import { InitUi } from './init-ui.js';

export const command: CommandModule<{}> = {
  command: ['init'],
  describe: 'Automates basic configuration of AI CLI.',
  handler: () => {
    try {
      const configExists = checkIfConfigExists();
      render(<InitUi configExists={configExists} />);
    } catch (error) {
      output.clearLine();
      output.outputError(error);
      process.exit(1);
    }
  },
};
