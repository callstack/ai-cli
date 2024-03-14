export type Message = SystemMessage | UserMessage | AiMessage;

export type SystemMessage = {
  role: 'system';
  content: string;
};

export type UserMessage = {
  role: 'user';
  content: string;
};

export type AiMessage = {
  role: 'assistant';
  content: string;
};

export type ModelResponse = {
  messageText: string | null;
  usage: ModelUsage;
  responseTime: number;
  responseModel: string;
  response: unknown;
};

export type ModelUsage = {
  inputTokens: number;
  outputTokens: number;
  requests: number;
};
