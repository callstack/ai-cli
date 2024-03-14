import type { CommandModule } from 'yargs';
import * as React from 'react';
import { render } from 'ink';
import * as output from '../../output.js';
import { createSession } from './session.js';
import type { PromptOptions } from './types.js';
import { ChatInterface } from './ui/prompt-ui.js';
import { providerOptions } from './providers.js';

export const command: CommandModule<{}, PromptOptions> = {
  command: ['prompt', '$0'],
  describe: '[Default] Ask AI assistant a question or start an interactive conversation.',
  builder: (yargs) =>
    yargs
      .option('interactive', {
        alias: 'i',
        type: 'boolean',
        default: false,
        describe: 'Start an interactive conversation',
      })
      .options('provider', {
        alias: 'p',
        type: 'string',
        describe: 'AI provider to be used',
        choices: providerOptions,
      })
      .options('model', {
        alias: 'm',
        type: 'string',
        describe: 'AI model to be used',
      })
      .option('verbose', {
        alias: 'V',
        type: 'boolean',
        default: false,
        describe: 'Verbose output',
      })
      .option('creative', {
        type: 'boolean',
        describe: 'Response style: creative',
      })
      .option('precise', {
        type: 'boolean',
        describe: 'Response style: precise',
      })
      .option('costs', {
        type: 'boolean',
        describe: 'Display usage costs',
      })
      .option('usage', {
        type: 'boolean',
        describe: 'Display usage usage',
      })
      // Note: no need to handle that explicitly, as it's being picked up automatically by Chalk.
      .option('color', {
        type: 'boolean',
        describe:
          'Forces color output (even if stdout is not a terminal). Use --no-color to disable colors.',
      })
      .option('file', {
        type: 'string',
        describe: 'Add given file to conversation context.',
      }),
  handler: (args) => run(args._.join(' '), args),
};

function run(initialPrompt: string, options: PromptOptions) {
  try {
    const session = createSession(options, initialPrompt);
    render(<ChatInterface session={session} />);
  } catch (error) {
    output.clearLine();
    output.outputError(error);
    process.exit(1);
  }
}
