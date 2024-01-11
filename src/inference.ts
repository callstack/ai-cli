import OpenAI from 'openai';
import 'dotenv/config';
import type { Config } from './config';

export type Message = SystemMessage | UserMessage | AiMessage;

export interface SystemMessage {
  role: 'system';
  content: string;
}

export interface UserMessage {
  role: 'user';
  content: string;
}

export interface AiMessage {
  role: 'assistant';
  content: string;
}

const systemMessage: SystemMessage = {
  role: 'system',
  content: 'You are a helpful assistant responding in a concise manner to user questions.',
};

export async function getChatCompletion(config: Config, messages: Message[]) {
  const openai = new OpenAI({
    apiKey: config.openAiApiKey,
  });

  const response = await openai.chat.completions.create({
    messages: [systemMessage, ...messages],
    model: config.model,
  });

  return [response.choices[0]?.message.content ?? null, response] as const;
}
