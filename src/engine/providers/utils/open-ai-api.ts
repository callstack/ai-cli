import type OpenAI from 'openai';
import type { ChatCompletionChunk } from 'openai/resources/index.mjs';
import type { Message, ModelResponse, ModelResponseUpdate } from '../../inference.js';
import { estimateInputTokens, estimateOutputTokens } from '../../tokenizer.js';
import { responseStyles, type ProviderConfig } from '../config.js';

export async function getChatCompletion(
  api: OpenAI,
  config: ProviderConfig,
  messages: Message[],
): Promise<ModelResponse> {
  const allMessages = getMessages(config, messages);

  const startTime = performance.now();
  const response = await api.chat.completions.create({
    messages: allMessages,
    model: config.model,
    ...responseStyles[config.responseStyle],
  });
  const responseTime = performance.now() - startTime;

  return {
    message: {
      role: 'assistant',
      content: response.choices[0]?.message.content ?? '',
    },
    usage: {
      inputTokens: response.usage?.prompt_tokens ?? 0,
      outputTokens: response.usage?.completion_tokens ?? 0,
      requests: 1,
    },
    responseTime,
    responseModel: response.model,
    data: response,
  };
}

// Perplexity provides output data in the last chunk, while OpenAI does not.
interface ChunkWithUsage extends ChatCompletionChunk {
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export async function getChatCompletionStream(
  api: OpenAI,
  config: ProviderConfig,
  messages: Message[],
  onResponseUpdate: (response: ModelResponseUpdate) => void,
): Promise<ModelResponse> {
  const allMessages = getMessages(config, messages);

  const startTime = performance.now();
  const stream = await api.chat.completions.create({
    messages: allMessages,
    model: config.model,
    stream: true,
    ...responseStyles[config.responseStyle],
  });

  const chunks: ChunkWithUsage[] = [];
  let content = '';

  for await (const chunk of stream) {
    chunks.push(chunk);
    content += chunk.choices[0]?.delta?.content || '';
    onResponseUpdate({ content });
  }

  const responseTime = performance.now() - startTime;
  const lastChunk = chunks[chunks.length - 1] as ChunkWithUsage;

  return {
    message: {
      role: 'assistant',
      content,
    },
    // Perplexity provides output data in the last chunk, while OpenAI does not.
    usage: {
      inputTokens: lastChunk?.usage?.prompt_tokens ?? estimateInputTokens(allMessages),
      outputTokens: lastChunk?.usage?.completion_tokens ?? estimateOutputTokens(content),
      requests: 1,
    },
    responseTime,
    responseModel: lastChunk?.model || 'unknown',
    data: lastChunk,
  };
}

function getMessages(config: ProviderConfig, messages: Message[]): Message[] {
  if (!config.systemPrompt) {
    return messages;
  }

  const systemMessage: Message = {
    role: 'system',
    content: config.systemPrompt,
  };
  return [systemMessage, ...messages];
}
