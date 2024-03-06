import React from 'react';

type WizardProps = {
  steps: Array<React.JSX.Element>;
  currentStep: number;
};

export const Wizard = ({ steps, currentStep }: WizardProps) => {
  return <>{steps.filter((_, index) => index <= currentStep)}</>;
};
