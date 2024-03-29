import OpenAI from 'openai';
import { type Message, type ModelResponseUpdate } from '../inference.js';
import { type ProviderConfig } from './config.js';
import type { Provider } from './provider.js';
import { getChatCompletion, getChatCompletionStream } from './utils/open-ai-api.js';

const Perplexity: Provider = {
  label: 'Perplexity',
  name: 'perplexity',
  apiKeyUrl: 'https://perplexity.ai/settings/api',

  // Price per 1k tokens [input, output].
  // Source: https://docs.perplexity.ai/docs/model-cards
  // Source: https://docs.perplexity.ai/docs/pricing
  pricing: {
    'sonar-small-chat': { inputTokensCost: 0.0002, outputTokensCost: 0.0002 },
    'sonar-medium-chat': { inputTokensCost: 0.0006, outputTokensCost: 0.0006 },
    'sonar-small-online': {
      inputTokensCost: 0.0002,
      outputTokensCost: 0.0002,
      requestsCost: 0.005,
    },
    'sonar-medium-online': {
      inputTokensCost: 0.0006,
      outputTokensCost: 0.0006,
      requestsCost: 0.005,
    },
    'codellama-70b-instruct': { inputTokensCost: 0.001, outputTokensCost: 0.001 },
    'mistral-7b-instruct': { inputTokensCost: 0.0002, outputTokensCost: 0.0002 },
    'mixtral-8x7b-instruct': { inputTokensCost: 0.0006, outputTokensCost: 0.0006 },
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
