import React from 'react';
import { Newline, Text } from 'ink';
import { useChatState } from '../state.js';

export function InfoOutput() {
  const provider = useChatState((state) => state.provider);
  const providerConfig = useChatState((state) => state.providerConfig);
  const verbose = useChatState((state) => state.verbose);
  const contextMessages = useChatState((state) => state.contextMessages);

  const contextMessagesOutput = verbose
    ? JSON.stringify(
        contextMessages.map((m) => `${m.role}: ${m.content}`),
        null,
        2,
      )
    : null;

  return (
    <Text>
      Provider: {provider.label}
      <Newline />
      Model: {providerConfig.model}
      <Newline />
      System prompt: {providerConfig.systemPrompt}
      {contextMessagesOutput ? (
        <>
          <Newline />
          Context Messages: {contextMessagesOutput}
        </>
      ) : null}
    </Text>
  );
}
