import React from 'react';
import { Newline, Text } from 'ink';
import type { Provider } from '../../engine/providers/provider.js';
import type { ProviderConfig } from '../../engine/providers/config.js';

type InfoProps = {
  show: boolean;
  provider: Provider;
  config: ProviderConfig;
};

export const Info = ({ show, provider, config }: InfoProps) => {
  return show ? (
    <Text>
      Provider: {provider.label}
      <Newline />
      Model: {config.model}
      <Newline />
      System prompt: {config.systemPrompt}
      {/* <Newline /> */}
      {/* Total tokens: ${context.totalUsage.inputTokens} in + ${context.totalUsage.outputTokens} out */}
      {/* Total cost: ${formatCost(totalCost)} */}
      {/* Current context:', JSON.stringify(context.messages, null, 2) */}
    </Text>
  ) : null;
};
