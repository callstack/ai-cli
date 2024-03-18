import type { CommandModule } from 'yargs';
import * as React from 'react';
import { render } from 'ink';
import { ThemeProvider } from '@inkjs/ui';
import { parseConfigFile } from '../../config-file.js';
import * as output from '../../output.js';
import { inkTheme } from '../../theme/ink-theme.js';
import { initChatState } from './state/init.js';
import { promptOptions, type PromptOptions } from './prompt-options.js';
import { ChatUi } from './ui/ChatUi.js';

export const command: CommandModule<{}, PromptOptions> = {
  command: ['chat', '$0'],
  describe: 'Start a conversation with AI assistant.',
  builder: promptOptions,
  handler: (args) => run(args._.join(' '), args),
};

function run(initialPrompt: string, options: PromptOptions) {
  try {
    const configFile = parseConfigFile();
    initChatState(options, configFile, initialPrompt);
    render(
      <ThemeProvider theme={inkTheme}>
        <ChatUi />
      </ThemeProvider>,
    );
  } catch (error) {
    output.outputError(error);
    process.exit(1);
  }
}
