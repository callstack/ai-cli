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
    'sonar-small-chat': { inputTokensCost: 0.00007, outputTokensCost: 0.00028 },
    'sonar-medium-chat': { inputTokensCost: 0.0006, outputTokensCost: 0.0018 },
    'sonar-small-online': { requestsCost: 0.005, outputTokensCost: 0.00028 },
    'sonar-medium-online': { requestsCost: 0.005, outputTokensCost: 0.0018 },
    'codellama-70b-instruct': { inputTokensCost: 0.0007, outputTokensCost: 0.0028 },
    'mistral-7b-instruct': { inputTokensCost: 0.00007, outputTokensCost: 0.00028 },
    'mixtral-8x7b-instruct': { inputTokensCost: 0.0006, outputTokensCost: 0.0018 },
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
