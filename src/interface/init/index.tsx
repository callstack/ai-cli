import React from 'react';
import { render } from 'ink';
import { InitInterface } from './init-interface.js';

type InitProps = {
  configExists: boolean;
};

export const renderInitInterface = ({ configExists }: InitProps) => {
  render(<InitInterface configExists={configExists} />);
};
