import React from 'react';
import { Box, Text } from 'ink';
import { Spinner } from '@inkjs/ui';
import { colors } from '../../../theme/colors.js';

export const ResponseLoader = () => {
  return (
    <Box flexDirection="row">
      <Text color={colors.assistant}>ai: </Text>
      <Spinner type="dots" />
      <Text color={colors.assistant}> Thinking...</Text>
    </Box>
  );
};
