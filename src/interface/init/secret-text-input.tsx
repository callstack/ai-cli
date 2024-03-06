import React, { useState } from 'react';
import { Text } from 'ink';
import TextInput from 'ink-text-input';

type SecretTextInputProps = {
  description: string;
  onConfirm: (text: string) => void;
  validate: (text: string) => string;
};

export const SecretTextInput = ({ onConfirm, validate, description }: SecretTextInputProps) => {
  const [confirmed, setConfirmed] = useState(false);
  const [secret, setSecret] = useState<string>('');
  const [error, setError] = useState('');

  const handleChange = (text: string) => {
    if (error !== '') {
      setError('');
    }
    setSecret(text);
  };

  const handleConfirm = (text: string) => {
    const hasError = validate(text);
    if (hasError) {
      setError(hasError);
    } else {
      setConfirmed(true);
      onConfirm(text);
    }
  };

  return (
    <>
      <Text color="blue">{description}</Text>
      {error !== '' ? <Text color="red">{error}</Text> : null}
      {confirmed ? (
        <Text>Received API Key</Text>
      ) : (
        <TextInput value={secret} onChange={handleChange} onSubmit={handleConfirm} mask="*" />
      )}
    </>
  );
};
