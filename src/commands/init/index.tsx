import type { CommandModule } from 'yargs';
import * as React from 'react';
import { render } from 'ink';
import { ThemeProvider } from '@inkjs/ui';
import { inkTheme } from '../../theme/ink-theme.js';
import { checkIfConfigExists } from '../../config-file.js';
import * as output from '../../output.js';
import { InitUi } from './ui/InitUi.js';

export const command: CommandModule<{}> = {
  command: ['init'],
  describe: 'Basic configuration of AI CLI.',
  handler: () => run(),
};

export function run() {
  try {
    const hasConfig = checkIfConfigExists();
    render(
      <ThemeProvider theme={inkTheme}>
        <InitUi hasConfig={hasConfig} />
      </ThemeProvider>,
    );
  } catch (error) {
    output.clearLine();
    output.outputError(error);
    process.exit(1);
  }
}
