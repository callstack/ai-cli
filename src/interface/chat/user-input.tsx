import React from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

type UserInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  visible: boolean;
};

export const UserInput = ({ value, onChange, onSubmit, visible }: UserInputProps) => {
  return (
    <Box>
      <Text>{visible ? 'Me: ' : 'Me: '}</Text>
      <TextInput focus={visible} value={value} onChange={onChange} onSubmit={onSubmit} />
    </Box>
  );
};
