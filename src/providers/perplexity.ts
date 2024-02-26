import OpenAI from 'openai';
import { type Message } from '../inference';
import type { ProviderConfig } from './config';
import type { Provider } from './provider';

const Perplexity: Provider = {
  label: 'Perplexity',
  name: 'perplexity',
  apiKeyUrl: 'https://perplexity.ai/settings/api',

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
    });
    const responseTime = performance.now() - startTime;

    return {
      messageText: response.choices[0]?.message.content ?? null,
      stats: {
        responseTime,
        inputTokens: response.usage?.prompt_tokens,
        outputTokens: response.usage?.completion_tokens,
      },
      response,
    };
  },
};

export default Perplexity;
