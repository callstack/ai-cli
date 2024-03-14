import React from 'react';
import { Text } from 'ink';
import { colors } from '../../../../components/colors.js';
import type { DisplayOutputItem } from '../types.js';

type OutputItemProps = {
  output: DisplayOutputItem;
};

export function OutputItem({ output }: OutputItemProps) {
  return (
    <Text color={output.type === 'warning' ? colors.warning : colors.info}>{output.text}</Text>
  );
}
