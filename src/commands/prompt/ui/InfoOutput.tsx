import React from 'react';
import { Box, Newline, Text } from 'ink';
import redent from 'redent';
import { useChatState } from '../state.js';

export function InfoOutput() {
  const provider = useChatState((state) => state.provider);
  const providerConfig = useChatState((state) => state.providerConfig);
  const verbose = useChatState((state) => state.verbose);
  const contextMessages = useChatState((state) => state.contextMessages);

  const contextMessagesOutput = verbose
    ? redent(
        JSON.stringify(
          contextMessages.map((m) => `${m.role}: ${m.content}`),
          null,
          2,
        ),
        3,
      ).trim()
    : null;

  return (
    <Box marginTop={1}>
      <Text color="grey">
        Info:
        <Newline /> - Provider: {provider.label}
        <Newline /> - Model: {providerConfig.model}
        <Newline /> - System prompt: {providerConfig.systemPrompt}
        {contextMessagesOutput ? (
          <>
            <Newline /> - Context Messages: {contextMessagesOutput}
          </>
        ) : null}
      </Text>
    </Box>
  );
}
