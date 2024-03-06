/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Box } from 'ink';

type ChatInterfaceProps = {
  initialPrompt?: string;
};

export const ChatInterface = ({ initialPrompt: _ }: ChatInterfaceProps) => {
  const [verbose, setVerbose] = useState(false);

  return <Box display="flex" flexDirection="column"></Box>;
};
