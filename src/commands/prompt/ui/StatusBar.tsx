import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import type { ModelUsage } from '../../../engine/inference.js';
import { formatCost } from '../../../format.js';
import { calculateUsageCost } from '../../../engine/session.js';
import type { ModelPricing } from '../../../engine/providers/provider.js';
import type { Session } from '../session.js';
import type { ChatItem } from './types.js';

type TotalStatsProps = {
  session: Session;
  showUsage: boolean;
  items: ChatItem[];
  pricing: ModelPricing | undefined;
};

export const StatusBar = ({ session, showUsage, items, pricing }: TotalStatsProps) => {
  const [totalUsage, setTotalUsage] = useState<ModelUsage>({
    inputTokens: 0,
    outputTokens: 0,
    requests: 0,
  });
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const usage: ModelUsage = { inputTokens: 0, outputTokens: 0, requests: 0 };
    items.forEach((item) => {
      if (item.type === 'message' && item.message.role === 'assistant') {
        usage.inputTokens += item.usage?.inputTokens ?? 0;
        usage.outputTokens += item.usage?.outputTokens ?? 0;
        usage.requests += item.usage?.requests ?? 0;
      }
    });
    const cost = calculateUsageCost(usage, pricing) ?? 0;

    setTotalUsage(usage);
    setTotalCost(cost);
  }, [items]);

  return (
    <Text color={'gray'}>
      LLM: {session.provider.label}/{session.config.model} - Total Cost:{' '}
      {formatStats(totalCost, showUsage ? totalUsage : undefined)}
    </Text>
  );
};

const formatStats = (cost: number, usage?: ModelUsage) => {
  const usageOutput = usage
    ? ` (tokens: ${usage.inputTokens} in + ${usage.outputTokens} out, requests: ${usage.requests})`
    : '';

  return `${formatCost(cost)}${usageOutput}`;
};
