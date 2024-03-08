import React from 'react';
import { Box, Text } from 'ink';
import { Spinner } from '@inkjs/ui';

type ThinkingProps = {
  thinking: boolean;
};

export const Thinking = ({ thinking }: ThinkingProps) => {
  return thinking ? (
    <Box>
      <Text color={'cyanBright'}>Ai: </Text>
      <Spinner type="dots" />
      <Text color={'cyanBright'}> Thinking...</Text>
    </Box>
  ) : null;
};
