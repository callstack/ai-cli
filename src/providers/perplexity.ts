import OpenAI from 'openai';
import type { Config } from '../config';
import { genericSystemMessage, type Message } from '../inference';

export async function getChatCompletion(config: Config, messages: Message[]) {
  const openai = new OpenAI({
    apiKey: config.providers.perplexity.apiKey,
    baseURL: 'https://api.perplexity.ai',
  });

  const response = await openai.chat.completions.create({
    messages: [genericSystemMessage, ...messages],
    model: config.providers.perplexity.model,
  });

  return [response.choices[0]?.message.content ?? null, response] as const;
}
