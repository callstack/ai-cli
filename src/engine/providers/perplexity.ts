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
  defaultModel: 'llama-3-sonar-large-32k-chat',

  // Price per 1M tokens [input, output], per 1k requests.
  // Source: https://docs.perplexity.ai/docs/model-cards
  // Source: https://docs.perplexity.ai/docs/pricing
  modelPricing: {
    'llama-3-sonar-small-32k-chat': { inputTokensCost: 0.2, outputTokensCost: 0.2 },
    'llama-3-sonar-small-32k-online': {
      inputTokensCost: 0.2,
      outputTokensCost: 0.2,
      requestsCost: 5,
    },
    'llama-3-sonar-large-32k-chat': { inputTokensCost: 0.6, outputTokensCost: 0.6 },
    'llama-3-sonar-large-32k-online': {
      inputTokensCost: 0.6,
      outputTokensCost: 0.6,
      requestsCost: 5,
    },
    'llama-3-8b-instruct': { inputTokensCost: 0.2, outputTokensCost: 0.2 },
    'llama-3-70b-instruct': { inputTokensCost: 1, outputTokensCost: 1 },
    'mixtral-8x7b-instruct': { inputTokensCost: 0.6, outputTokensCost: 0.6 },
  },

  modelAliases: {
    'small': 'llama-3-sonar-small-32k-chat',
    'large': 'llama-3-sonar-large-32k-chat',
    'online': 'llama-3-sonar-large-32k-online',
    'llama-3': 'llama-3-70b-instruct',
    'mixtral': 'mixtral-8x7b-instruct',
  },

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
