import React, { useState } from 'react';
import { Text } from 'ink';
import { TextInput } from '@inkjs/ui';
import { colors } from '../../../theme/colors.js';

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
      <Text color={colors.initPrompt}>{label}</Text>{' '}
      {submitted ? (
        <Text>{value}</Text>
      ) : (
        <TextInput onChange={handleChange} onSubmit={handleSubmit} />
      )}
      {error ? <Text color="red"> {error}</Text> : null}
    </Text>
  );
};
