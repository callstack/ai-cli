import React, { useEffect, useState } from 'react';
import { Box } from 'ink';
import { ExitApp } from '../../../components/ExitApp.js';
import type { Message, ModelResponse } from '../../../engine/inference.js';
import type { Session } from '../session.js';
import { calculateUsageCost } from '../../../engine/session.js';
import { saveConversation } from '../utils.js';
import { UserInput } from './UserInput.js';
import { HelpOutput } from './HelpOutput.js';
import { StatusBar } from './StatusBar.js';
import { InfoOutput } from './InfoOutput.js';
import { ChatList } from './list/ChatList.js';
import type { ChatState, MessageItem, ProgramOutputItem } from './types.js';
import { ResponseLoader } from './ResponseLoader.js';

type ChatUiProps = {
  session: Session;
};

type ActiveView = 'info' | 'help' | null;

export const ChatUi = ({ session }: ChatUiProps) => {
  const [state, setState] = useState<ChatState>(session.state);
  const [activeView, setActiveView] = useState<ActiveView>(null);
  const [verbose, setVerbose] = useState(Boolean(session.options.verbose));
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [shouldExit, setShouldExit] = useState(false);

  const addProgramOutput = (item: ProgramOutputItem) => {
    setState((prevState) => ({
      ...prevState,
      items: [...prevState.items, item],
    }));
  };

  const addUserMessage = (message: string) => {
    const userMessage: Message = {
      role: 'user',
      content: message,
    };
    setState(({ contextMessages, items }) => ({
      contextMessages: [...contextMessages, userMessage],
      items: [...items, { type: 'message', message: userMessage }],
    }));
    return userMessage;
  };

  const addAiMessage = (response: ModelResponse) => {
    const aiMessage: MessageItem = {
      type: 'message',
      message: {
        role: 'assistant',
        content: response.messageText ?? '',
      },
      usage: response.usage,
      cost: calculateUsageCost(response.usage, session.provider.pricing[session.config.model]),
      responseTime: response.responseTime,
    };
    setState((prevState) => {
      return {
        ...prevState,
        contextMessages: [...prevState.contextMessages, aiMessage.message],
        items: [...prevState.items, aiMessage],
      };
    });
  };

  const fetchAiResponse = async (messages: Message[], message?: string) => {
    setLoadingResponse(true);
    const messagesToSend = message ? [...messages, addUserMessage(message)] : messages;
    const aiResponse = await session.provider.getChatCompletion(session.config, messagesToSend);
    addAiMessage(aiResponse);
    setLoadingResponse(false);
  };

  // Trigger initial AI response
  useEffect(() => {
    const lastMessage = state.contextMessages[state.contextMessages.length - 1];
    if (lastMessage?.role === 'user') {
      void fetchAiResponse(state.contextMessages);
    }
  }, []);

  const handleSubmit = (message: string) => {
    const isCommand = processCommand(message);
    if (isCommand) {
      return;
    }

    setActiveView(null);
    void fetchAiResponse(state.contextMessages, message);
  };

  const processCommand = (input: string) => {
    if (!input.startsWith('/')) {
      return false;
    }

    const command = input.split(' ')[0];

    if (command === '/exit') {
      addProgramOutput({ type: 'info', text: 'Bye!' });
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
      addProgramOutput({ type: 'info', text: `Verbose mode: ${verbose ? 'off' : 'on'}` });
      return true;
    }

    if (command === '/forget') {
      setState((prevState) => ({
        ...prevState,
        items: [...prevState.items, { type: 'info', text: 'AI will forget previous messages.' }],
        contextMessages: [],
      }));
      return true;
    }

    if (input === '/save') {
      const saveConversationMessage = saveConversation(state.contextMessages);
      addProgramOutput({ type: 'info', text: saveConversationMessage });
      return true;
    }

    addProgramOutput({ type: 'warning', text: `Unknown command ${command}` });
    return true;
  };

  return (
    <Box display="flex" flexDirection="column">
      <ChatList items={state.items} verbose={verbose} />
      {activeView === 'help' && <HelpOutput />}
      {activeView === 'info' && (
        <InfoOutput
          config={session.config}
          messages={state.contextMessages}
          provider={session.provider}
          verbose={verbose}
        />
      )}
      {loadingResponse ? <ResponseLoader /> : null}
      {!loadingResponse && !shouldExit && <UserInput onSubmit={handleSubmit} />}

      <StatusBar
        session={session}
        verbose={verbose}
        items={state.items}
        pricing={session.provider.pricing[session.config.model]}
      />

      {shouldExit && <ExitApp />}
    </Box>
  );
};
