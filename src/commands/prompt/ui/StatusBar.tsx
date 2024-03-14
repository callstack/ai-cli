import React, { useMemo } from 'react';
import { Text } from 'ink';
import type { ModelUsage } from '../../../engine/inference.js';
import { formatCost, formatTokenCount } from '../../../format.js';
import { calculateUsageCost } from '../../../engine/session.js';
import { useChatState } from '../state.js';

export const StatusBar = () => {
  const verbose = useChatState((state) => state.verbose);
  const items = useChatState((state) => state.outputMessages);
  const provider = useChatState((state) => state.provider);
  const providerConfig = useChatState((state) => state.providerConfig);

  const totalUsage = useMemo(() => {
    const usage: ModelUsage = { inputTokens: 0, outputTokens: 0, requests: 0 };
    items.forEach((item) => {
      if (item.type === 'message' && item.message.role === 'assistant') {
        usage.inputTokens += item.usage?.inputTokens ?? 0;
        usage.outputTokens += item.usage?.outputTokens ?? 0;
        usage.requests += item.usage?.requests ?? 0;
      }
    });
    return usage;
  }, [items]);

  const modelPricing = provider.pricing[providerConfig.model];
  const totalCost = calculateUsageCost(totalUsage, modelPricing) ?? 0;

  return (
    <Text color={'gray'}>
      LLM: {provider.label}/{providerConfig.model} - Total Cost:{' '}
      {formatStats(totalCost, verbose ? totalUsage : undefined)}
    </Text>
  );
};

const formatStats = (cost: number, usage?: ModelUsage) => {
  const usageOutput = usage
    ? ` (tokens: ${formatTokenCount(usage.inputTokens)} in + ${formatTokenCount(usage.outputTokens)} out, requests: ${usage.requests})`
    : '';

  return `${formatCost(cost)}${usageOutput}`;
};
