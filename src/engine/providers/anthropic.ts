import { createAnthropic } from '@ai-sdk/anthropic';
import { VercelChatModelAdapter } from '@callstack/byorg-core';
import { type ProviderConfig } from './config.js';
import type { ProviderInfo } from './provider-info.js';

const Anthropic: ProviderInfo = {
  label: 'Anthropic',
  name: 'anthropic',
  apiKeyUrl: 'https://console.anthropic.com/settings/keys',

  // Anthropic models: https://docs.anthropic.com/en/docs/about-claude/models
  defaultModel: 'claude-3-5-sonnet-20240620',

  // Price per 1M tokens [input, output].
  // Source: https://docs.anthropic.com/en/docs/about-claude/models
  modelPricing: {
    // Current models
    'claude-3-5-sonnet-20240620': { inputTokensCost: 3.0, outputTokensCost: 15.0 },
    'claude-3-haiku-20240307': { inputTokensCost: 0.25, outputTokensCost: 1.25 },
    'claude-3-sonnet-20240229': { inputTokensCost: 3.0, outputTokensCost: 15.0 },
    'claude-3-opus-20240229': { inputTokensCost: 15.0, outputTokensCost: 75.0 },

    // Legacy models
    'claude-2.1': { inputTokensCost: 8.0, outputTokensCost: 24.0 },
    'claude-2.0': { inputTokensCost: 8.0, outputTokensCost: 24.0 },
    'claude-instant-1.2': { inputTokensCost: 0.8, outputTokensCost: 2.4 },
  },

  modelAliases: {
    haiku: 'claude-3-haiku-20240307',
    sonnet: 'claude-3-5-sonnet-20240620',
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
