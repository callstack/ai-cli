import openAi from '../../engine/providers/open-ai.js';
import anthropic from '../../engine/providers/anthropic.js';
import perplexity from '../../engine/providers/perplexity.js';
import mistral from '../../engine/providers/mistral.js';
import {
  getProvider,
  type ProviderInfo,
  type ProviderName,
} from '../../engine/providers/provider-info.js';
import type { ConfigFile } from '../../config-file.js';

export const providerOptionMapping: Record<string, ProviderInfo> = {
  openai: openAi,
  anthropic,
  anth: anthropic,
  perplexity,
  pplx: perplexity,
  mistral,
};

export const providerOptions = Object.keys(providerOptionMapping);

export function resolveProviderInfoFromOption(providerOption: string): ProviderInfo {
  const provider = providerOptionMapping[providerOption];
  if (!provider) {
    throw new Error(`Provider not found: ${providerOption}.`);
  }

  return provider;
}

export function getDefaultProviderInfo(config: ConfigFile): ProviderInfo {
  const providerNames = Object.keys(config.providers) as ProviderName[];
  const providerName = providerNames ? providerNames[0] : undefined;

  if (!providerName) {
    throw new Error('No providers found in "~/.airc.json" file.');
  }

  return getProvider(providerName)!;
}
