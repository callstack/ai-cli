import type { CommandModule } from 'yargs';
import * as React from 'react';
import { render } from 'ink';
import { parseConfigFile } from '../../config-file.js';
import * as output from '../../output.js';
import { initChatState } from './state/init.js';
import { promptOptions, type PromptOptions } from './prompt-options.js';
import { ChatUi } from './ui/ChatUi.js';

export const command: CommandModule<{}, PromptOptions> = {
  command: ['prompt', '$0'],
  describe: '[Default] Ask AI assistant a question or start an interactive conversation.',
  builder: promptOptions,
  handler: (args) => run(args._.join(' '), args),
};

function run(initialPrompt: string, options: PromptOptions) {
  try {
    const configFile = parseConfigFile();
    initChatState(options, configFile, initialPrompt);
    render(<ChatUi />);
  } catch (error) {
    output.clearLine();
    output.outputError(error);
    process.exit(1);
  }
}
