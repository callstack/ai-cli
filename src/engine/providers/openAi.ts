import OpenAI from 'openai';
import { type Message, type ModelResponseUpdate } from '../inference.js';
import { type ProviderConfig } from './config.js';
import type { Provider } from './provider.js';
import { getChatCompletion, getChatCompletionStream } from './utils/open-ai-api.js';

const OpenAi: Provider = {
  label: 'OpenAI',
  name: 'openAi',
  apiKeyUrl: 'https://platform.openai.com/api-keys',

  // OpenAI models: https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
  defaultModel: 'gpt-4-turbo-preview',

  // Price per 1k tokens [input, output].
  // Source: https://openai.com/pricing
  modelPricing: {
    'gpt-4-turbo-preview': { inputTokensCost: 0.01, outputTokensCost: 0.03 },
    'gpt-4-0125-preview': { inputTokensCost: 0.01, outputTokensCost: 0.03 },
    'gpt-4-1106-preview': { inputTokensCost: 0.01, outputTokensCost: 0.03 },
    'gpt-4': { inputTokensCost: 0.03, outputTokensCost: 0.06 },
    'gpt-4-0613': { inputTokensCost: 0.03, outputTokensCost: 0.06 },
    'gpt-4-32k': { inputTokensCost: 0.06, outputTokensCost: 0.12 },
    'gpt-4-32k-0613': { inputTokensCost: 0.06, outputTokensCost: 0.12 },
    'gpt-3.5-turbo': { inputTokensCost: 0.0005, outputTokensCost: 0.0015 },
    'gpt-3.5-turbo-0125': { inputTokensCost: 0.0005, outputTokensCost: 0.0015 },
  },

  modelAliases: {
    'gpt-4-turbo': 'gpt-4-turbo-preview',
    'gpt-3.5': 'gpt-3.5-turbo',
  },

  getChatCompletion: async (config: ProviderConfig, messages: Message[]) => {
    const api = new OpenAI({
      apiKey: config.apiKey,
    });

    return await getChatCompletion(api, config, messages);
  },

  getChatCompletionStream: async function (
    config: ProviderConfig,
    messages: Message[],
    onResponseUpdate: (update: ModelResponseUpdate) => void,
  ) {
    const api = new OpenAI({
      apiKey: config.apiKey,
    });

    return await getChatCompletionStream(api, config, messages, onResponseUpdate);
  },
};

export default OpenAi;
