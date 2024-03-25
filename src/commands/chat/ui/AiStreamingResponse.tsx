import React from 'react';
import { Text } from 'ink';
import { TextSpinner } from '../../../components/TextSpinner.js';
import { colors } from '../../../theme/colors.js';
import { texts } from '../texts.js';

interface AiStreamingResponseProps {
  text: string;
}

export function AiStreamingResponse({ text }: AiStreamingResponseProps) {
  return (
    <Text color={colors.assistant}>
      <Text color={colors.assistant}>{texts.assistantLabel}</Text>
      {!!text && <Text>{text} </Text>}
      <TextSpinner type="sand" />
    </Text>
  );
}
