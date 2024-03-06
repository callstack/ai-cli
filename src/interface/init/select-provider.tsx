import React, { useCallback, useMemo, useState } from 'react';
import { Text } from 'ink';
import SelectInput from 'ink-select-input';
import { getProvider, type Provider } from '../../engine/providers/provider.js';
import type { ProviderItem } from './types.js';

type SelectProviderProps = {
  onSelect: (provider: Provider) => void;
};

export const SelectProvider = ({ onSelect }: SelectProviderProps) => {
  const [selected, setSelected] = useState<ProviderItem>();

  const handleSelect = useCallback((provider: ProviderItem) => {
    setSelected(provider);
    onSelect(getProvider(provider.value));
  }, []);

  const items = useMemo<Array<ProviderItem>>(
    () => [
      { label: 'OpenAI', value: 'openAi' },
      { label: 'Perplexity', value: 'perplexity' },
    ],
    []
  );

  return (
    <>
      <Text color="blue">Which inference provider would you like to use:</Text>
      {selected ? (
        <Text>{selected.label}</Text>
      ) : (
        <SelectInput items={items} onSelect={handleSelect} />
      )}
    </>
  );
};
