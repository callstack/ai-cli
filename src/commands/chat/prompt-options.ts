import type { Options } from 'yargs';
import { providerOptions } from './providers.js';

export interface PromptOptions {
  /** AI inference provider to be used */
  provider?: string;
  /** AI model to be used */
  model?: string;
  /** Add file to conversation */
  file?: string;
  /** Add website to the conversation */
  url?: string;
  /** Creative response style */
  creative?: boolean;
  /** Precise response style */
  precise?: boolean;
  /** Show verbose-level logs. */
  verbose?: boolean;
  /** Disable streaming in responses */
  stream?: boolean;
}

export const promptOptions: Record<keyof PromptOptions, Options> = {
  'provider': {
    alias: 'p',
    type: 'string',
    describe: 'AI provider to be used',
    choices: providerOptions,
  },
  'model': {
    alias: 'm',
    type: 'string',
    describe: 'AI model to be used',
  },
  'file': {
    type: 'string',
    describe: 'Add given file to conversation context',
  },
  'url': {
    type: 'string',
    describe: 'Add given website to conversation context',
  },
  'creative': {
    type: 'boolean',
    describe: 'Enable more creative responses',
    conflicts: 'precise',
  },
  'precise': {
    type: 'boolean',
    describe: 'Enable more deterministic responses',
    conflicts: 'creative',
  },
  'stream': {
    type: 'boolean',
    describe: 'Enable streaming in responses',
    hidden: true,
  },
  // @ts-expect-error: yargs workaround. See: https://github.com/yargs/yargs/issues/1116#issuecomment-568297110
  'no-stream': {
    type: 'boolean',
    describe: 'Disable streaming in responses',
  },
  'verbose': {
    alias: 'V',
    type: 'boolean',
    describe: 'Enable verbose output',
  },
};
