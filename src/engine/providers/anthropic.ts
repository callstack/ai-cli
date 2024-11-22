import { createAnthropic } from '@ai-sdk/anthropic';
import { VercelChatModelAdapter } from '@callstack/byorg-core';
import { type ProviderConfig } from './config.js';
import type { Provider } from './provider.js';

const Anthropic: Provider = {
  label: 'Anthropic',
  name: 'anthropic',
  apiKeyUrl: 'https://console.anthropic.com/settings/keys',

  // Anthropic models: https://docs.anthropic.com/claude/docs/models-overview
  defaultModel: 'claude-3-5-sonnet-latest',

  // Price per 1M tokens [input, output].
  // Source: https://www.anthropic.com/api
  modelPricing: {
    // Claude 3.5
    'claude-3-5-sonnet-latest': { inputTokensCost: 3, outputTokensCost: 15 },
    'claude-3-5-sonnet-20241022': { inputTokensCost: 3, outputTokensCost: 15 },
    'claude-3-5-haiku-latest': { inputTokensCost: 1, outputTokensCost: 5 },
    'claude-3-5-haiku-20241022': { inputTokensCost: 1, outputTokensCost: 5 },

    // Claud 3
    'claude-3-opus-latest': { inputTokensCost: 15.0, outputTokensCost: 75.0 },
    'claude-3-opus-20240229': { inputTokensCost: 15.0, outputTokensCost: 75.0 },
    'claude-3-sonnet-20240229': { inputTokensCost: 3.0, outputTokensCost: 15.0 },
    'claude-3-haiku-20240307': { inputTokensCost: 0.25, outputTokensCost: 1.25 },

    // Legacy models
    'claude-2.1': { inputTokensCost: 8.0, outputTokensCost: 24.0 },
    'claude-2.0': { inputTokensCost: 8.0, outputTokensCost: 24.0 },
    'claude-instant-1.2': { inputTokensCost: 0.8, outputTokensCost: 2.4 },
  },

  modelAliases: {
    haiku: 'claude-3-5-haiku-latest',
    sonnet: 'claude-3-5-sonnet-latest',
    opus: 'claude-3-opus-20240229',
  },

  getChatModel: (config: ProviderConfig) => {
    const client = createAnthropic({ apiKey: config.apiKey });
    return new VercelChatModelAdapter({
      languageModel: client.languageModel(config.model),
    });
  },
};

export default Anthropic;
