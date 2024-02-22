import OpenAI from 'openai';
import { type Message } from '../inference';
import type { ProviderConfig } from './config';
import type { Provider } from '.';

const OpenAi: Provider = {
  label: 'OpenAI',
  name: 'openAi',
  apiKeyUrl: 'https://www.platform.openai.com/api-keys',
  getChatCompletion: async (config: ProviderConfig, messages: Message[]) => {
    const openai = new OpenAI({
      apiKey: config.apiKey,
    });

    const systemMessage: Message = {
      role: 'system',
      content: config.systemPrompt,
    };

    const response = await openai.chat.completions.create({
      messages: [systemMessage, ...messages],
      model: config.model,
    });

    return [response.choices[0]?.message.content ?? null, response] as const;
  },
};

export default OpenAi;
