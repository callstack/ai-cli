import AnthropicAPI from '@anthropic-ai/sdk';
import {
  type AiMessage,
  type Message,
  type ModelResponseUpdate,
  type UserMessage,
} from '../inference.js';
import { responseStyles, type ProviderConfig } from './config.js';
import type { Provider } from './provider.js';

type ModelMessage = UserMessage | AiMessage;

const Anthropic: Provider = {
  label: 'Anthropic',
  name: 'anthropic',
  apiKeyUrl: 'https://console.anthropic.com/settings/keys',

  // Anthropic models: https://docs.anthropic.com/en/docs/about-claude/models
  defaultModel: 'claude-3-5-sonnet-20240620',

  // Price per 1M tokens [input, output].
  // Source: https://docs.anthropic.com/en/docs/about-claude/models
  modelPricing: {
    // Current models
    'claude-3-5-sonnet-20240620': { inputTokensCost: 3.0, outputTokensCost: 15.0 },
    'claude-3-haiku-20240307': { inputTokensCost: 0.25, outputTokensCost: 1.25 },
    'claude-3-sonnet-20240229': { inputTokensCost: 3.0, outputTokensCost: 15.0 },
    'claude-3-opus-20240229': { inputTokensCost: 15.0, outputTokensCost: 75.0 },

    // Legacy models
    'claude-2.1': { inputTokensCost: 8.0, outputTokensCost: 24.0 },
    'claude-2.0': { inputTokensCost: 8.0, outputTokensCost: 24.0 },
    'claude-instant-1.2': { inputTokensCost: 0.8, outputTokensCost: 2.4 },
  },

  modelAliases: {
    haiku: 'claude-3-haiku-20240307',
    sonnet: 'claude-3-5-sonnet-20240620',
    opus: 'claude-3-opus-20240229',
  },

  getChatCompletion: async (config: ProviderConfig, messages: Message[]) => {
    const api = new AnthropicAPI({
      apiKey: config.apiKey,
    });

    const nonSystemMessages = messages.filter((m) => m.role !== 'system') as ModelMessage[];

    const systemMessagesContent = messages.filter((m) => m.role === 'system').map((m) => m.content);
    const systemPrompt = [config.systemPrompt, ...systemMessagesContent].join('\n\n');

    const startTime = performance.now();
    const response = await api.messages.create({
      messages: nonSystemMessages,
      model: config.model,
      max_tokens: 1024,
      system: systemPrompt,
      ...responseStyles[config.responseStyle],
    });
    const responseTime = performance.now() - startTime;

    const firstContent = response.content[0];
    if (firstContent?.type !== 'text') {
      throw new Error(`Received unexpected content type from Anthropic API: ${firstContent?.type}`);
    }

    return {
      message: {
        role: 'assistant',
        content: firstContent.text,
      },
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
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
    const api = new AnthropicAPI({
      apiKey: config.apiKey,
    });

    const nonSystemMessages = messages.filter((m) => m.role !== 'system') as ModelMessage[];

    const systemMessagesContent = messages.filter((m) => m.role === 'system').map((m) => m.content);
    const systemPrompt = [config.systemPrompt, ...systemMessagesContent].join('\n\n');

    const startTime = performance.now();
    let content = '';
    const stream = api.messages
      .stream({
        messages: nonSystemMessages,
        model: config.model,
        max_tokens: 1024,
        system: systemPrompt,
        ...responseStyles[config.responseStyle],
      })
      .on('text', (text) => {
        content += text;
        onResponseUpdate({ content });
      });

    const response = await stream.finalMessage();
    const responseTime = performance.now() - startTime;

    return {
      message: {
        role: 'assistant',
        content,
      },
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        requests: 1,
      },
      responseTime,
      responseModel: response.model,
      data: response,
    };
  },
};

export default Anthropic;
