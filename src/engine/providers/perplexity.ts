import OpenAI from 'openai';
import { type Message } from '../inference.js';
import type { ProviderConfig } from './config.js';
import type { Provider } from './provider.js';

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
    const openai = new OpenAI({
      apiKey: config.apiKey,
      baseURL: 'https://api.perplexity.ai',
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
};

export default Perplexity;
