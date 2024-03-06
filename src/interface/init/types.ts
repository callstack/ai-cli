import type { ProviderName } from '../../engine/providers/provider.js';

export type Item = {
  label: string;
  value: string;
};

export type ProviderItem = {
  label: string;
  value: ProviderName;
};
