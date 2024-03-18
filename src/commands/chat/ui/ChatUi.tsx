import React, { useEffect, useState } from 'react';
import { Box } from 'ink';
import { ExitApp } from '../../../components/ExitApp.js';
import { extractErrorMessage } from '../../../output.js';
import { processChatCommand } from '../chat-commands.js';
import { addAiResponse, addProgramMessage, addUserMessage } from '../state/actions.js';
import { useChatState } from '../state/state.js';
import { texts } from '../texts.js';
import { UserMessageInput } from './UserMessageInput.js';
import { HelpOutput } from './HelpOutput.js';
import { StatusBar } from './StatusBar.js';
import { InfoOutput } from './InfoOutput.js';
import { ChatMessageList } from './list/ChatMessageList.js';
import { AiResponseLoader } from './AiResponseLoader.js';

export function ChatUi() {
  const contextMessages = useChatState((state) => state.contextMessages);
  const provider = useChatState((state) => state.provider);
  const providerConfig = useChatState((state) => state.providerConfig);
  const activeView = useChatState((state) => state.activeView);
  const shouldExit = useChatState((state) => state.shouldExit);

  const [loadingResponse, setLoadingResponse] = useState(false);

  const fetchAiResponse = async (isInitial?: boolean) => {
    try {
      setLoadingResponse(true);
      const messages = useChatState.getState().contextMessages;
      const response = await provider.getChatCompletion(providerConfig, messages);
      addAiResponse(response);
      setLoadingResponse(false);
      if (isInitial) {
        addProgramMessage(texts.initialHelp);
      }
    } catch (error) {
      setLoadingResponse(false);
      addProgramMessage(`Error: ${extractErrorMessage(error)}`, 'error');
    }
  };

  // Trigger initial AI response
  useEffect(() => {
    const initialUserMessages = contextMessages.filter((m) => m.role === 'user');
    if (initialUserMessages.length > 0) {
      void fetchAiResponse(true);
    } else {
      addProgramMessage(texts.initialHelp);
    }
  }, []);

  const handleSubmit = (message: string) => {
    try {
      const isCommand = processChatCommand(message);
      if (isCommand) {
        return;
      }

      addUserMessage(message);
      void fetchAiResponse();
    } catch (error) {
      addProgramMessage(`Error: ${extractErrorMessage(error)}`, 'error');
    }
  };

  return (
    <Box display="flex" flexDirection="column">
      <ChatMessageList />

      {activeView === 'help' && <HelpOutput />}
      {activeView === 'info' && <InfoOutput />}

      {loadingResponse ? <AiResponseLoader /> : null}
      {!loadingResponse && !shouldExit && <UserMessageInput onSubmit={handleSubmit} />}

      <StatusBar />
      {shouldExit && <ExitApp />}
    </Box>
  );
}
