import React, { useEffect, useState } from 'react';
import { Box } from 'ink';
import { ExitApp } from '../../../components/ExitApp.js';
import { extractErrorMessage } from '../../../output.js';
import { processChatCommand } from '../chat-commands.js';
import {
  addAiResponse,
  addProgramMessage,
  addUserMessage,
  updateAiResponseStream,
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
  const streamingResponse = useChatState((state) => state.streamingResponse);

  const { fetchAiResponse, isLoading } = useAiResponse();

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

  const showInput = !isLoading && streamingResponse == null && !shouldExit;

  return (
    <Box display="flex" flexDirection="column">
      <ChatMessageList />

      {activeView === 'help' && <HelpOutput />}
      {activeView === 'info' && <InfoOutput />}

      {isLoading ? <AiResponseLoader text={streamingResponse} /> : null}
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

  const fetchAiResponse = async (isInitial?: boolean) => {
    try {
      setLoading(true);

      const messages = useChatState.getState().contextMessages;
      const response = await provider.getChatCompletion(providerConfig, messages);
      addAiResponse(response);
      setLoading(false);

      if (isInitial) {
        addProgramMessage(texts.initialHelp);
      }
    } catch (error) {
      setLoading(false);
      addProgramMessage(`Error: ${extractErrorMessage(error)}`, 'error');
    }
  };

  const fetchAiResponseStream = async (isInitial?: boolean) => {
    try {
      setLoading(true);

      const messages = useChatState.getState().contextMessages;
      const stream = provider.getChatCompletionStream!(providerConfig, messages);

      for await (const item of stream) {
        if ('response' in item) {
          addAiResponse(item.response);
          setLoading(false);
        } else if ('update' in item) {
          updateAiResponseStream(item.update.content);
        }
      }

      if (isInitial) {
        addProgramMessage(texts.initialHelp);
      }
    } catch (error) {
      setLoading(false);
      addProgramMessage(`Error: ${extractErrorMessage(error)}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAiResponse: stream ? fetchAiResponseStream : fetchAiResponse,
    isLoading,
  };
}
