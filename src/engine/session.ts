import type { ModelUsage } from '@callstack/byorg-core';
import type { ModelPricing } from './providers/provider.js';

export interface SessionUsage {
  total: ModelUsage;
  current: ModelUsage;
}

export interface SessionCost {
  total: number;
  current: number;
}

export function combineUsage(usage1: ModelUsage, usage2: ModelUsage) {
  return {
    inputTokens: usage1.inputTokens + usage2.inputTokens,
    outputTokens: usage1.outputTokens + usage2.outputTokens,
    requests: usage1.requests + usage2.requests,
  };
}

export function calculateUsageCost(usage: Partial<ModelUsage>, pricing: ModelPricing | undefined) {
  if (pricing === undefined) {
    return undefined;
  }

  const inputCost = ((usage.inputTokens ?? 0) * (pricing.inputTokensCost ?? 0)) / 1_000_000;
  const outputCost = ((usage.outputTokens ?? 0) * (pricing.outputTokensCost ?? 0)) / 1_000_000;
  const requestsCost = ((usage.requests ?? 0) * (pricing.requestsCost ?? 0)) / 1_000_000;
  return inputCost + outputCost + requestsCost;
}

export function calculateSessionCost(usage: SessionUsage, pricing: ModelPricing | undefined) {
  if (pricing === undefined) {
    return undefined;
  }

  return {
    current: calculateUsageCost(usage.current, pricing)!,
    total: calculateUsageCost(usage.total, pricing)!,
  };
}
