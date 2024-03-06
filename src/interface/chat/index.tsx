import React from 'react';
import { render } from 'ink';
import { ChatInterface } from './chat.js';

type ChatProps = {
  initialPrompt?: string;
};

export const renderChatInterface = ({ initialPrompt }: ChatProps) => {
  render(<ChatInterface initialPrompt={initialPrompt} />);
};
