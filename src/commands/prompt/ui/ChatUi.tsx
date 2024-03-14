import React, { useEffect, useState } from 'react';
import { Box } from 'ink';
import { ExitApp } from '../../../components/ExitApp.js';
import type { UserMessage } from '../../../engine/inference.js';
import { processCommand } from '../commands.js';
import { addAiResponse, addUserMessage, setActiveView, useChatState } from '../state.js';
import { UserInput } from './UserInput.js';
import { HelpOutput } from './HelpOutput.js';
import { StatusBar } from './StatusBar.js';
import { InfoOutput } from './InfoOutput.js';
import { ChatList } from './list/ChatList.js';
import { ResponseLoader } from './ResponseLoader.js';

export const ChatUi = () => {
  const contextMessages = useChatState((state) => state.contextMessages);
  const provider = useChatState((state) => state.provider);
  const providerConfig = useChatState((state) => state.providerConfig);
  const activeView = useChatState((state) => state.activeView);
  const shouldExit = useChatState((state) => state.shouldExit);

  const [loadingResponse, setLoadingResponse] = useState(false);

  const fetchAiResponse = async () => {
    setLoadingResponse(true);
    const messages = useChatState.getState().contextMessages;
    const response = await provider.getChatCompletion(providerConfig, messages);
    addAiResponse(response);
    setLoadingResponse(false);
  };

  // Trigger initial AI response
  useEffect(() => {
    const lastMessage = contextMessages[contextMessages.length - 1];
    if (lastMessage?.role === 'user') {
      void fetchAiResponse();
    }
  }, []);

  const handleSubmit = (message: string) => {
    const isCommand = processCommand(message);
    if (isCommand) {
      return;
    }

    const userMessage: UserMessage = { role: 'user', content: message ?? '' };
    addUserMessage(userMessage);
    setActiveView(null);
    void fetchAiResponse();
  };

  return (
    <Box display="flex" flexDirection="column">
      <ChatList />
      {activeView === 'help' && <HelpOutput />}
      {activeView === 'info' && <InfoOutput />}
      {loadingResponse ? <ResponseLoader /> : null}
      {!loadingResponse && !shouldExit && <UserInput onSubmit={handleSubmit} />}

      <StatusBar />

      {shouldExit && <ExitApp />}
    </Box>
  );
};
