import React, { useCallback, useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

type UserInputProps = {
  onSubmit: (value: string) => void;
  visible: boolean;
};

export const UserInput = ({ onSubmit, visible }: UserInputProps) => {
  const [userInput, setUserInput] = useState('');

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
      {visible && <TextInput value={userInput} onChange={setUserInput} onSubmit={handleInput} />}
    </Box>
  );
};
