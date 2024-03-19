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
import { AiStreamingResponse } from './AiStreamingResponse.js';

export function ChatUi() {
  const contextMessages = useChatState((state) => state.contextMessages);
  const provider = useChatState((state) => state.provider);
  const providerConfig = useChatState((state) => state.providerConfig);
  const activeView = useChatState((state) => state.activeView);
  const shouldExit = useChatState((state) => state.shouldExit);
  const streamingResponse = useChatState((state) => state.streamingResponse);

  const [loadingResponse, setLoadingResponse] = useState(false);

  // @ts-expect-error
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

  const fetchAiResponseStream = async (isInitial?: boolean) => {
    try {
      updateAiResponseStream('');

      const messages = useChatState.getState().contextMessages;
      const stream = provider.getChatCompletionStream!(providerConfig, messages);

      for await (const item of stream) {
        if ('response' in item) {
          addAiResponse(item.response);
        } else if ('update' in item) {
          updateAiResponseStream(item.update.content);
        }
      }

      if (isInitial) {
        addProgramMessage(texts.initialHelp);
      }
    } catch (error) {
      updateAiResponseStream(null);
      addProgramMessage(`Error: ${extractErrorMessage(error)}`, 'error');
    }
  };

  // Trigger initial AI response
  useEffect(() => {
    const initialUserMessages = contextMessages.filter((m) => m.role === 'user');
    if (initialUserMessages.length > 0) {
      void fetchAiResponseStream(true);
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
      void fetchAiResponseStream();
    } catch (error) {
      addProgramMessage(`Error: ${extractErrorMessage(error)}`, 'error');
    }
  };

  const showInput = !loadingResponse && streamingResponse == null && !shouldExit;

  return (
    <Box display="flex" flexDirection="column">
      <ChatMessageList />

      {activeView === 'help' && <HelpOutput />}
      {activeView === 'info' && <InfoOutput />}

      {loadingResponse ? <AiResponseLoader /> : null}
      {streamingResponse != null ? <AiStreamingResponse text={streamingResponse} /> : null}
      {showInput && <UserMessageInput onSubmit={handleSubmit} />}

      <StatusBar />
      {shouldExit && <ExitApp />}
    </Box>
  );
}
