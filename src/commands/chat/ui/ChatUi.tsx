import React, { useEffect, useState } from 'react';
import { Box } from 'ink';
import { ExitApp } from '../../../components/ExitApp.js';
import type { ModelResponseUpdate } from '../../../engine/inference.js';
import { extractErrorMessage } from '../../../output.js';
import { processChatCommand } from '../chat-commands.js';
import {
  addAiResponse,
  addProgramMessage,
  addUserMessage,
  hideActiveView,
} from '../state/actions.js';
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
  const activeView = useChatState((state) => state.activeView);
  const shouldExit = useChatState((state) => state.shouldExit);

  const { fetchAiResponse, isLoading, loadedResponse } = useAiResponse();

  // Trigger initial AI response
  useEffect(() => {
    const initialUserMessages = contextMessages.filter((m) => m.role === 'user');
    if (initialUserMessages.length > 0) {
      // eslint-disable-next-line promise/prefer-await-to-then
      void fetchAiResponse().then(() => addProgramMessage(texts.initialHelp));
    } else {
      addProgramMessage(texts.initialHelp);
    }
  }, []);

  const handleSubmit = (message: string) => {
    try {
      hideActiveView();

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

  const showInput = !isLoading && !shouldExit;

  return (
    <Box display="flex" flexDirection="column">
      <ChatMessageList />

      {activeView === 'help' && <HelpOutput />}
      {activeView === 'info' && <InfoOutput />}

      {isLoading ? <AiResponseLoader text={loadedResponse} /> : null}
      {showInput && <UserMessageInput onSubmit={handleSubmit} />}

      <StatusBar />
      {shouldExit && <ExitApp />}
    </Box>
  );
}

function useAiResponse() {
  const provider = useChatState((state) => state.provider);
  const providerConfig = useChatState((state) => state.providerConfig);
  const stream = useChatState((state) => state.stream);

  const [isLoading, setLoading] = useState(false);
  const [loadedResponse, setLoadedResponse] = useState<string | undefined>(undefined);

  const fetchAiResponse = async () => {
    try {
      setLoading(true);
      setLoadedResponse(undefined);

      const messages = useChatState.getState().contextMessages;
      const response = await provider.getChatCompletion(providerConfig, messages);
      addAiResponse(response);

      setLoading(false);
      setLoadedResponse(undefined);
    } catch (error) {
      setLoading(false);
      setLoadedResponse(undefined);
      addProgramMessage(`Error: ${extractErrorMessage(error)}`, 'error');
    }
  };

  const fetchAiResponseStream = async () => {
    try {
      setLoading(true);
      setLoadedResponse(undefined);

      const onResponseUpdate = (update: ModelResponseUpdate) => {
        setLoadedResponse(update.content);
      };

      const messages = useChatState.getState().contextMessages;
      const response = await provider.getChatCompletionStream!(
        providerConfig,
        messages,
        onResponseUpdate,
      );

      setLoading(false);
      addAiResponse(response);
    } catch (error) {
      setLoading(false);
      setLoadedResponse(undefined);
      addProgramMessage(`Error: ${extractErrorMessage(error)}`, 'error');
    }
  };

  return {
    fetchAiResponse: stream ? fetchAiResponseStream : fetchAiResponse,
    isLoading,
    loadedResponse,
  };
}
