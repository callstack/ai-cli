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
  usage: ModelUsage;
  responseTime: number;
  responseModel: string;
  response: unknown;
}

export interface ModelUsage {
  inputTokens: number;
  outputTokens: number;
  requests: number;
}
