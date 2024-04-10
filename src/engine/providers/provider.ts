import type { Message, ModelResponse, ModelResponseUpdate } from '../inference.js';
import type { ProviderConfig } from './config.js';
import openAi from './openAi.js';
import perplexity from './perplexity.js';
import anthropic from './anthropic.js';
import mistral from './mistral.js';

export const providerNames = ['openAi', 'anthropic', 'perplexity', 'mistral'] as const;
export type ProviderName = (typeof providerNames)[number];

export interface Provider {
  name: ProviderName;
  label: string;
  apiKeyUrl: string;

  defaultModel: string;
  modelPricing: Record<string, ModelPricing>;
  modelAliases: Record<string, string>;

  skipSystemPrompt?: string[];

  getChatCompletion: (config: ProviderConfig, messages: Message[]) => Promise<ModelResponse>;
  getChatCompletionStream?: (
    config: ProviderConfig,
    messages: Message[],
    onStreamUpdate: (update: ModelResponseUpdate) => void,
  ) => Promise<ModelResponse>;
}

export interface ModelPricing {
  /** Cost per 1M input tokens */
  inputTokensCost?: number;

  /** Cost per 1M output tokens */
  outputTokensCost?: number;

  /** Cost per 1M requests */
  requestsCost?: number;
}

const providersMap: Record<ProviderName, Provider> = {
  openAi,
  anthropic,
  perplexity,
  mistral,
};

export const providers = Object.values(providersMap);

export function getProvider(providerName: ProviderName): Provider {
  const provider = providersMap[providerName];
  if (!provider) {
    throw new Error(`Provider not found: ${providerName}.`);
  }

  return provider;
}
