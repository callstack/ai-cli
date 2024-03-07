import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { Select } from '@inkjs/ui';
import {
  getProvider,
  providers,
  type Provider,
  type ProviderName,
} from '../engine/providers/provider.js';

type SelectProviderStepProps = {
  label: string;
  onSelect: (provider: Provider) => void;
};

const providerItems = providers.map((p) => ({ label: p.label, value: p.name }));

export const SelectProviderStep = ({ label, onSelect }: SelectProviderStepProps) => {
  const [value, setValue] = useState<Provider>();

  const handleSelect = (name: ProviderName) => {
    const provider = getProvider(name);
    setValue(provider);
    onSelect(provider);
  };

  return (
    <Box flexDirection="column">
      <Text color="cyan">{label}</Text>
      {value ? (
        <Text>{value.label}</Text>
      ) : (
        <Select
          options={providerItems}
          onChange={(provider) => handleSelect(provider as ProviderName)}
        />
      )}
    </Box>
  );
};
