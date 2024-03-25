import type { Message, ModelResponse, ModelResponseStream } from '../inference.js';
import type { ProviderConfig } from './config.js';
import openAi from './openAi.js';
import perplexity from './perplexity.js';

export const providerNames = ['openAi', 'perplexity'] as const;
export type ProviderName = (typeof providerNames)[number];

export interface Provider {
  name: ProviderName;
  label: string;
  apiKeyUrl: string;
  pricing: Record<string, ModelPricing>;

  getChatCompletion: (config: ProviderConfig, messages: Message[]) => Promise<ModelResponse>;
  getChatCompletionStream?: (
    config: ProviderConfig,
    messages: Message[],
  ) => AsyncGenerator<ModelResponseStream>;
}

export interface ModelPricing {
  /** Cost per 1k input tokens */
  inputTokensCost?: number;

  /** Cost per 1k output tokens */
  outputTokensCost?: number;

  /** Cost per 1k requests */
  requestsCost?: number;
}

const providersMap: Record<ProviderName, Provider> = {
  openAi,
  perplexity,
};

export const providers = Object.values(providersMap);

export function getProvider(providerName: ProviderName): Provider {
  const provider = providersMap[providerName];
  if (!provider) {
    throw new Error(`Provider not found: ${providerName}.`);
  }

  return provider;
}
