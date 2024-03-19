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
  message: AiMessage;
  usage: ModelUsage;
  responseTime: number;
  responseModel: string;
  data: unknown;
}

export interface ModelResponseUpdate {
  content: string;
}

export type ModelResponseStream = { response: ModelResponse } | { update: ModelResponseUpdate };

export interface ModelUsage {
  inputTokens: number;
  outputTokens: number;
  requests: number;
}
