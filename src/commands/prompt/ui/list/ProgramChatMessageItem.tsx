import React from 'react';
import { Text } from 'ink';
import { colors } from '../../../../theme/colors.js';
import type { ProgramChatMessage } from '../../state.js';

type ProgramChatMessageItemProps = {
  output: ProgramChatMessage;
};

export function ProgramChatMessageItem({ output }: ProgramChatMessageItemProps) {
  if (output.level === 'error') {
    return <Text color={colors.error}>{output.text}</Text>;
  }

  if (output.level === 'warning') {
    return <Text color={colors.warning}>{output.text}</Text>;
  }

  if (output.level === 'info') {
    return <Text color={colors.info}>{output.text}</Text>;
  }

  if (output.level === 'debug') {
    return <Text color={colors.debug}>{output.text}</Text>;
  }

  return null;
}
