import { Tiktoken } from 'tiktoken/lite';
// @ts-expect-error not yet supported
import model from 'tiktoken/encoders/cl100k_base.json' assert { type: 'json' };
import type { Message } from './inference.js';

const encoder = new Tiktoken(model.bpe_ranks, model.special_tokens, model.pat_str);

export function getTokensCount(text: string) {
  return encoder.encode(text).length;
}

export function estimateInputTokens(messages: Message[]) {
  let total = 0;
  messages.forEach((message) => {
    total += getTokensCount(message.content) ?? 0;
  });

  return total;
}

export function estimateOutputTokens(text: string) {
  return encoder.encode(text).length;
}
