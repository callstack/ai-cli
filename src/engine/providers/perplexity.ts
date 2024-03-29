import OpenAI from 'openai';
import { type Message, type ModelResponseUpdate } from '../inference.js';
import { type ProviderConfig } from './config.js';
import type { Provider } from './provider.js';
import { getChatCompletion, getChatCompletionStream } from './utils/open-ai-api.js';

const Perplexity: Provider = {
  label: 'Perplexity',
  name: 'perplexity',
  apiKeyUrl: 'https://perplexity.ai/settings/api',

  // Perplexity models: https://docs.perplexity.ai/docs/model-cards
  defaultModel: 'sonar-medium-chat',

  // Price per 1k tokens [input, output].
  // Source: https://docs.perplexity.ai/docs/model-cards
  // Source: https://docs.perplexity.ai/docs/pricing
  modelPricing: {
    'sonar-small-chat': { inputTokensCost: 0.2 / 1000, outputTokensCost: 0.2 / 1000 },
    'sonar-medium-chat': { inputTokensCost: 0.6 / 1000, outputTokensCost: 0.6 / 1000 },
    'sonar-small-online': {
      inputTokensCost: 0.2 / 1000,
      outputTokensCost: 0.2 / 1000,
      requestsCost: 5 / 1000,
    },
    'sonar-medium-online': {
      inputTokensCost: 0.6 / 1000,
      outputTokensCost: 0.6 / 1000,
      requestsCost: 5 / 1000,
    },
    'codellama-70b-instruct': { inputTokensCost: 1 / 1000, outputTokensCost: 1 / 1000 },
    'mistral-7b-instruct': { inputTokensCost: 0.2 / 1000, outputTokensCost: 0.2 / 1000 },
    'mixtral-8x7b-instruct': { inputTokensCost: 0.6 / 1000, outputTokensCost: 0.6 / 1000 },
  },

  modelAliases: {
    small: 'sonar-small-chat',
    medium: 'sonar-medium-chat',
    online: 'sonar-medium-online',
    codellama: 'codellama-70b-instruct',
    mistral: 'mistral-7b-instruct',
    mixtral: 'mixtral-8x7b-instruct',
  },

  skipSystemPrompt: ['sonar-small-online', 'sonar-medium-online'],

  getChatCompletion: async (config: ProviderConfig, messages: Message[]) => {
    const api = new OpenAI({
      apiKey: config.apiKey,
      baseURL: 'https://api.perplexity.ai',
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
      baseURL: 'https://api.perplexity.ai',
    });

    return await getChatCompletionStream(api, config, messages, onResponseUpdate);
  },
};

export default Perplexity;
