import * as React from 'react';
import { Box, Static } from 'ink';
import { useChatState, type ChatMessage } from '../../state/state.js';
import { UserMessageItem } from './UserChatMessageItem.js';
import { AssistantResponseItem } from './AssistantResponseItem.js';
import { ProgramOutputItem } from './ProgramChatMessageItem.js';

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
  if (message.role === 'user') {
    return <UserMessageItem key={index} message={message} />;
  }

  if (message.role === 'assistant') {
    return <AssistantResponseItem key={index} message={message} />;
  }

  if (message.role === 'program') {
    return <ProgramOutputItem key={index} output={message} />;
  }

  return null;
}
