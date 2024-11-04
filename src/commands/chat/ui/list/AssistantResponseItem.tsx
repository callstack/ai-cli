import React from 'react';
import { Text } from 'ink';
import type { AssistantResponse } from '@callstack/byorg-core';
import { formatSpeed, formatTime } from '../../../../format.js';
import { colors } from '../../../../theme/colors.js';
import { useChatState } from '../../state/state.js';
import { texts } from '../../texts.js';

interface AssistantResponseItemProps {
  message: AssistantResponse;
}

export function AssistantResponseItem({ message }: AssistantResponseItemProps) {
  const verbose = useChatState((state) => state.verbose);

  return (
    <>
      <Text color={colors.assistant}>
        <Text>{texts.assistantLabel}</Text>
        <Text>{message.content}</Text>

        {verbose && message.usage.responseTime != null ? (
          <Text color={colors.info}>
            {' '}
            ({formatTime(message.usage.responseTime)},{' '}
            {formatSpeed(message.usage?.outputTokens, message.usage.responseTime)})
          </Text>
        ) : null}
      </Text>
      <Text> {/* Add a newline */}</Text>
    </>
  );
}
