import React, { useCallback } from 'react';
import { Box, Text } from 'ink';
import { TextInput } from '@inkjs/ui';

type UserInputProps = {
  onSubmit: (value: string) => void;
  visible: boolean;
};

export const UserInput = ({ onSubmit, visible }: UserInputProps) => {
  const handleInput = useCallback(
    (text: string) => {
      if (text.trim() === '') {
        return;
      } else {
        onSubmit(text.trim());
      }
    },
    [onSubmit],
  );

  return (
    <Box>
      <Text>{visible ? 'Me: ' : 'Me: '}</Text>
      {visible ? <TextInput onSubmit={handleInput} /> : null}
    </Box>
  );
};
