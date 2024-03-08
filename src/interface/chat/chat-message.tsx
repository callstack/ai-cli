import React from 'react';
import { Text } from 'ink';
import type { Message } from '../../engine/inference.js';
import { formatSessionCost, formatSessionStats } from '../../format.js';
import type { OutputAiOptions } from '../../output.js';

export type DisplayMessage = Message & {
  stats?: OutputAiOptions;
};

type ChatMessageProps = {
  message: DisplayMessage;
  usage?: boolean;
  cost?: boolean;
};

const formatStats = (stats: OutputAiOptions, usage: boolean = false, cost: boolean = false) => {
  const statsOutput = usage ? formatSessionStats(stats.responseTime, stats.usage) : undefined;
  const costsOutput = cost ? formatSessionCost(stats.cost) : undefined;

  const formatted = [statsOutput, costsOutput].filter((x) => x !== undefined).join(', ');
  return formatted;
};

export const ChatMessage = ({ message, usage, cost }: ChatMessageProps) => {
  return (
    <Text color={message.role === 'assistant' ? 'cyanBright' : 'gray'}>
      <Text>{message.role === 'assistant' ? 'Ai: ' : 'Me: '}</Text>
      <Text>{message.content}</Text>
      {(usage || cost) && message.stats ? (
        <Text color={'gray'}> {formatStats(message.stats, usage, cost)}</Text>
      ) : null}
    </Text>
  );
};
