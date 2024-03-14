import React from 'react';
import { Text } from 'ink';
import { formatCost } from '../../../format.js';
import { colors } from '../../../components/colors.js';
import type { DisplayMessageItem } from './prompt-ui.js';

type ChatMessageProps = {
  message: DisplayMessageItem;
  showUsage?: boolean;
  showCost?: boolean;
};

export const ChatMessage = ({ message: displayMessage, showUsage, showCost }: ChatMessageProps) => {
  const { message, usage } = displayMessage;

  return (
    <Text color={message.role === 'assistant' ? colors.assistant : colors.user}>
      <Text>{message.role === 'assistant' ? 'ai: ' : 'me: '}</Text>
      <Text>{message.content}</Text>

      {(showUsage || showCost) && usage ? (
        <Text color={colors.info}> {formatMessageStats(displayMessage, showUsage, showCost)}</Text>
      ) : null}
    </Text>
  );
};

const formatMessageStats = (
  stats: DisplayMessageItem,
  showUsage: boolean = false,
  showCost: boolean = false,
) => {
  const { usage, responseTime, cost } = stats;
  const output = [];

  if (showUsage && usage) {
    if (responseTime) {
      output.push(`time: ${(responseTime / 1000).toFixed(1)} s`);
    }
    if (usage) {
      output.push(`tokens: ${usage.inputTokens}in + ${usage.outputTokens}out`);
    }
  }

  if (showCost && cost) {
    output.push(`costs: ${formatCost(cost)}`);
  }

  return output.join(', ');
};
