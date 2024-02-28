import type { Message, ModelResponse } from '../inference';
import type { ProviderConfig } from './config';
import openAi from './openAi';
import perplexity from './perplexity';

export const providerNames = ['openAi', 'perplexity'] as const;
export type ProviderName = (typeof providerNames)[number];

export interface Provider {
  name: ProviderName;
  label: string;
  apiKeyUrl: string;
  pricing: Record<string, ModelPricing>;

  getChatCompletion: (config: ProviderConfig, messages: Message[]) => Promise<ModelResponse>;
}

export interface ModelPricing {
  /** Cost per 1k input tokens */
  inputTokensCost?: number;

  /** Cost per 1k output tokens */
  outputTokensCost?: number;

  /** Cost per 1k requests */
  requestsCost?: number;
}

const providers: Record<ProviderName, Provider> = {
  openAi,
  perplexity,
};

export function getProvider(providerName: ProviderName): Provider {
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Provider not found: ${providerName}.`);
  }

  return provider;
}
