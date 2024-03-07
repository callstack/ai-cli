import type { CommandModule } from 'yargs';
import React from 'react';
import { render } from 'ink';
import { checkIfConfigExists } from '../../config-file.js';
import * as output from '../../output.js';
import { InitUi } from './init-ui.js';

export const command: CommandModule<{}> = {
  command: ['init'],
  describe: 'Automates basic configuration of AI CLI.',
  handler: () => run(),
};

export function run() {
  try {
    const configExists = checkIfConfigExists();
    render(<InitUi hasConfig={configExists} />);
  } catch (error) {
    output.clearLine();
    output.outputError(error);
    process.exit(1);
  }
}
