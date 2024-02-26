import type { ConfigFile } from '../config-file';
import type { Message, ModelResponse } from '../inference';
import type { ProviderConfig } from './config';
import openAi from './openAi';
import perplexity from './perplexity';

export const providerNames = ['openAi', 'perplexity'] as const;
export type ProviderName = (typeof providerNames)[number];

export type Provider = {
  name: ProviderName;
  label: string;
  apiKeyUrl: string;
  getChatCompletion: (config: ProviderConfig, messages: Message[]) => Promise<ModelResponse>;
};

const providers: Record<ProviderName, Provider> = {
  openAi,
  perplexity,
};

const providerOptionMapping: Record<string, Provider> = {
  openai: openAi,
  perplexity: perplexity,
  pplx: perplexity,
};

export const providerOptions = Object.keys(providerOptionMapping);

export function getProvider(providerName: ProviderName): Provider {
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Provider not found: ${providerName}.`);
  }

  return provider;
}

export function resolveProviderFromOption(providerOption: string): Provider {
  const provider = providerOptionMapping[providerOption];
  if (!provider) {
    throw new Error(`Provider not found: ${providerOption}.`);
  }

  return provider;
}

export function getDefaultProvider(config: ConfigFile): Provider {
  const providerNames = Object.keys(config.providers) as ProviderName[];
  const providerName = providerNames ? providerNames[0] : undefined;

  if (!providerName) {
    throw new Error('No providers found in "~/.airc.json" file.');
  }

  return providers[providerName]!;
}
