import React, { useCallback, useEffect, useState } from 'react';
import { Box, Newline, Text } from 'ink';
import type { Message, ModelResponse } from '../../../engine/inference.js';
import type { Session } from '../session.js';
import { calculateUsageCost } from '../../../engine/session.js';
import { saveConversation } from '../utils.js';
import { UserInput } from './user-input.js';
import { Help } from './help.js';
import { TotalStats } from './total-stats.js';
import { InfoOutput } from './info-output.js';
import { ItemList } from './list/item-list.js';
import type { ChatState, DisplayMessageItem } from './types.js';
import { ResponseLoader } from './response-loader.js';

type ChatInterfaceProps = {
  session: Session;
};

export const ChatInterface = ({ session }: ChatInterfaceProps) => {
  const [state, setState] = useState<ChatState>(session.state);

  const [showInfo, setShowInfo] = useState(false);
  const [showUsage, setShowUsage] = useState(
    Boolean(session.options.verbose || session.options.usage),
  );
  const [showCost, setShowCost] = useState(
    Boolean(session.options.verbose || session.options.costs),
  );
  const [showHelp, setShowHelp] = useState(false);
  const [verbose, setVerbose] = useState(Boolean(session.options.verbose));

  const [thinking, setThinking] = useState(false);

  const addUserMessage = useCallback((message: string) => {
    const userMessage: Message = {
      role: 'user',
      content: message,
    };
    setState(({ contextMessages, items }) => ({
      contextMessages: [...contextMessages, userMessage],
      items: [...items, { type: 'message', message: userMessage }],
      showLoader: false,
    }));
    return userMessage;
  }, []);

  const addAiMessage = useCallback((response: ModelResponse) => {
    const aiMessage: DisplayMessageItem = {
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
        showLoader: false,
      };
    });
  }, []);

  const addAiMessagePlaceholder = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      showLoader: true,
    }));
  }, []);

  const getAiResponse = useCallback(async (messages: Message[], message?: string) => {
    setThinking(true);
    const messagesToSend = message ? [...messages, addUserMessage(message)] : messages;
    addAiMessagePlaceholder();
    const aiResponse = await session.provider.getChatCompletion(session.config, messagesToSend);
    addAiMessage(aiResponse);
    setThinking(false);
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
      } else if (message === '/cost') {
        setShowCost(!showCost);
      } else if (message === '/verbose') {
        if (verbose) {
          setShowCost(false);
          setShowUsage(false);
          setVerbose(false);
        } else {
          setShowCost(true);
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
    [state, verbose, showInfo, showHelp, showCost, showUsage],
  );

  return (
    <Box display="flex" flexDirection="column">
      {verbose ? (
        <Text>
          Using provider: {session.provider.label}
          <Newline />
          Using model: {session.config.model}
        </Text>
      ) : null}
      <ItemList items={state.items} />

      {showHelp && <Help />}
      {showInfo && (
        <InfoOutput
          config={session.config}
          messages={state.contextMessages}
          provider={session.provider}
        />
      )}

      {state.showLoader ? (
        <ResponseLoader />
      ) : (
        <UserInput visible={!thinking} onSubmit={onSubmitMessage} />
      )}

      <TotalStats
        showCost={showCost}
        showUsage={showUsage}
        items={state.items}
        pricing={session.provider.pricing[session.config.model]}
      />
    </Box>
  );
};
