import * as React from 'react';
import { Box } from 'ink';
import type { ChatItem } from '../types.js';
import { MessageListItem } from './MessageListItem.js';
import { ProgramOutputListItem } from './ProgramOutputListItem.js';

interface ChatListProps {
  items: ChatItem[];
  verbose?: boolean;
}

export function ChatList({ items, verbose }: ChatListProps) {
  return (
    <Box display="flex" flexDirection="column">
      {items.map((item, index) => {
        if (item.type === 'message') {
          return <MessageListItem key={`message-${index}`} item={item} verbose={verbose} />;
        }

        if (item.type === 'info' || item.type === 'warning') {
          return <ProgramOutputListItem key={`output-${index}`} output={item} />;
        }

        return null;
      })}
    </Box>
  );
}