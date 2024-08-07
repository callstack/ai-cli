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
  removeUnansweredUserContextMessage,
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
    hideActiveView();

    const isCommand = processChatCommand(message);
    if (isCommand) {
      return;
    }

    addUserMessage(message);
    void fetchAiResponse();
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
      if (stream && provider.getChatCompletionStream != null) {
        const response = await provider.getChatCompletionStream(
          providerConfig,
          messages,
          (update: ModelResponseUpdate) => setLoadedResponse(update.content),
        );
        addAiResponse(response);
      } else {
        const response = await provider.getChatCompletion(providerConfig, messages);
        addAiResponse(response);
      }
    } catch (error) {
      // We cannot leave unanswered user message in context, as there is no AI response for it.
      // Inference APIs require that user and assistant messages should be alternating.
      removeUnansweredUserContextMessage();
      addProgramMessage(`Error: ${extractErrorMessage(error)}`, 'error');
    } finally {
      setLoading(false);
      setLoadedResponse(undefined);
    }
  };

  return {
    fetchAiResponse,
    isLoading,
    loadedResponse,
  };
}
