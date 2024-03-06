import React, { useCallback, useMemo, useState } from 'react';
import { Text } from 'ink';
import SelectInput from 'ink-select-input';
import type { Item } from './types.js';

type ConfirmProps = {
  onSelect: (didConfirm: boolean) => void;
  description: string;
  displayOnYes?: string;
  displayOnNo?: string;
};

export const Confirm = ({ onSelect, description, displayOnYes, displayOnNo }: ConfirmProps) => {
  const [selected, setSelected] = useState<Item>();

  const handleSelect = useCallback((item: Item) => {
    setSelected(item);
    onSelect;
    if (item.value === 'yes') {
      onSelect(true);
    } else {
      onSelect(false);
    }
  }, []);

  const items = useMemo(
    () => [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    []
  );

  return (
    <>
      <Text color="blue">{description}</Text>
      {selected ? (
        <Text>{selected.label}</Text>
      ) : (
        <SelectInput items={items} onSelect={handleSelect} />
      )}
      {displayOnYes && selected?.value === 'yes' ? <Text>{displayOnYes}</Text> : null}
      {displayOnNo && selected?.value === 'no' ? <Text>{displayOnNo}</Text> : null}
    </>
  );
};
