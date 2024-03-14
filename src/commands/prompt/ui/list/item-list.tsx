import * as React from 'react';
import { Box } from 'ink';
import type { DisplayItem } from '../types.js';
import { MessageItem } from './message-item.js';
import { OutputItem } from './output-item.js';

interface ItemListProps {
  items: DisplayItem[];
}

export function ItemList({ items }: ItemListProps) {
  return (
    <Box display="flex" flexDirection="column">
      {items.map((item, index) => {
        if (item.type === 'message') {
          return <MessageItem key={`message-${index}`} message={item} />;
        }

        if (item.type === 'info' || item.type === 'warning') {
          return <OutputItem key={`output-${index}`} output={item} />;
        }

        return null;
      })}
    </Box>
  );
}
