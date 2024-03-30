import React, { useMemo } from 'react';
import { Box, Text } from 'ink';
import type { ModelUsage } from '../../../engine/inference.js';
import { formatCost, formatSpeed, formatTokenCount } from '../../../format.js';
import { calculateUsageCost } from '../../../engine/session.js';
import { useChatState, type ChatMessage } from '../state/state.js';

export function StatusBar() {
  const verbose = useChatState((state) => state.verbose);
  const items = useChatState((state) => state.chatMessages);
  const provider = useChatState((state) => state.provider);
  const providerConfig = useChatState((state) => state.providerConfig);

  const totalUsage = useMemo(() => calculateTotalUsage(items), [items]);
  const totalTime = useMemo(() => calculateTotalResponseTime(items), [items]);

  const modelPricing = provider.pricing[providerConfig.model];
  const totalCost = calculateUsageCost(totalUsage, modelPricing) ?? 0;

  return (
    <Box flexDirection="row" marginTop={1}>
      <Text color={'gray'}>
        LLM: {provider.label}/{providerConfig.model} - Total Cost:{' '}
        {formatStats(totalCost, verbose ? totalUsage : undefined, verbose ? totalTime : undefined)}
      </Text>
    </Box>
  );
}

function formatStats(cost: number, usage?: ModelUsage, time?: number) {
  const usageOutput = usage
    ? ` (tokens: ${formatTokenCount(usage.inputTokens)} in + ${formatTokenCount(usage.outputTokens)} out, requests: ${usage.requests}, speed: ${formatSpeed(usage.outputTokens, time)})`
    : '';
  return `${formatCost(cost)}${usageOutput}`;
}

function calculateTotalUsage(messages: ChatMessage[]) {
  const usage: ModelUsage = { inputTokens: 0, outputTokens: 0, requests: 0 };
  messages.forEach((message) => {
    if (message.type === 'ai') {
      usage.inputTokens += message.usage?.inputTokens ?? 0;
      usage.outputTokens += message.usage?.outputTokens ?? 0;
      usage.requests += message.usage?.requests ?? 0;
    }
  });
  return usage;
}

function calculateTotalResponseTime(messages: ChatMessage[]) {
  let total = 0;
  messages.forEach((message) => {
    if (message.type === 'ai') {
      total += message.responseTime ?? 0;
    }
  });
  return total;
}
