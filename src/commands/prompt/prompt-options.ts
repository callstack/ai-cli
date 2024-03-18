import type { Options } from 'yargs';
import { providerOptions } from './providers.js';

export interface PromptOptions {
  /** AI inference provider to be used */
  provider?: string;
  /** AI model to be used */
  model?: string;
  /** Add file to conversation */
  file?: string;
  /** Creative response style */
  creative?: boolean;
  /** Precise response style */
  precise?: boolean;
  /** Show verbose-level logs. */
  verbose: boolean;
  /** Display colorized output. Default == autodetect */
  color?: boolean;
}

export const promptOptions: Record<keyof PromptOptions, Options> = {
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
  file: {
    type: 'string',
    describe: 'Add given file to conversation context.',
  },
  creative: {
    type: 'boolean',
    describe: 'Enable more creative responses.',
    conflicts: 'precise',
  },
  precise: {
    type: 'boolean',
    describe: 'Enable more deterministic responses.',
    conflicts: 'creative',
  },
  // Note: no need to handle that explicitly, as it's being picked up automatically by Chalk.
  color: {
    type: 'boolean',
    describe:
      'Forces color output (even if stdout is not a terminal). Use --no-color to disable colors.',
  },
  verbose: {
    alias: 'V',
    type: 'boolean',
    default: false,
    describe: 'Verbose output',
  },
};
