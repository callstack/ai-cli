import type { ConfigFile } from '../config-file';
import type { Message } from '../inference';
import type { ProviderConfig } from './config';
import openAi from './openAi';
import perplexity from './perplexity';

export const providerNames = ['openAi', 'perplexity'] as const;
export type ProviderName = (typeof providerNames)[number];

export type Provider = {
  name: ProviderName;
  label: string;
  apiKeyUrl: string;
  getChatCompletion: (config: ProviderConfig, messages: Message[]) => any;
};

const providers = {
  openAi,
  perplexity,
};

const providerOptionMapping: Record<string, Provider> = {
  openai: openAi,
  perplexity: perplexity,
  pplx: perplexity,
};

export const providerOptions = Object.keys(providerOptionMapping);

export function resolveProvider(option: string | undefined, config?: ConfigFile): Provider {
  if (option != null) {
    const provider = providerOptionMapping[option];
    if (!provider) {
      throw new Error(`Provider not found: ${option}.`);
    }

    return provider;
  }

  if (!config) {
    throw new Error('No config file found.');
  }

  const providerNames = Object.keys(config.providers) as ProviderName[];
  const providerName = providerNames ? providerNames[0] : undefined;

  if (!providerName) {
    throw new Error('No providers found in ~/.airc file.');
  }

  return providers[providerName]!;
}
