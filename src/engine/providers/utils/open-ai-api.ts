import type OpenAI from 'openai';
import type { Message, ModelResponse, ModelResponseUpdate } from '../../inference.js';
import { estimateInputTokens, estimateOutputTokens } from '../../tokenizer.js';
import { responseStyles, type ProviderConfig } from '../config.js';

export async function getChatCompletion(
  api: OpenAI,
  config: ProviderConfig,
  messages: Message[],
): Promise<ModelResponse> {
  const systemMessage: Message = {
    role: 'system',
    content: config.systemPrompt,
  };

  const startTime = performance.now();
  const response = await api.chat.completions.create({
    messages: [systemMessage, ...messages],
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

export async function getChatCompletionStream(
  api: OpenAI,
  config: ProviderConfig,
  messages: Message[],
  onResponseUpdate: (response: ModelResponseUpdate) => void,
): Promise<ModelResponse> {
  const systemMessage: Message = {
    role: 'system',
    content: config.systemPrompt,
  };

  const startTime = performance.now();
  const stream = await api.chat.completions.create({
    messages: [systemMessage, ...messages],
    model: config.model,
    stream: true,
    ...responseStyles[config.responseStyle],
  });

  const chunks = [];
  let content = '';

  for await (const chunk of stream) {
    chunks.push(chunk);
    content += chunk.choices[0]?.delta?.content || '';
    onResponseUpdate({ content });
  }

  const responseTime = performance.now() - startTime;
  const lastChunk = chunks[chunks.length - 1];

  return {
    message: {
      role: 'assistant',
      content,
    },
    usage: {
      inputTokens: estimateInputTokens(messages),
      outputTokens: estimateOutputTokens(content),
      requests: 1,
    },
    responseTime,
    responseModel: lastChunk?.model || 'unknown',
    data: lastChunk,
  };
}

// export async function* getChatCompletionStream(
//   api: OpenAI,
//   config: ProviderConfig,
//   messages: Message[],
// ): AsyncGenerator<ModelResponseStream> {
//   const systemMessage: Message = {
//     role: 'system',
//     content: config.systemPrompt,
//   };

//   const startTime = performance.now();
//   const stream = api.beta.chat.completions.stream({
//     messages: [systemMessage, ...messages],
//     model: config.model,
//     stream: true,
//     ...responseStyles[config.responseStyle],
//   });

//   let contentFromChunks = '';
//   for await (const chunk of stream) {
//     contentFromChunks += chunk.choices[0]?.delta?.content || '';
//     yield {
//       update: {
//         content: contentFromChunks,
//       },
//     };
//   }

//   const responseTime = performance.now() - startTime;
//   const completion = await stream.finalChatCompletion();

//   const content = completion.choices[0]?.message.content ?? '';

//   yield {
//     response: {
//       message: {
//         role: 'assistant',
//         content,
//       },
//       usage: {
//         inputTokens: estimateInputTokens(messages),
//         outputTokens: estimateOutputTokens(content),
//         requests: 1,
//       },
//       responseTime,
//       responseModel: completion.model,
//       data: completion,
//     },
//   };
// }

// export async function* getBetaChatCompletionStream(
//   api: OpenAI,
//   config: ProviderConfig,
//   messages: Message[],
// ): AsyncGenerator<ModelResponseStream> {
//   const systemMessage: Message = {
//     role: 'system',
//     content: config.systemPrompt,
//   };

//   const startTime = performance.now();
//   const stream = api.beta.chat.completions.stream({
//     messages: [systemMessage, ...messages],
//     model: config.model,
//     stream: true,
//     ...responseStyles[config.responseStyle],
//   });

//   let contentFromChunks = '';
//   for await (const chunk of stream) {
//     contentFromChunks += chunk.choices[0]?.delta?.content || '';
//     yield {
//       update: {
//         content: contentFromChunks,
//       },
//     };
//   }

//   const responseTime = performance.now() - startTime;
//   const completion = await stream.finalChatCompletion();

//   const content = completion.choices[0]?.message.content ?? '';

//   yield {
//     response: {
//       message: {
//         role: 'assistant',
//         content,
//       },
//       usage: {
//         inputTokens: estimateInputTokens(messages),
//         outputTokens: estimateOutputTokens(content),
//         requests: 1,
//       },
//       responseTime,
//       responseModel: completion.model,
//       data: completion,
//     },
//   };
// }
