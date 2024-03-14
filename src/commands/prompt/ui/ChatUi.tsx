import React, { useEffect, useState } from 'react';
import { Box } from 'ink';
import { ExitApp } from '../../../components/ExitApp.js';
import type { UserMessage } from '../../../engine/inference.js';
import {
  addAiResponse,
  addProgramMessage,
  addUserMessage,
  forgetContextMessages,
  setVerbose,
  useChatState,
} from '../state.js';
import { saveConversation } from '../utils.js';
import { UserInput } from './UserInput.js';
import { HelpOutput } from './HelpOutput.js';
import { StatusBar } from './StatusBar.js';
import { InfoOutput } from './InfoOutput.js';
import { ChatList } from './list/ChatList.js';
import { ResponseLoader } from './ResponseLoader.js';

type ActiveView = 'info' | 'help' | null;

export const ChatUi = () => {
  const contextMessages = useChatState((state) => state.contextMessages);
  const outputMessages = useChatState((state) => state.outputMessages);
  const verbose = useChatState((state) => state.verbose);
  const provider = useChatState((state) => state.provider);
  const providerConfig = useChatState((state) => state.providerConfig);

  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [shouldExit, setShouldExit] = useState(false);

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

  const processCommand = (input: string) => {
    if (!input.startsWith('/')) {
      return false;
    }

    const command = input.split(' ')[0];

    if (command === '/exit') {
      addProgramMessage({ type: 'info', text: 'Bye!' });
      setShouldExit(true);
      return true;
    }

    if (command === '/help') {
      setActiveView('help');
      return true;
    }

    if (command === '/info') {
      setActiveView('info');
      return true;
    }

    setActiveView(null);
    if (command === '/verbose') {
      setVerbose(!verbose);
      addProgramMessage({ type: 'info', text: `Verbose mode: ${verbose ? 'off' : 'on'}` });
      return true;
    }

    if (command === '/forget') {
      forgetContextMessages();
      addProgramMessage({ type: 'info', text: 'AI will forget previous messages.' });
      return true;
    }

    if (input === '/save') {
      const saveConversationMessage = saveConversation(contextMessages);
      addProgramMessage({ type: 'info', text: saveConversationMessage });
      return true;
    }

    addProgramMessage({ type: 'warning', text: `Unknown command ${command}` });
    return true;
  };

  return (
    <Box display="flex" flexDirection="column">
      <ChatList items={outputMessages} verbose={verbose} />
      {activeView === 'help' && <HelpOutput />}
      {activeView === 'info' && (
        <InfoOutput
          config={providerConfig}
          messages={contextMessages}
          provider={provider}
          verbose={verbose}
        />
      )}
      {loadingResponse ? <ResponseLoader /> : null}
      {!loadingResponse && !shouldExit && <UserInput onSubmit={handleSubmit} />}

      <StatusBar />

      {shouldExit && <ExitApp />}
    </Box>
  );
};
