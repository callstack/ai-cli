import * as React from 'react';
import { Box, Static } from 'ink';
import { useChatState, type ChatMessage } from '../../state/state.js';
import { ProgramChatMessageItem } from './ProgramChatMessageItem.js';
import { UserChatMessageItem } from './UserChatMessageItem.js';
import { AiChatMessageItem } from './AiChatMessageItem.js';

export function ChatMessageList() {
  const messages = useChatState((state) => state.chatMessages);

  const olderMessages = messages.slice(0, -1);
  const latestMessage = messages[messages.length - 1];

  return (
    <Box display="flex" flexDirection="column">
      <Static items={olderMessages}>{renderMessage}</Static>

      {latestMessage ? renderMessage(latestMessage, messages.length - 1) : null}
    </Box>
  );
}

function renderMessage(message: ChatMessage, index: number): React.ReactNode {
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
}
