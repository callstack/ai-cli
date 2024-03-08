import React from 'react';
import { Text } from 'ink';
import Spinner from 'ink-spinner';

type ThinkingProps = {
  thinking: boolean;
};

export const Thinking = ({ thinking }: ThinkingProps) => {
  return thinking ? (
    <Text color={'cyanBright'}>
      <Text>Ai: </Text>
      <Spinner type="dots" />
      <Text> Thinking...</Text>
    </Text>
  ) : null;
};
