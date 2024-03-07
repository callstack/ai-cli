import React from 'react';
import { Text } from 'ink';
import { ConfirmInput } from '@inkjs/ui';

interface ConfirmStepProps {
  label: string;
  defaultChoice?: 'confirm' | 'cancel';
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function ConfirmStep({ label, defaultChoice, onConfirm, onCancel }: ConfirmStepProps) {
  const [value, setValue] = React.useState<boolean | undefined>(undefined);

  return (
    <Text>
      <Text color="cyan">{label}</Text>{' '}
      <Text>
        {`[`}
        <ConfirmInput
          isDisabled={value !== undefined}
          defaultChoice={defaultChoice}
          onConfirm={() => {
            setValue(true);
            onConfirm?.();
          }}
          onCancel={() => {
            setValue(false);
            onCancel?.();
          }}
        />
        {`]`}

        {value === true ? <Text> Yes</Text> : null}
        {value === false ? <Text> No</Text> : null}
      </Text>
    </Text>
  );
}
