import { GoogleGenerativeAI, POSSIBLE_ROLES, type Content } from '@google/generative-ai';
import {
  //type AiMessage,
  type Message,
  type ModelResponseUpdate,
  //type UserMessage,
} from '../inference.js';
//import { responseStyles, type ProviderConfig } from './config.js';
import { type ProviderConfig } from './config.js';
import type { Provider } from './provider.js';

//type ModelMessage = UserMessage | AiMessage;

const Google: Provider = {
  label: 'Google',
  name: 'google',
  apiKeyUrl: 'https://aistudio.google.com/app/apikey',

  // Anthropic models: https://cloud.google.com/vertex-ai/generative-ai/docs/learn/models
  defaultModel: 'gemini-pro',

  // Price per 1M tokens [input, output].
  // Source: https://cloud.google.com/vertex-ai/generative-ai/pricing
  modelPricing: {
    // 'claude-3-haiku-20240307': { inputTokensCost: 0.25, outputTokensCost: 1.25 },
  },

  modelAliases: {
    //haiku: 'claude-3-haiku-20240307',
  },

  getChatCompletion: async (config: ProviderConfig, messages: Message[]) => {
    const api = new GoogleGenerativeAI(config.apiKey);
    const model = api.getGenerativeModel({ model: config.model });

    //const nonSystemMessages = messages.filter((m) => m.role !== 'system') as ModelMessage[];
    //const systemMessagesContent = messages.filter((m) => m.role === 'system').map((m) => m.content);
    const allMessageContents = messages.map((m) => m.content);
    const systemPrompt = [config.systemPrompt, ...allMessageContents].join('\n\n');
    const startTime = performance.now();

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;

    // const response = await api.messages.create({
    //   messages: nonSystemMessages,
    //   model: config.model,
    //   max_tokens: 1024,
    //   system: systemPrompt,
    //   ...responseStyles[config.responseStyle],
    // });

    const responseTime = performance.now() - startTime;
    return {
      message: {
        role: 'assistant',
        content: response.text(),
      },
      usage: {
        inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
        requests: 1,
      },
      responseTime,
      responseModel: config.model,
      data: response,
    };

    // return {
    //   message: {
    //     role: 'assistant',
    //     content: response.content[0]?.text ?? '',
    //   },
    //   usage: {
    //     inputTokens: response.usage.input_tokens,
    //     outputTokens: response.usage.output_tokens,
    //     requests: 1,
    //   },
    //   responseTime,
    //   responseModel: response.model,
    //   data: response,
    // };
  },

  getChatCompletionStream: async function (
    config: ProviderConfig,
    messages: Message[],
    onResponseUpdate: (update: ModelResponseUpdate) => void,
  ) {
    const api = new GoogleGenerativeAI(config.apiKey);
    const model = api.getGenerativeModel({ model: config.model });

    const contents = messages.map((m) => mapMessageToModel(m));

    const startTime = performance.now();
    const result = await model.generateContent({ contents });
    const response = await result.response;

    // const response = await api.messages.create({
    //   max_tokens: 1024,
    //   system: systemPrompt,
    //   ...responseStyles[config.responseStyle],
    // });

    onResponseUpdate({ content: response.text() });
    const responseTime = performance.now() - startTime;
    return {
      message: {
        role: 'assistant',
        content: response.text(),
      },
      usage: {
        inputTokens: response.usageMetadata?.promptTokenCount ?? 0,
        outputTokens: response.usageMetadata?.candidatesTokenCount ?? 0,
        requests: 1,
      },
      responseTime,
      responseModel: config.model,
      data: response,
    };

    // const api = new AnthropicAPI({
    //   apiKey: config.apiKey,
    // });
    // const nonSystemMessages = messages.filter((m) => m.role !== 'system') as ModelMessage[];
    // const systemMessagesContent = messages.filter((m) => m.role === 'system').map((m) => m.content);
    // const systemPrompt = [config.systemPrompt, ...systemMessagesContent].join('\n\n');
    // const startTime = performance.now();
    // let content = '';
    // const stream = api.messages
    //   .stream({
    //     messages: nonSystemMessages,
    //     model: config.model,
    //     max_tokens: 1024,
    //     system: systemPrompt,
    //     ...responseStyles[config.responseStyle],
    //   })
    //   .on('text', (text) => {
    //     content += text;
    //     onResponseUpdate({ content });
    //   });
    // const response = await stream.finalMessage();
    // const responseTime = performance.now() - startTime;
    // return {
    //   message: {
    //     role: 'assistant',
    //     content,
    //   },
    //   usage: {
    //     inputTokens: response.usage.input_tokens,
    //     outputTokens: response.usage.output_tokens,
    //     requests: 1,
    //   },
    //   responseTime,
    //   responseModel: response.model,
    //   data: response,
    // };
  },
};

export default Google;

type ModelRole = (typeof POSSIBLE_ROLES)[number];

function mapRoleToModel(role: string): ModelRole {
  if (role === 'user') return 'user';
  if (role === 'assistant') return 'model';
  if (role === 'system') return 'system';

  throw new Error(`Invalid role: ${role}`);
}

function mapMessageToModel(message: Message): Content {
  return {
    role: mapRoleToModel(message.role),
    parts: [{ text: message.content }],
  };
}
