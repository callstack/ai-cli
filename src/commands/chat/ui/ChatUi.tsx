import React, { useEffect, useState } from 'react';
import { Box } from 'ink';
import { ExitApp } from '../../../components/ExitApp.js';
import { extractErrorMessage } from '../../../output.js';
import { processChatCommand } from '../chat-commands.js';
import {
  addAssistantResponse,
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
import { AssistantResponseLoader } from './AssistantResponseLoader.js';

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

      {isLoading ? <AssistantResponseLoader text={loadedResponse} /> : null}
      {showInput && <UserMessageInput onSubmit={handleSubmit} />}

      <StatusBar />
      {shouldExit && <ExitApp />}
    </Box>
  );
}

function useAiResponse() {
  const app = useChatState((state) => state.app);
  const stream = useChatState((state) => state.stream);

  const [isLoading, setLoading] = useState(false);
  const [loadedResponse, setLoadedResponse] = useState<string | undefined>(undefined);

  const fetchAiResponse = async () => {
    try {
      setLoading(true);
      setLoadedResponse(undefined);

      const messages = useChatState.getState().contextMessages;

      const { response } = await app.processMessages(messages, {
        onPartialResponse: stream ? (update) => setLoadedResponse(update) : undefined,
      });

      if (response.role == 'assistant') {
        addAssistantResponse(response);
      } else {
        addProgramMessage(response.content);
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
