import React from 'react';
import { Text } from 'ink';
import { colors } from '../../../../theme/colors.js';
import { type UserChatMessage } from '../../state.js';
import { texts } from '../../texts.js';

type UserChatMessageItemProps = {
  message: UserChatMessage;
};

export const UserChatMessageItem = ({ message }: UserChatMessageItemProps) => {
  return (
    <Text color={colors.user}>
      <Text>{texts.userLabel}</Text>
      <Text>{message.text}</Text>
    </Text>
  );
};
