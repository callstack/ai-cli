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

export interface ModelResponse {
  messageText: string | null;
  stats: ModelResponseStats;
  response: unknown;
}

export interface ModelResponseStats {
  responseTime: number;
  inputTokens?: number;
  outputTokens?: number;
}
