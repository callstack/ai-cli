import React, { useState } from 'react';
import { Text } from 'ink';
import TextInput from 'ink-text-input';

type KeyInputStateProps = {
  label: string;
  onSubmit: (text: string) => void;
  onValidate: (text: string) => string;
};

export const KeyInputStep = ({
  onSubmit: onConfirm,
  onValidate: validate,
  label,
}: KeyInputStateProps) => {
  const [value, setValue] = useState<string>('');

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (text: string) => {
    if (error !== '') {
      setError('');
    }

    setValue(text.trim());
  };

  const handleSubmit = (text: string) => {
    const hasError = validate(text);
    if (hasError) {
      setError(hasError);
    } else {
      setSubmitted(true);
      onConfirm(text);
    }
  };

  return (
    <Text>
      <Text color="cyan">{label}</Text>{' '}
      <TextInput
        value={value}
        focus={!submitted}
        onChange={handleChange}
        onSubmit={handleSubmit}
        showCursor
      />
      {error ? <Text color="red"> {error}</Text> : null}
    </Text>
  );
};
