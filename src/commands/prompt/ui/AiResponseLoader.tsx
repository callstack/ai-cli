import React from 'react';
import { Box, Text } from 'ink';
import { Spinner } from '@inkjs/ui';
import { colors } from '../../../theme/colors.js';
import { texts } from '../texts.js';

export const AiResponseLoader = () => {
  return (
    <Box flexDirection="row">
      <Text color={colors.assistant}>{texts.assistantLabel}</Text>
      <Spinner type="dots" />
      <Text color={colors.assistant}> {texts.responseLoading}</Text>
    </Box>
  );
};
