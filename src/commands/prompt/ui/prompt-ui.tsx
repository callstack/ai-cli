import React, { useCallback, useEffect, useState } from 'react';
import { Box, Newline, Text } from 'ink';
import type { Message, ModelResponse, ModelUsage } from '../../../engine/inference.js';
import type { Session } from '../session.js';
import { calculateUsageCost } from '../../../engine/session.js';
import { saveConversation } from '../utils.js';
import { ChatMessage } from './chat-message.js';
import { UserInput } from './user-input.js';
import { Help } from './help.js';
import { TotalStats } from './total-stats.js';
import { InfoOutput } from './info-output.js';
import { MessagePlaceholder } from './message-placeholder.js';
import { Output } from './output.js';

type ChatInterfaceProps = {
  session: Session;
};

export interface ChatSession {
  messages: Message[];
  displayItems: DisplayItem[];
}

export type DisplayItem = DisplayMessageItem | DisplayOutputItem;

export interface DisplayMessageItem {
  type: 'message';
  message: Message;
  usage?: ModelUsage;
  cost?: number;
  responseTime?: number;
}

export interface DisplayOutputItem {
  type: 'warning' | 'info' | 'placeholder';
  text?: string;
}

export const ChatInterface = ({ session }: ChatInterfaceProps) => {
  const [chatSession, setChatSession] = useState<ChatSession>(session.chatSession);

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
    setChatSession(({ messages, displayItems }) => ({
      messages: [...messages, userMessage],
      displayItems: [...displayItems, { type: 'message', message: userMessage }],
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
    setChatSession(({ messages, displayItems }) => {
      const hasPlaceholder = displayItems[displayItems.length - 1]?.type === 'placeholder';
      if (hasPlaceholder) {
        const displayItemsWithoutPlaceholder = displayItems.slice(0, displayItems.length - 1);
        return {
          messages: [...messages, aiMessage.message],
          displayItems: [...displayItemsWithoutPlaceholder, aiMessage],
        };
      } else {
        return {
          messages: [...messages, aiMessage.message],
          displayItems: [...displayItems, aiMessage],
        };
      }
    });
  }, []);

  const addAiMessagePlaceholder = useCallback(() => {
    setChatSession(({ messages, displayItems }) => ({
      messages,
      displayItems: [...displayItems, { type: 'placeholder' }],
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
    const lastMessage = chatSession.messages[chatSession.messages.length - 1];
    if (lastMessage?.role === 'user') {
      void getAiResponse(chatSession.messages);
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
        setChatSession(({ displayItems }) => ({
          displayItems: [
            ...displayItems,
            { type: 'info', text: 'AI will forget previous messages.' },
          ],
          messages: [],
        }));
      } else if (message === '/save') {
        const saveConversationMessage = saveConversation(chatSession.messages);
        setChatSession(({ messages, displayItems }) => ({
          messages,
          displayItems: [...displayItems, { type: 'info', text: saveConversationMessage }],
        }));
      } else {
        setShowHelp(false);
        setShowInfo(false);
        void getAiResponse(chatSession.messages, message);
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
        {chatSession.displayItems.map((displayItem, index) => {
          if (displayItem.type === 'message') {
            return (
              <ChatMessage
                key={`message-${index}`}
                message={displayItem}
                showUsage={showUsage}
                showCost={showCost}
              />
            );
          }
          if (displayItem.type === 'placeholder') {
            return <MessagePlaceholder key={`placeholder-${index}`} />;
          }
          if (displayItem.type === 'info' || displayItem.type === 'warning') {
            return <Output key={`output-${index}`} output={displayItem} />;
          }

          return null;
        })}

        {showHelp && <Help />}
        {showInfo && (
          <InfoOutput
            config={session.config}
            messages={chatSession.messages}
            provider={session.provider}
          />
        )}
      </Box>
      <UserInput visible={!thinking} onSubmit={onSubmitMessage} />
      <TotalStats
        showCost={showCost}
        showUsage={showUsage}
        items={chatSession.displayItems}
        pricing={session.provider.pricing[session.config.model]}
      />
    </Box>
  );
};
