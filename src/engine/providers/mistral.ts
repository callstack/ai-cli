import MistralClient, { type ChatCompletionResponseChunk } from '@mistralai/mistralai';
import { type Message, type ModelResponseUpdate } from '../inference.js';
import { estimateInputTokens, estimateOutputTokens } from '../tokenizer.js';
import { responseStyles, type ProviderConfig } from './config.js';
import type { Provider } from './provider.js';

// Mistral provides output data in the last chunk.
interface ChunkWithUsage extends ChatCompletionResponseChunk {
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

const Mistral: Provider = {
  label: 'Mistral',
  name: 'mistral',
  apiKeyUrl: 'https://console.mistral.ai/api-keys/',

  // OpenAI models: https://docs.mistral.ai/platform/endpoints/
  defaultModel: 'mistral-medium-latest',

  // Price per 1M tokens [input, output].
  // Source: https://docs.mistral.ai/platform/pricing/
  modelPricing: {
    'open-mistral-7b': { inputTokensCost: 0.25, outputTokensCost: 0.25 },
    'open-mixtral-8x7b': { inputTokensCost: 0.7, outputTokensCost: 0.7 },
    'open-mixtral-8x22b': { inputTokensCost: 2, outputTokensCost: 6 },
    'mistral-small-latest': { inputTokensCost: 1, outputTokensCost: 3 },
    'mistral-medium-latest': { inputTokensCost: 2.7, outputTokensCost: 8.1 },
    'mistral-large-latest': { inputTokensCost: 4, outputTokensCost: 12 },
  },

  modelAliases: {
    mistral: 'open-mistral-7b',
    mixtral: 'open-mixtral-8x22b',
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
      ...getMistralResponseStyle(config),
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
      ...getMistralResponseStyle(config),
    });

    let lastChunk: ChunkWithUsage | null = null;
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
        inputTokens: lastChunk?.usage?.prompt_tokens ?? estimateInputTokens(allMessages),
        outputTokens: lastChunk?.usage?.completion_tokens ?? estimateOutputTokens(content),
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

interface MistralResponseStyle {
  temperature?: number;
  topP?: number;
}

function getMistralResponseStyle(config: ProviderConfig): MistralResponseStyle {
  const style = responseStyles[config.responseStyle];

  const result: MistralResponseStyle = {};
  if ('temperature' in style) {
    result.temperature = style.temperature;
  }
  if ('top_p' in style) {
    result.topP = style.top_p;
  }

  return result;
}

export default Mistral;
