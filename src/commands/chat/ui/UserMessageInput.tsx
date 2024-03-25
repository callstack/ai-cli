import React, { useState } from 'react';
import { Text } from 'ink';
import TextInput from 'ink-text-input';
import { texts } from '../texts.js';

interface UserMessageInputProps {
  onSubmit: (value: string) => void;
}

export function UserMessageInput({ onSubmit }: UserMessageInputProps) {
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
    <Text>
      <Text>{texts.userLabel}</Text>
      <TextInput value={value} onChange={setUserInput} onSubmit={handleSubmit} />
    </Text>
  );
}
