import React, { useCallback, useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

type UserInputProps = {
  onSubmit: (value: string) => void;
};

export const UserInput = ({ onSubmit }: UserInputProps) => {
  const [value, setUserInput] = useState('');

  const handleInput = useCallback(
    (text: string) => {
      if (text.trim() === '') {
        return;
      } else {
        onSubmit(text.trim());
        setUserInput('');
      }
    },
    [onSubmit],
  );

  return (
    <Box>
      <Text>{'me: '}</Text>
      <TextInput value={value} onChange={setUserInput} onSubmit={handleInput} />
    </Box>
  );
};
