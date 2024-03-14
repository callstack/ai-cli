import React from 'react';
import { Newline, Text } from 'ink';
import type { Provider } from '../../../engine/providers/provider.js';
import type { ProviderConfig } from '../../../engine/providers/config.js';
import type { Message } from '../../../engine/inference.js';

type InfoOutputProps = {
  provider: Provider;
  config: ProviderConfig;
  messages: Message[];
  verbose?: boolean;
};

export function InfoOutput({ provider, config, messages, verbose }: InfoOutputProps) {
  return (
    <Text>
      Provider: {provider.label}
      <Newline />
      Model: {config.model}
      <Newline />
      System prompt: {config.systemPrompt}
      {verbose ? (
        <>
          <Newline />
          Current context:{' '}
          {JSON.stringify(
            messages.map((message) => `${message.role}: ${message.content}`),
            null,
            2,
          )}
        </>
      ) : null}
    </Text>
  );
}
