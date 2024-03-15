import * as React from 'react';
import { Box } from 'ink';
import { useChatState } from '../../state/state.js';
import { ProgramChatMessageItem } from './ProgramChatMessageItem.js';
import { UserChatMessageItem } from './UserChatMessageItem.js';
import { AiChatMessageItem } from './AiChatMessageItem.js';

export function ChatMessageList() {
  const messages = useChatState((state) => state.chatMessages);

  return (
    <Box display="flex" flexDirection="column">
      {messages.map((message, index) => {
        if (message.type === 'user') {
          return <UserChatMessageItem key={index} message={message} />;
        }

        if (message.type === 'ai') {
          return <AiChatMessageItem key={index} message={message} />;
        }

        if (message.type === 'program') {
          return <ProgramChatMessageItem key={index} output={message} />;
        }

        return null;
      })}
    </Box>
  );
}
