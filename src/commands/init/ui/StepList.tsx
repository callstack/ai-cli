import React from 'react';
import { Box } from 'ink';

interface StepListProps {
  children: React.ReactNode;
  step: number;
}

export function StepList({ children, step }: StepListProps) {
  const steps = React.Children.toArray(children);

  return (
    <Box gap={1} flexDirection="column">
      {steps.filter((_, index) => index <= step)}
    </Box>
  );
}
