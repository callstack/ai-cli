import React, { useMemo } from 'react';
import { Box, Text } from 'ink';
import type { ModelUsage } from '../../../engine/inference.js';
import { formatCost, formatTokenCount } from '../../../format.js';
import { calculateUsageCost } from '../../../engine/session.js';
import { useChatState } from '../state/state.js';

export function StatusBar() {
  const verbose = useChatState((state) => state.verbose);
  const items = useChatState((state) => state.chatMessages);
  const provider = useChatState((state) => state.provider);
  const providerConfig = useChatState((state) => state.providerConfig);

  const totalUsage = useMemo(() => {
    const usage: ModelUsage = { inputTokens: 0, outputTokens: 0, requests: 0 };
    items.forEach((item) => {
      if (item.type === 'ai') {
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
    <Box flexDirection="row" marginTop={1}>
      <Text color={'gray'}>
        LLM: {provider.label}/{providerConfig.model} - Total Cost:{' '}
        {formatStats(totalCost, verbose ? totalUsage : undefined)}
      </Text>
    </Box>
  );
}

const formatStats = (cost: number, usage?: ModelUsage) => {
  const usageOutput = usage
    ? ` (tokens: ${formatTokenCount(usage.inputTokens)} in + ${formatTokenCount(usage.outputTokens)} out, requests: ${usage.requests})`
    : '';

  return `${formatCost(cost)}${usageOutput}`;
};
