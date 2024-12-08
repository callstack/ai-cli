import { ModelUsage, type Message } from '@callstack/byorg-core';

export const messages: Message[] = [];

export const totalUsage: ModelUsage = {
  inputTokens: 0,
  outputTokens: 0,
  requests: 0,
  responseTime: 0,
  model: '',
  usedTools: {},
};

export function resetUsage() {
  totalUsage.inputTokens = 0;
  totalUsage.outputTokens = 0;
  totalUsage.requests = 0;
  totalUsage.responseTime = 0;
}

export function updateUsage(usage: ModelUsage) {
  totalUsage.inputTokens += usage.inputTokens;
  totalUsage.outputTokens += usage.outputTokens;
  totalUsage.requests += usage.requests;
  totalUsage.responseTime += usage.responseTime;
  totalUsage.model = usage.model;
}
