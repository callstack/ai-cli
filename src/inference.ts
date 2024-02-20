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

export interface UsageStats {
  prompt_tokens: number;
  completion_tokens: number;
}

export interface ResponseStats {
  responseTime: number;
  prompt_tokens?: number;
  completion_tokens?: number;
}
