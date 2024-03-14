import React from 'react';
import { Text } from 'ink';
import { colors } from '../../../../theme/colors.js';
import type { ProgramOutputItem } from '../types.js';

type ProgramOutputListItemProps = {
  output: ProgramOutputItem;
};

export function ProgramOutputListItem({ output }: ProgramOutputListItemProps) {
  return (
    <Text color={output.type === 'warning' ? colors.warning : colors.info}>{output.text}</Text>
  );
}
