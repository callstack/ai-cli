import React from 'react';
import { Text } from 'ink';
import type { UserMessage } from '@callstack/byorg-core';
import { colors } from '../../../../theme/colors.js';
import { texts } from '../../texts.js';

interface UserChatMessageItemProps {
  message: UserMessage;
}

export function UserMessageItem({ message }: UserChatMessageItemProps) {
  return (
    <Text color={colors.user}>
      <Text>{texts.userLabel}</Text>
      <Text>{message.content}</Text>
    </Text>
  );
}
