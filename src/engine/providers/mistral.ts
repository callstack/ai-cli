import { createMistral } from '@ai-sdk/mistral';
import { VercelChatModelAdapter } from '@callstack/byorg-core';
import type { Provider } from './provider.js';

const Mistral: Provider = {
  label: 'Mistral',
  name: 'mistral',
  apiKeyUrl: 'https://console.mistral.ai/api-keys/',

  // Mistral models: https://docs.mistral.ai/platform/endpoints/
  defaultModel: 'mistral-large-latest',

  // Price per 1M tokens [input, output].
  // Source: https://docs.mistral.ai/platform/pricing/
  modelPricing: {
    // Premiere models
    'mistral-large-latest': { inputTokensCost: 2, outputTokensCost: 6 },
    'mistral-large-2411': { inputTokensCost: 2, outputTokensCost: 6 },
    'pixtral-large-latest': { inputTokensCost: 2, outputTokensCost: 6 },
    'pixtral-large-2411': { inputTokensCost: 2, outputTokensCost: 6 },
    'mistral-small-latest': { inputTokensCost: 0.2, outputTokensCost: 0.6 },
    'mistral-small-2409': { inputTokensCost: 0.2, outputTokensCost: 0.6 },
    'codestral-latest': { inputTokensCost: 0.25, outputTokensCost: 0.25 },
    'codestral-2405': { inputTokensCost: 0.2, outputTokensCost: 0.6 },
    'ministral-8b-latest': { inputTokensCost: 0.1, outputTokensCost: 0.1 },
    'ministral-8b-2410': { inputTokensCost: 0.1, outputTokensCost: 0.1 },
    'ministral-3b-latest': { inputTokensCost: 0.04, outputTokensCost: 0.04 },
    'ministral-3b-2410': { inputTokensCost: 0.04, outputTokensCost: 0.04 },

    // Free models
    'open-mistral-nemo': { inputTokensCost: 0.15, outputTokensCost: 0.15 },
    'open-mistral-nemo-2407': { inputTokensCost: 0.15, outputTokensCost: 0.15 },
    'mistral-medium-latest': { inputTokensCost: 2.7, outputTokensCost: 8.1 },
    'mistral-medium-2312': { inputTokensCost: 2.7, outputTokensCost: 8.1 },
  },

  modelAliases: {
    large: 'mistral-large-latest',
    small: 'mistral-small-latest',
    codestral: 'codestral-latest',
  },

  getChatModel(config) {
    const client = createMistral({ apiKey: config.apiKey });
    return new VercelChatModelAdapter({
      languageModel: client.languageModel(config.model),
    });
  },
};

export default Mistral;
