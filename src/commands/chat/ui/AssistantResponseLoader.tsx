import React from 'react';
import { Text } from 'ink';
import { TextSpinner } from '../../../components/TextSpinner.js';
import { colors } from '../../../theme/colors.js';
import { texts } from '../texts.js';

interface AssistantResponseLoaderProps {
  text?: string;
}

export function AssistantResponseLoader({ text }: AssistantResponseLoaderProps) {
  return (
    <Text color={colors.assistant}>
      <Text color={colors.assistant}>{texts.assistantLabel}</Text>
      {text ? (
        <>
          {text} <TextSpinner type="sand" />
        </>
      ) : (
        <>
          <TextSpinner type="sand" /> {texts.responseLoading}
        </>
      )}
    </Text>
  );
}
