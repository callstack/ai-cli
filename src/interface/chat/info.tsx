import React from 'react';
import { Newline, Text } from 'ink';
import type { Provider } from '../../engine/providers/provider.js';
import type { ProviderConfig } from '../../engine/providers/config.js';
import type { Message } from '../../engine/inference.js';

type InfoProps = {
  provider: Provider;
  config: ProviderConfig;
  messages: Message[];
};

export const Info = ({ provider, config, messages }: InfoProps) => {
  return (
    <Text>
      Provider: {provider.label}
      <Newline />
      Model: {config.model}
      <Newline />
      System prompt: {config.systemPrompt}
      <Newline />
      Current context:{' '}
      {JSON.stringify(
        messages.map((message) => `${message.role}: ${message.content}`),
        null,
        1,
      )}
    </Text>
  );
};
