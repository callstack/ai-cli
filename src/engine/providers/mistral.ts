import { createMistral } from '@ai-sdk/mistral';
import { VercelChatModelAdapter } from '@callstack/byorg-core';
import type { Provider } from './provider.js';

const Mistral: Provider = {
  label: 'Mistral',
  name: 'mistral',
  apiKeyUrl: 'https://console.mistral.ai/api-keys/',

  // Mistral models: https://docs.mistral.ai/getting-started/models/
  defaultModel: 'mistral-large-latest',

  // Price per 1M tokens [input, output].
  // Source: https://docs.mistral.ai/platform/pricing/
  modelPricing: {
    // Current models
    'open-mistral-nemo': { inputTokensCost: 0.3, outputTokensCost: 0.3 },
    'open-mistral-nemo-2407': { inputTokensCost: 0.3, outputTokensCost: 0.3 },
    'mistral-large-latest': { inputTokensCost: 3, outputTokensCost: 9 },
    'mistral-large-2407': { inputTokensCost: 3, outputTokensCost: 9 },
    'codestral-latest': { inputTokensCost: 1, outputTokensCost: 3 },
    'codestral-2405': { inputTokensCost: 1, outputTokensCost: 3 },

    // Legacy models
    'open-mistral-7b': { inputTokensCost: 0.25, outputTokensCost: 0.25 },
    'open-mixtral-8x7b': { inputTokensCost: 0.7, outputTokensCost: 0.7 },
    'open-mixtral-8x22b': { inputTokensCost: 2, outputTokensCost: 6 },
    'mistral-small-latest': { inputTokensCost: 1, outputTokensCost: 3 },
    'mistral-small-2402': { inputTokensCost: 1, outputTokensCost: 3 },
    'mistral-medium-latest': { inputTokensCost: 2.7, outputTokensCost: 8.1 },
    'mistral-medium-2312': { inputTokensCost: 2.7, outputTokensCost: 8.1 },
  },

  modelAliases: {
    nemo: 'open-mistral-nemo-2407',
    large: 'mistral-large-latest',
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
