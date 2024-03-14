import React, { useCallback, useEffect, useState } from 'react';
import { Box } from 'ink';
import type { Message, ModelResponse } from '../../../engine/inference.js';
import type { Session } from '../session.js';
import { calculateUsageCost } from '../../../engine/session.js';
import { saveConversation } from '../utils.js';
import { UserInput } from './user-input.js';
import { HelpOutput } from './HelpOutput.js';
import { StatusBar } from './StatusBar.js';
import { InfoOutput } from './InfoOutput.js';
import { ChatList } from './list/ChatList.js';
import type { ChatState, MessageItem } from './types.js';
import { ResponseLoader } from './ResponseLoader.js';

type ChatUiProps = {
  session: Session;
};

export const ChatUi = ({ session }: ChatUiProps) => {
  const [state, setState] = useState<ChatState>(session.state);

  const [showUsage, setShowUsage] = useState(Boolean(session.options.usage));
  const [verbose, setVerbose] = useState(Boolean(session.options.verbose));
  const [showInfo, setShowInfo] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [loadingResponse, setLoadingResponse] = useState(false);

  const addUserMessage = useCallback((message: string) => {
    const userMessage: Message = {
      role: 'user',
      content: message,
    };
    setState(({ contextMessages, items }) => ({
      contextMessages: [...contextMessages, userMessage],
      items: [...items, { type: 'message', message: userMessage }],
    }));
    return userMessage;
  }, []);

  const addAiMessage = useCallback((response: ModelResponse) => {
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
  }, []);

  const getAiResponse = useCallback(async (messages: Message[], message?: string) => {
    setLoadingResponse(true);
    const messagesToSend = message ? [...messages, addUserMessage(message)] : messages;
    const aiResponse = await session.provider.getChatCompletion(session.config, messagesToSend);
    addAiMessage(aiResponse);
    setLoadingResponse(false);
  }, []);

  useEffect(() => {
    const lastMessage = state.contextMessages[state.contextMessages.length - 1];
    if (lastMessage?.role === 'user') {
      void getAiResponse(state.contextMessages);
    }
  }, []);

  const onSubmitMessage = useCallback(
    (message: string) => {
      if (message === '/exit') {
        process.exit(0);
      } else if (message === '/help') {
        setShowHelp(!showHelp);
        setShowInfo(false);
      } else if (message === '/info') {
        setShowInfo(!showInfo);
        setShowHelp(false);
      } else if (message === '/usage') {
        setShowUsage(!showUsage);
      } else if (message === '/verbose') {
        if (verbose) {
          setShowUsage(false);
          setVerbose(false);
        } else {
          setShowUsage(true);
          setVerbose(true);
        }
      } else if (message === '/forget') {
        setState((prevState) => ({
          ...prevState,
          items: [...prevState.items, { type: 'info', text: 'AI will forget previous messages.' }],
          contextMessages: [],
        }));
      } else if (message === '/save') {
        const saveConversationMessage = saveConversation(state.contextMessages);
        setState((prevState) => ({
          ...prevState,
          items: [...prevState.items, { type: 'info', text: saveConversationMessage }],
        }));
      } else {
        setShowHelp(false);
        setShowInfo(false);
        void getAiResponse(state.contextMessages, message);
      }
    },
    [state, verbose, showInfo, showHelp, showUsage],
  );

  return (
    <Box display="flex" flexDirection="column">
      <ChatList items={state.items} />

      {showHelp && <HelpOutput />}

      {showInfo && (
        <InfoOutput
          config={session.config}
          messages={state.contextMessages}
          provider={session.provider}
          verbose={verbose}
        />
      )}

      {loadingResponse ? <ResponseLoader /> : <UserInput onSubmit={onSubmitMessage} />}

      <StatusBar
        session={session}
        showUsage={showUsage}
        items={state.items}
        pricing={session.provider.pricing[session.config.model]}
      />
    </Box>
  );
};
