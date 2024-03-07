import React from 'react';
import { Box } from 'ink';

type WizardProps = {
  children: React.ReactNode;
  step: number;
};

export const Wizard = ({ children, step }: WizardProps) => {
  const steps = React.Children.toArray(children);

  return (
    <Box gap={1} flexDirection="column">
      {steps.filter((_, index) => index <= step)}
    </Box>
  );
};
