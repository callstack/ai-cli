import type { ConfigFile } from '../config-file';
import * as openAi from './openAi';
import * as perplexity from './perplexity';

export const providerNames = ['openAi', 'perplexity'] as const;
export type ProviderName = (typeof providerNames)[number];

export const providers = {
  openAi,
  perplexity,
};

const providerOptionMapping: Record<string, ProviderName> = {
  openai: 'openAi',
  perplexity: 'perplexity',
  pplx: 'perplexity',
};

export const providerOptions = Object.keys(providerOptionMapping);

export function resolveProviderName(option: string | undefined, config: ConfigFile): ProviderName {
  if (option != null) {
    const provider = providerOptionMapping[option];
    if (!provider) {
      throw new Error(`Provider not found: ${option}.`);
    }

    return provider;
  }

  const providers = Object.keys(config.providers) as ProviderName[];
  if (providers.length === 0) {
    throw new Error('No providers found in ~/.airc file.');
  }

  return providers[0]!;
}
