import OpenAI from 'openai';
import { type Message, type ModelResponseUpdate } from '../inference.js';
import { type ProviderConfig } from './config.js';
import type { Provider } from './provider.js';
import { getChatCompletion, getChatCompletionStream } from './utils/open-ai-api.js';

const OpenAi: Provider = {
  label: 'OpenAI',
  name: 'openAi',
  apiKeyUrl: 'https://platform.openai.com/api-keys',

  // OpenAI models: https://platform.openai.com/docs/models
  defaultModel: 'gpt-4o-2024-08-06',

  // Price per 1M tokens [input, output].
  // Source: https://openai.com/pricing
  modelPricing: {
    'gpt-4o': { inputTokensCost: 5, outputTokensCost: 15 },
    'gpt-4o-2024-08-06': { inputTokensCost: 2.5, outputTokensCost: 10 },
    'gpt-4o-2024-05-13': { inputTokensCost: 5, outputTokensCost: 15 },
    'gpt-4o-mini': { inputTokensCost: 0.15, outputTokensCost: 0.6 },
    'gpt-4o-mini-2024-07-18': { inputTokensCost: 0.15, outputTokensCost: 0.6 },
    'gpt-4-turbo': { inputTokensCost: 10, outputTokensCost: 30 },
    'gpt-4-turbo-2024-04-09': { inputTokensCost: 10, outputTokensCost: 30 },
    'gpt-4': { inputTokensCost: 30, outputTokensCost: 60 },
    'gpt-4-32k': { inputTokensCost: 60, outputTokensCost: 120 },
    'gpt-3.5-turbo': { inputTokensCost: 0.5, outputTokensCost: 1.5 },
    'gpt-3.5-turbo-0125': { inputTokensCost: 0.5, outputTokensCost: 1.5 },
    'gpt-3.5-turbo-instruct': { inputTokensCost: 1.5, outputTokensCost: 2.0 },
  },

  modelAliases: {},

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
