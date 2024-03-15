import type { Options } from 'yargs';
import { providerOptions } from './providers.js';

export interface PromptOptions {
  /** Interactive mode */
  interactive: boolean;
  /** AI inference provider to be used */
  provider?: string;
  /** AI model to be used */
  model?: string;
  /** Show verbose-level logs. */
  verbose: boolean;
  /** Display colorized output. Default == autodetect */
  color?: boolean;
  /** Add file to conversation */
  file?: string;
  /** Creative response style */
  creative?: boolean;
  /** Precise response style */
  precise?: boolean;
}

export const promptOptions: Record<keyof PromptOptions, Options> = {
  interactive: {
    alias: 'i',
    type: 'boolean',
    default: false,
    describe: 'Start an interactive conversation',
  },
  provider: {
    alias: 'p',
    type: 'string',
    describe: 'AI provider to be used',
    choices: providerOptions,
  },
  model: {
    alias: 'm',
    type: 'string',
    describe: 'AI model to be used',
  },
  verbose: {
    alias: 'V',
    type: 'boolean',
    default: false,
    describe: 'Verbose output',
  },
  creative: {
    type: 'boolean',
    describe: 'Response style: creative',
  },
  precise: {
    type: 'boolean',
    describe: 'Response style: precise',
  },

  // Note: no need to handle that explicitly, as it's being picked up automatically by Chalk.
  color: {
    type: 'boolean',
    describe:
      'Forces color output (even if stdout is not a terminal). Use --no-color to disable colors.',
  },
  file: {
    type: 'string',
    describe: 'Add given file to conversation context.',
  },
};
