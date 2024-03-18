import React from 'react';
import { Text } from 'ink';
import { colors } from '../../../../theme/colors.js';
import { type UserChatMessage } from '../../state/state.js';
import { texts } from '../../texts.js';

interface UserChatMessageItemProps {
  message: UserChatMessage;
}

export function UserChatMessageItem({ message }: UserChatMessageItemProps) {
  return (
    <Text color={colors.user}>
      <Text>{texts.userLabel}</Text>
      <Text>{message.text}</Text>
    </Text>
  );
}
