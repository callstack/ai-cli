import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

type UserInputProps = {
  onSubmit: (value: string) => void;
};

export const UserInput = ({ onSubmit }: UserInputProps) => {
  const [value, setUserInput] = useState('');

  const handleSubmit = (text: string) => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    onSubmit(trimmedText);
    setUserInput('');
  };

  return (
    <Box flexDirection="row">
      <Text>{'me: '}</Text>
      <TextInput value={value} onChange={setUserInput} onSubmit={handleSubmit} />
    </Box>
  );
};
