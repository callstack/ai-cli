import { ModelUsage } from '@callstack/byorg-core';
import { Provider } from '../../engine/providers/provider.js';
import { ProviderConfig } from '../../engine/providers/config.js';

export type CostContext = {
  provider: Provider;
  providerConfig: ProviderConfig;
};

export function calculateUsageCost(usage: Partial<ModelUsage>, context: CostContext) {
  const pricing = getModelPricing(usage, context);
  if (pricing === undefined) {
    return undefined;
  }

  const inputCost = ((usage.inputTokens ?? 0) * (pricing.inputTokensCost ?? 0)) / 1_000_000;
  const outputCost = ((usage.outputTokens ?? 0) * (pricing.outputTokensCost ?? 0)) / 1_000_000;
  const requestsCost = ((usage.requests ?? 0) * (pricing.requestsCost ?? 0)) / 1_000_000;
  return inputCost + outputCost + requestsCost;
}

function getModelPricing(usage: Partial<ModelUsage>, { provider, providerConfig }: CostContext) {
  return (
    provider.modelPricing[usage.model ?? providerConfig.model] ??
    provider.modelPricing[providerConfig.model]
  );
}
