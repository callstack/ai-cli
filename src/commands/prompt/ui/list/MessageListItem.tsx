import React from 'react';
import { Text } from 'ink';
import { formatTime } from '../../../../format.js';
import { colors } from '../../../../components/colors.js';
import type { MessageItem } from '../types.js';

type MessageListItemProps = {
  item: MessageItem;
  verbose?: boolean;
};

export const MessageListItem = ({ item, verbose }: MessageListItemProps) => {
  const { message } = item;

  return (
    <Text color={message.role === 'assistant' ? colors.assistant : colors.user}>
      <Text>{message.role === 'assistant' ? 'ai: ' : 'me: '}</Text>
      <Text>{message.content}</Text>
      {verbose && item.responseTime != null ? (
        <Text color={colors.info}> ({formatTime(item.responseTime)})</Text>
      ) : null}
    </Text>
  );
};
