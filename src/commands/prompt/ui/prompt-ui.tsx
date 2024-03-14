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

type ChatInterfaceProps = {
  session: Session;
};

export const ChatInterface = ({ session }: ChatInterfaceProps) => {
  const [chatSession, setChatSession] = useState<ChatState>(session.chatSession);

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
    setChatSession(({ contextMessages: messages, items: displayItems }) => ({
      contextMessages: [...messages, userMessage],
      items: [...displayItems, { type: 'message', message: userMessage }],
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
    setChatSession(({ contextMessages: messages, items: displayItems }) => {
      const hasPlaceholder = displayItems[displayItems.length - 1]?.type === 'placeholder';
      if (hasPlaceholder) {
        const displayItemsWithoutPlaceholder = displayItems.slice(0, displayItems.length - 1);
        return {
          contextMessages: [...messages, aiMessage.message],
          items: [...displayItemsWithoutPlaceholder, aiMessage],
        };
      } else {
        return {
          contextMessages: [...messages, aiMessage.message],
          items: [...displayItems, aiMessage],
        };
      }
    });
  }, []);

  const addAiMessagePlaceholder = useCallback(() => {
    setChatSession(({ contextMessages: messages, items: displayItems }) => ({
      contextMessages: messages,
      items: [...displayItems, { type: 'placeholder' }],
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
    const lastMessage = chatSession.contextMessages[chatSession.contextMessages.length - 1];
    if (lastMessage?.role === 'user') {
      void getAiResponse(chatSession.contextMessages);
    }
  }, []);

  const onSubmitMessage = useCallback(
    (message: string) => {
      if (message === '/exit') {
        process.exit(0);
      } else if (message === '/help') {
        setShowHelp(!showHelp);
      } else if (message === '/info') {
        setShowInfo(!showInfo);
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
        setChatSession(({ items: displayItems }) => ({
          items: [...displayItems, { type: 'info', text: 'AI will forget previous messages.' }],
          contextMessages: [],
        }));
      } else if (message === '/save') {
        const saveConversationMessage = saveConversation(chatSession.contextMessages);
        setChatSession(({ contextMessages: messages, items: displayItems }) => ({
          contextMessages: messages,
          items: [...displayItems, { type: 'info', text: saveConversationMessage }],
        }));
      } else {
        setShowHelp(false);
        setShowInfo(false);
        void getAiResponse(chatSession.contextMessages, message);
      }
    },
    [chatSession, verbose, showInfo, showHelp, showCost, showUsage],
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
      <Box display="flex" flexDirection="column">
        <ItemList items={chatSession.items} />

        {showHelp && <Help />}
        {showInfo && (
          <InfoOutput
            config={session.config}
            messages={chatSession.contextMessages}
            provider={session.provider}
          />
        )}
      </Box>
      <UserInput visible={!thinking} onSubmit={onSubmitMessage} />
      <TotalStats
        showCost={showCost}
        showUsage={showUsage}
        items={chatSession.items}
        pricing={session.provider.pricing[session.config.model]}
      />
    </Box>
  );
};
