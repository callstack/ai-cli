import type { CommandModule } from 'yargs';
import perplexity from '../../engine/providers/perplexity.js';
import openAi from '../../engine/providers/openAi.js';
import type { Provider } from '../../engine/providers/provider.js';
import { run } from './run.js';
import type { PromptOptions } from './types.js';

export const providerOptionMapping: Record<string, Provider> = {
  openai: openAi,
  perplexity: perplexity,
  pplx: perplexity,
};

export const providerOptions = Object.keys(providerOptionMapping);

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
