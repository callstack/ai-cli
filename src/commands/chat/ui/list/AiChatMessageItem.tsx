import React from 'react';
import { Text } from 'ink';
import { formatTime } from '../../../../format.js';
import { colors } from '../../../../theme/colors.js';
import { useChatState, type AiChatMessage } from '../../state/state.js';
import { texts } from '../../texts.js';

interface AiChatMessageItemProps {
  message: AiChatMessage;
}

export function AiChatMessageItem({ message }: AiChatMessageItemProps) {
  const verbose = useChatState((state) => state.verbose);

  return (
    <>
      <Text color={colors.assistant}>
        <Text>{texts.assistantLabel}</Text>
        <Text>{message.text}</Text>

        {verbose && message.responseTime != null ? (
          <Text color={colors.info}> ({formatTime(message.responseTime)})</Text>
        ) : null}
      </Text>
      {verbose ? <Text color={colors.debug}>{JSON.stringify(message.data, null, 2)}</Text> : null}
    </>
  );
}
