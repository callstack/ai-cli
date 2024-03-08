import React from 'react';
import { render } from 'ink';
import type { SessionContext } from '../../commands/prompt/types.js';
import { ChatInterface } from './chat.js';

export const renderChatInterface = (session: SessionContext) => {
  render(<ChatInterface session={session} />);
};
