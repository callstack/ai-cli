import anthropic from '../../engine/providers/anthropic.js';
import openAi from '../../engine/providers/openAi.js';
import perplexity from '../../engine/providers/perplexity.js';
import { getProvider, type Provider, type ProviderName } from '../../engine/providers/provider.js';
import type { ConfigFile } from '../../config-file.js';

export const providerOptionMapping: Record<string, Provider> = {
  openai: openAi,
  perplexity: perplexity,
  pplx: perplexity,
  anthropic: anthropic,
};

export const providerOptions = Object.keys(providerOptionMapping);

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

  return getProvider(providerName)!;
}
