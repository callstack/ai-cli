import React from 'react';
import { Text } from 'ink';
import { ConfirmInput } from '@inkjs/ui';
import { colors } from './colors.js';

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
      <Text color={colors.initPrompt}>{label}</Text>{' '}
      {value === undefined ? (
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
        </Text>
      ) : null}
      {value === true ? <Text>Yes</Text> : null}
      {value === false ? <Text>No</Text> : null}
    </Text>
  );
}
