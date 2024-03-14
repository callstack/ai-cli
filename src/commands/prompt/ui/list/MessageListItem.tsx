import React from 'react';
import { Text } from 'ink';
import { formatTime } from '../../../../format.js';
import { colors } from '../../../../theme/colors.js';
import { useChatState } from '../../state.js';
import type { MessageItem } from '../types.js';

type MessageListItemProps = {
  item: MessageItem;
};

export const MessageListItem = ({ item }: MessageListItemProps) => {
  const verbose = useChatState((state) => state.verbose);

  return (
    <Text color={item.message.role === 'assistant' ? colors.assistant : colors.user}>
      <Text>{item.message.role === 'assistant' ? 'ai: ' : 'me: '}</Text>
      <Text>{item.message.content}</Text>
      {verbose && item.responseTime != null ? (
        <Text color={colors.info}> ({formatTime(item.responseTime)})</Text>
      ) : null}
    </Text>
  );
};
