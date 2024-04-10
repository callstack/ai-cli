import MistralClient from '@mistralai/mistralai';
import { type Message, type ModelResponseUpdate } from '../inference.js';
import { estimateInputTokens, estimateOutputTokens } from '../tokenizer.js';
import { responseStyles, type ProviderConfig } from './config.js';
import type { Provider } from './provider.js';

const Mistral: Provider = {
  label: 'Mistral',
  name: 'mistral',
  apiKeyUrl: 'https://console.mistral.ai/api-keys/',

  // OpenAI models: https://docs.mistral.ai/platform/endpoints/
  defaultModel: 'open-mixtral-8x7b',

  // Price per 1k tokens [input, output].
  // Source: https://docs.mistral.ai/platform/pricing/
  modelPricing: {
    'open-mistral-7b': { inputTokensCost: 0.25 / 1000, outputTokensCost: 0.25 / 1000 },
    'open-mixtral-8x7b': { inputTokensCost: 0.7 / 1000, outputTokensCost: 0.7 / 1000 },
    'mistral-small-latest': { inputTokensCost: 2 / 1000, outputTokensCost: 6 / 1000 },
    'mistral-medium-latest': { inputTokensCost: 2.7 / 1000, outputTokensCost: 8.1 / 1000 },
    'mistral-large-latest': { inputTokensCost: 8 / 1000, outputTokensCost: 24 / 1000 },
  },

  modelAliases: {
    mistral: 'open-mistral-7b',
    mixtral: 'open-mixtral-8x7b',
    small: 'mistral-small-latest',
    medium: 'mistral-medium-latest',
    large: 'mistral-large-latest',
  },

  getChatCompletion: async (config: ProviderConfig, messages: Message[]) => {
    const api = new MistralClient(config.apiKey);

    const allMessages = getMessages(config, messages);

    const startTime = performance.now();
    const response = await api.chat({
      messages: allMessages,
      model: config.model,
      // TODO: apply response style
      // ...responseStyles[config.responseStyle],
    });
    const responseTime = performance.now() - startTime;

    return {
      message: {
        role: 'assistant',
        content: response.choices[0]?.message.content ?? '',
      },
      usage: {
        inputTokens: response.usage?.prompt_tokens ?? 0,
        outputTokens: response.usage?.completion_tokens ?? 0,
        requests: 1,
      },
      responseTime,
      responseModel: response.model,
      data: response,
    };
  },

  getChatCompletionStream: async function (
    config: ProviderConfig,
    messages: Message[],
    onResponseUpdate: (update: ModelResponseUpdate) => void,
  ) {
    const api = new MistralClient(config.apiKey);

    const allMessages = getMessages(config, messages);

    const startTime = performance.now();
    const stream = await api.chatStream({
      messages: allMessages,
      model: config.model,
      // TODO: apply response style
      // ...responseStyles[config.responseStyle],
    });

    let lastChunk;
    let content = '';
    for await (const chunk of stream) {
      lastChunk = chunk;
      content += chunk.choices[0]?.delta?.content || '';
      onResponseUpdate({ content });
    }

    const responseTime = performance.now() - startTime;

    return {
      message: {
        role: 'assistant',
        content,
      },
      usage: {
        inputTokens: estimateInputTokens(allMessages),
        outputTokens: estimateOutputTokens(content),
        requests: 1,
      },
      responseTime,
      responseModel: lastChunk?.model || 'unknown',
      data: lastChunk,
    };
  },
};

function getMessages(config: ProviderConfig, messages: Message[]): Message[] {
  if (!config.systemPrompt) {
    return messages;
  }

  const systemMessage: Message = {
    role: 'system',
    content: config.systemPrompt,
  };
  return [systemMessage, ...messages];
}

export default Mistral;
