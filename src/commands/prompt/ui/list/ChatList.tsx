import * as React from 'react';
import { Box } from 'ink';
import { useChatState } from '../../state.js';
import { MessageListItem } from './MessageListItem.js';
import { ProgramOutputListItem } from './ProgramOutputListItem.js';

export function ChatList() {
  const items = useChatState((state) => state.outputMessages);

  return (
    <Box display="flex" flexDirection="column">
      {items.map((item, index) => {
        if (item.type === 'message') {
          return <MessageListItem key={`message-${index}`} item={item} />;
        }

        if (item.type === 'info' || item.type === 'warning') {
          return <ProgramOutputListItem key={`output-${index}`} output={item} />;
        }

        return null;
      })}
    </Box>
  );
}
