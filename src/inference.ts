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

export const genericSystemMessage: SystemMessage = {
  role: 'system',
  content: 'You are a helpful assistant responding in a concise manner to user questions.',
};
