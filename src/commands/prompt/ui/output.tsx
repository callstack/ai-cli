import React from 'react';
import { Text } from 'ink';
import { colors } from '../../../components/colors.js';
import type { DisplayOutputItem } from './prompt-ui.js';

type OutputProps = {
  output: DisplayOutputItem;
};

export function Output({ output }: OutputProps) {
  return (
    <Text color={output.type === 'warning' ? colors.warning : colors.info}>{output.text}</Text>
  );
}
