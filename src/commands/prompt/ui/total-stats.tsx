import React, { useEffect, useState } from 'react';
import { Text } from 'ink';
import type { ModelUsage } from '../../../engine/inference.js';
import { formatCost } from '../../../format.js';
import { calculateUsageCost } from '../../../engine/session.js';
import type { ModelPricing } from '../../../engine/providers/provider.js';
import type { DisplayItem } from './types.js';

type TotalStatsProps = {
  showCost: boolean;
  showUsage: boolean;
  items: DisplayItem[];
  pricing: ModelPricing | undefined;
};

const formatTotalStats = (
  usage: ModelUsage,
  cost: number,
  showUsage: boolean = false,
  showCost: boolean = false,
) => {
  const output = [];

  if (showUsage && usage) {
    if (usage) {
      output.push(`tokens: ${usage.inputTokens}in + ${usage.outputTokens}out`);
    }
  }

  if (showCost && cost) {
    output.push(`costs: ${formatCost(cost)}`);
  }

  return output.join(', ');
};

export const TotalStats = ({ showCost, showUsage, items, pricing }: TotalStatsProps) => {
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

  return showCost || showUsage ? (
    <Text color={'gray'}>
      Total usage: {formatTotalStats(totalUsage, totalCost, showUsage, showCost)}
    </Text>
  ) : null;
};
