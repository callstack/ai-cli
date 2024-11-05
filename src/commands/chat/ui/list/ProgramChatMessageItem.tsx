import React from 'react';
import { Text } from 'ink';
import { colors } from '../../../../theme/colors.js';
import { useChatState, type ProgramOutput } from '../../state/state.js';

interface ProgramOutputItemProps {
  output: ProgramOutput;
}

export function ProgramOutputItem({ output }: ProgramOutputItemProps) {
  const verbose = useChatState((state) => state.verbose);

  if (output.level === 'error') {
    return <Text color={colors.error}>{output.content}</Text>;
  }

  if (output.level === 'warning') {
    return <Text color={colors.warning}>{output.content}</Text>;
  }

  if (output.level === 'info') {
    return <Text color={colors.info}>{output.content}</Text>;
  }

  if (verbose && output.level === 'debug') {
    return <Text color={colors.debug}>{output.content}</Text>;
  }

  return null;
}
