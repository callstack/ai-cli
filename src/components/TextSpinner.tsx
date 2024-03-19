import React from 'react';
import { Text } from 'ink';
import { useComponentTheme, useSpinner, type UseSpinnerProps } from '@inkjs/ui';

export function TextSpinner({ type }: UseSpinnerProps) {
  const { frame } = useSpinner({ type });
  const { styles } = useComponentTheme('Spinner');

  return <Text {...styles?.frame?.()}>{frame}</Text>;
}
