import { createOpenAI } from '@ai-sdk/openai';
import { VercelChatModelAdapter } from '@callstack/byorg-core';
import type { Provider } from './provider.js';

const Perplexity: Provider = {
  label: 'Perplexity',
  name: 'perplexity',
  apiKeyUrl: 'https://perplexity.ai/settings/api',

  // Perplexity models: https://docs.perplexity.ai/docs/model-cards
  defaultModel: 'llama-3.1-sonar-huge-128k-online',

  // Price per 1M tokens [input, output], per 1k requests.
  // Source: https://docs.perplexity.ai/docs/model-cards
  // Source: https://docs.perplexity.ai/docs/pricing
  modelPricing: {
    'llama-3.1-sonar-small-128k-online': {
      inputTokensCost: 0.2,
      outputTokensCost: 0.2,
      requestsCost: 5,
    },
    'llama-3.1-sonar-large-128k-online': {
      inputTokensCost: 1,
      outputTokensCost: 1,
      requestsCost: 5,
    },
    'llama-3.1-sonar-huge-128k-online': {
      inputTokensCost: 5,
      outputTokensCost: 5,
      requestsCost: 5,
    },
    'llama-3.1-sonar-small-128k-chat': { inputTokensCost: 0.2, outputTokensCost: 0.2 },
    'llama-3.1-sonar-large-128k-chat': { inputTokensCost: 1, outputTokensCost: 1 },
    'llama-3.1-8b-instruct': { inputTokensCost: 0.2, outputTokensCost: 0.2 },
    'llama-3.1-70b-instruct': { inputTokensCost: 1, outputTokensCost: 1 },
  },

  modelAliases: {
    small: 'llama-3.1-sonar-small-128k-online',
    large: 'llama-3.1-sonar-large-128k-online',
    huge: 'llama-3.1-sonar-huge-128k-online',
  },

  getChatModel(config) {
    const client = createOpenAI({
      apiKey: config.apiKey,
      baseURL: 'https://api.perplexity.ai/',
    });
    return new VercelChatModelAdapter({
      languageModel: client.languageModel(config.model),
    });
  },
};

export default Perplexity;
