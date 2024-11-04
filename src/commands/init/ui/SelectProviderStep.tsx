import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { Select } from '@inkjs/ui';
import {
  getProvider,
  providers,
  type ProviderInfo,
  type ProviderName,
} from '../../../engine/providers/provider-info.js';
import { colors } from '../../../theme/colors.js';

interface SelectProviderStepProps {
  label: string;
  onSelect: (provider: ProviderInfo) => void;
}

const providerItems = providers.map((p) => ({ label: p.label, value: p.name }));

export function SelectProviderStep({ label, onSelect }: SelectProviderStepProps) {
  const [value, setValue] = useState<ProviderInfo>();

  const handleSelect = (name: ProviderName) => {
    const provider = getProvider(name);
    setValue(provider);
    onSelect(provider);
  };

  return (
    <Box flexDirection="column">
      <Box flexDirection="row">
        <Text color={colors.initPrompt}>{label}</Text>
        {value ? <Text> {value.label}</Text> : null}
      </Box>

      {!value ? (
        <Select
          options={providerItems}
          onChange={(provider) => handleSelect(provider as ProviderName)}
        />
      ) : null}
    </Box>
  );
}
