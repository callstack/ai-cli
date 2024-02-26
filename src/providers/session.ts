import type { ModelUsage } from '../inference';
import type { ModelPricing } from './provider';

export interface SessionUsage {
  total: ModelUsage;
  current: ModelUsage;
}

export interface SessionCosts {
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

  const inputCost = ((usage.inputTokens ?? 0) * (pricing.inputTokensCost ?? 0)) / 1000;
  const outputCost = ((usage.outputTokens ?? 0) * (pricing.outputTokensCost ?? 0)) / 1000;
  const requestsCost = ((usage.requests ?? 0) * (pricing.requestsCost ?? 0)) / 1000;
  return inputCost + outputCost + requestsCost;
}

export function calculateSessionCosts(usage: SessionUsage, pricing: ModelPricing | undefined) {
  if (pricing === undefined) {
    return undefined;
  }

  return {
    current: calculateUsageCost(usage.current, pricing)!,
    total: calculateUsageCost(usage.total, pricing)!,
  };
}
