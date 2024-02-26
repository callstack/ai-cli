import OpenAI from 'openai';
import { type Message } from '../inference';
import type { ProviderConfig } from './config';
import type { Provider } from '.';

const Perplexity: Provider = {
  label: 'Perplexity',
  name: 'perplexity',
  apiKeyUrl: 'https://perplexity.ai/settings/api',
  getChatCompletion: async (config: ProviderConfig, messages: Message[]) => {
    const perplexity = new OpenAI({
      apiKey: config.apiKey,
      baseURL: 'https://api.perplexity.ai',
    });

    const systemMessage: Message = {
      role: 'system',
      content: config.systemPrompt,
    };

    const response = await perplexity.chat.completions.create({
      messages: [systemMessage, ...messages],
      model: config.model,
    });

    return [response.choices[0]?.message.content ?? null, response] as const;
  },
};

export default Perplexity;
