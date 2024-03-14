import React from 'react';
import { Text } from 'ink';
import { formatCost } from '../../../../format.js';
import { colors } from '../../../../components/colors.js';
import type { MessageItem } from '../types.js';

type MessageListItemProps = {
  item: MessageItem;
  showUsage?: boolean;
  showCost?: boolean;
};

export const MessageListItem = ({ item, showUsage, showCost }: MessageListItemProps) => {
  const { message, usage } = item;

  return (
    <Text color={message.role === 'assistant' ? colors.assistant : colors.user}>
      <Text>{message.role === 'assistant' ? 'ai: ' : 'me: '}</Text>
      <Text>{message.content}</Text>

      {(showUsage || showCost) && usage ? (
        <Text color={colors.info}> {formatMessageStats(item, showUsage, showCost)}</Text>
      ) : null}
    </Text>
  );
};

const formatMessageStats = (
  item: MessageItem,
  showUsage: boolean = false,
  showCost: boolean = false,
) => {
  const { usage, responseTime, cost } = item;
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
