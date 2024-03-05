import OpenAI from 'openai';
import { type Message } from '../inference.js';
import type { ProviderConfig } from './config.js';
import type { Provider } from './provider.js';

const OpenAi: Provider = {
  label: 'OpenAI',
  name: 'openAi',
  apiKeyUrl: 'https://platform.openai.com/api-keys',

  // Price per 1k tokens [input, output].
  // Source: https://openai.com/pricing
  pricing: {
    'gpt-4-turbo-preview': { inputTokensCost: 0.01, outputTokensCost: 0.03 },
    'gpt-4-0125-preview': { inputTokensCost: 0.01, outputTokensCost: 0.03 },
    'gpt-4-1106-preview': { inputTokensCost: 0.01, outputTokensCost: 0.03 },
    'gpt-4': { inputTokensCost: 0.03, outputTokensCost: 0.06 },
    'gpt-4-0613': { inputTokensCost: 0.03, outputTokensCost: 0.06 },
    'gpt-4-32k': { inputTokensCost: 0.06, outputTokensCost: 0.12 },
    'gpt-4-32k-0613': { inputTokensCost: 0.06, outputTokensCost: 0.12 },
    'gpt-3.5-turbo': { inputTokensCost: 0.0005, outputTokensCost: 0.0015 },
    'gpt-3.5-turbo-0125': { inputTokensCost: 0.0005, outputTokensCost: 0.0015 },
  },

  getChatCompletion: async (config: ProviderConfig, messages: Message[]) => {
    const openai = new OpenAI({
      apiKey: config.apiKey,
    });

    const systemMessage: Message = {
      role: 'system',
      content: config.systemPrompt,
    };

    const startTime = performance.now();
    const response = await openai.chat.completions.create({
      messages: [systemMessage, ...messages],
      model: config.model,
      temperature: config.temperature,
      top_p: config.top_p,
    });
    const responseTime = performance.now() - startTime;

    return {
      messageText: response.choices[0]?.message.content ?? null,
      usage: {
        inputTokens: response.usage?.prompt_tokens ?? 0,
        outputTokens: response.usage?.completion_tokens ?? 0,
        requests: 1,
      },
      responseTime,
      responseModel: response.model,
      response,
    };
  },
};

export default OpenAi;
