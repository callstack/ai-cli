import React, { useMemo } from 'react';
import { Box, Text } from 'ink';
import { formatCost, formatSpeed, formatTokenCount } from '../../../format.js';
import { calculateUsageCost } from '../../../engine/session.js';
import { useChatState, type ChatMessage } from '../state/state.js';

type TotalUsage = {
  inputTokens: number;
  outputTokens: number;
  requests: number;
  responseTime: number;
  model: string | undefined;
};

export function StatusBar() {
  const verbose = useChatState((state) => state.verbose);
  const items = useChatState((state) => state.chatMessages);
  const provider = useChatState((state) => state.provider);
  const providerConfig = useChatState((state) => state.providerConfig);

  const totalUsage = useMemo(() => calculateTotalUsage(items), [items]);

  const model = totalUsage.model || providerConfig.model;
  const modelPricing = provider.modelPricing[model] ?? provider.modelPricing[providerConfig.model];
  const totalCost = calculateUsageCost(totalUsage, modelPricing) ?? 0;

  return (
    <Box flexDirection="row" marginTop={1}>
      <Text color={'gray'}>
        LLM: {provider.label}/{model} - Total Cost:{' '}
        {verbose ? formatVerboseStats(totalCost, totalUsage) : formatCost(totalCost)}
      </Text>
    </Box>
  );
}

function formatVerboseStats(cost: number, usage: TotalUsage) {
  const usageOutput = usage
    ? ` (tokens: ${formatTokenCount(usage.inputTokens)} in + ${formatTokenCount(
        usage.outputTokens,
      )} out, requests: ${usage.requests}, speed: ${formatSpeed(usage.outputTokens, usage.responseTime)})`
    : '';
  return `${formatCost(cost)}${usageOutput}`;
}

function calculateTotalUsage(messages: ChatMessage[]): TotalUsage {
  const usage: TotalUsage = {
    inputTokens: 0,
    outputTokens: 0,
    requests: 0,
    responseTime: 0,
    model: undefined,
  };
  messages.forEach((message) => {
    if (message.role === 'assistant') {
      usage.inputTokens += message.usage?.inputTokens ?? 0;
      usage.outputTokens += message.usage?.outputTokens ?? 0;
      usage.requests += message.usage?.requests ?? 0;
      usage.responseTime += message.usage?.responseTime ?? 0;
      usage.model = message.usage?.model ?? usage.model;
    }
  });

  return usage;
}
