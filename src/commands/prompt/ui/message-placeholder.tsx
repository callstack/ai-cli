import React from 'react';
import { Box, Text } from 'ink';
import { Spinner } from '@inkjs/ui';
import { colors } from '../../../components/colors.js';

export const MessagePlaceholder = () => {
  return (
    <Box>
      <Text color={colors.assistant}>ai: </Text>
      <Spinner type="dots" />
      <Text color={colors.assistant}> Thinking...</Text>
    </Box>
  );
};
