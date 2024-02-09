import OpenAI from 'openai';
import { genericSystemMessage, type Message } from '../inference';
import type { ProviderConfig } from './config';

export async function getChatCompletion(config: ProviderConfig, messages: Message[]) {
  const perplexity = new OpenAI({
    apiKey: config.apiKey,
    baseURL: 'https://api.perplexity.ai',
  });

  const response = await perplexity.chat.completions.create({
    messages: [genericSystemMessage, ...messages],
    model: config.model,
  });

  return [response.choices[0]?.message.content ?? null, response] as const;
}
