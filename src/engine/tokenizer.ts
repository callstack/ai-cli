import { createRequire } from 'module';
import { Tiktoken } from 'tiktoken/lite';
import type { Message } from './inference.js';

// Workaround for JSON loading in ESM
// See: https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/#option-2%3A-leverage-the-commonjs-%60require%60-function-to-load-json-files
const require = createRequire(import.meta.url);
const model = require('tiktoken/encoders/cl100k_base.json');

const encoder = new Tiktoken(model.bpe_ranks, model.special_tokens, model.pat_str);

export function getTokensCount(text: string) {
  return encoder.encode(text).length;
}

const tokensPerMessage = 3;

// Based on: https://cookbook.openai.com/examples/how_to_count_tokens_with_tiktoken#6-counting-tokens-for-chat-completions-api-calls
export function estimateInputTokens(messages: Message[]) {
  let total = 0;
  messages.forEach((message) => {
    total += tokensPerMessage;
    total += getTokensCount(message.role);
    total += getTokensCount(message.content);
  });

  total += 3; // every reply from AI model is primed with <|start|>assistant<|message|>
  return total;
}

export function estimateOutputTokens(text: string) {
  return encoder.encode(text).length;
}
