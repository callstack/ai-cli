import { createOpenAI } from '@ai-sdk/openai';
import { VercelChatModelAdapter } from '@callstack/byorg-core';
import { type ProviderConfig } from './config.js';
import type { Provider } from './provider.js';

const OpenAi: Provider = {
  label: 'OpenAI',
  name: 'openAi',
  apiKeyUrl: 'https://platform.openai.com/api-keys',

  // OpenAI models: https://platform.openai.com/docs/models
  defaultModel: 'gpt-4o-2024-11-20',

  // Price per 1M tokens [input, output].
  // Source: https://openai.com/api/pricing/
  modelPricing: {
    // 4o
    'gpt-4o': { inputTokensCost: 2.5, outputTokensCost: 10 },
    'gpt-4o-2024-11-20': { inputTokensCost: 2.5, outputTokensCost: 10 },
    'gpt-4o-2024-08-06': { inputTokensCost: 2.5, outputTokensCost: 10 },
    'gpt-4o-2024-05-13': { inputTokensCost: 5, outputTokensCost: 15 },

    // 4o-mini
    'gpt-4o-mini': { inputTokensCost: 0.15, outputTokensCost: 0.6 },
    'gpt-4o-mini-2024-07-18': { inputTokensCost: 0.15, outputTokensCost: 0.6 },

    // o1
    'o1-preview': { inputTokensCost: 15, outputTokensCost: 60 },
    'o1-preview-2024-09-12': { inputTokensCost: 15, outputTokensCost: 60 },

    // o1-mini
    'o1-mini': { inputTokensCost: 3, outputTokensCost: 12 },
    'o1-mini-2024-09-12': { inputTokensCost: 3, outputTokensCost: 12 },

    // Other modes
    'chatgpt-4o-latest': { inputTokensCost: 5, outputTokensCost: 15 },
    'gpt-4-turbo': { inputTokensCost: 10, outputTokensCost: 30 },
    'gpt-4-turbo-2024-04-09': { inputTokensCost: 10, outputTokensCost: 30 },
    'gpt-4': { inputTokensCost: 30, outputTokensCost: 60 },
    'gpt-4-32k': { inputTokensCost: 60, outputTokensCost: 120 },
    'gpt-4-0125-preview': { inputTokensCost: 10, outputTokensCost: 30 },
    'gpt-4-1106-preview': { inputTokensCost: 10, outputTokensCost: 30 },
    'gpt-4-vision-preview': { inputTokensCost: 10, outputTokensCost: 30 },
    'gpt-3.5-turbo-0125': { inputTokensCost: 0.5, outputTokensCost: 1.5 },
    'gpt-3.5-turbo-instruct': { inputTokensCost: 1.5, outputTokensCost: 2.0 },
    'gpt-3.5-turbo-1106': { inputTokensCost: 1, outputTokensCost: 2 },
    'gpt-3.5-turbo-0613': { inputTokensCost: 1.5, outputTokensCost: 2.0 },
    'gpt-3.5-turbo-16k': { inputTokensCost: 3, outputTokensCost: 12 },
  },

  modelAliases: {
    '4o': 'gpt-4o',
    '4o-mini': 'gpt-4o-mini',
    'o1': 'o1-preview',
    'o1-mini': 'o1-mini',
  },

  getChatModel: (config: ProviderConfig) => {
    const client = createOpenAI({ apiKey: config.apiKey, compatibility: 'strict' });
    return new VercelChatModelAdapter({
      languageModel: client.languageModel(config.model),
    });
  },
};

export default OpenAi;
