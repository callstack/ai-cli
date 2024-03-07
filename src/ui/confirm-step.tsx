import React from 'react';
import { Text } from 'ink';
import { ConfirmInput } from '@inkjs/ui';

interface ConfirmStepProps {
  label: string;
  value: boolean | undefined;
  defaultValue?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmStep({ label, value, defaultValue, onConfirm, onCancel }: ConfirmStepProps) {
  const defaultChoice = defaultValue === true ? 'confirm' : 'cancel';

  return (
    <Text>
      <Text color="blue">{label}</Text>{' '}
      <Text>
        {`[`}
        <ConfirmInput
          isDisabled={value !== undefined}
          defaultChoice={defaultChoice}
          onConfirm={onConfirm}
          onCancel={onCancel}
        />
        {`]`}

        {value === true ? <Text> Yes</Text> : null}
        {value === false ? <Text> No</Text> : null}
      </Text>
    </Text>
  );
}
