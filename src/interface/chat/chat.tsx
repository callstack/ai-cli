import React, { useCallback, useEffect, useState } from 'react';
import { Box, Newline, Text } from 'ink';
import { getChatCompletion } from '../../commands/prompt/run.js';
import type { Message, ModelResponse } from '../../engine/inference.js';
import { getOutputParams } from '../../commands/prompt/utils.js';
import type { SessionContext } from '../../commands/prompt/types.js';
import { ChatMessage, type DisplayMessage } from './chat-message.js';
import { UserInput } from './user-input.js';
import { Help } from './help.js';

type ChatInterfaceProps = {
  session: SessionContext;
};

export const ChatInterface = ({ session }: ChatInterfaceProps) => {
  const [verbose, setVerbose] = useState(false);
  const [showUsage, setShowUsage] = useState(false);
  const [showCost, setShowCost] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>(session.messages);
  const [thinking, setThinking] = useState(false);
  const [displayHelp, setDisplayHelp] = useState(false);

  const addUserMessage = useCallback((message: string) => {
    const userMessage: Message = {
      role: 'user',
      content: message,
    };
    setMessages((messages) => [...messages, userMessage]);
    return userMessage;
  }, []);

  const addAiMessage = useCallback((response: ModelResponse) => {
    const aiMessage: DisplayMessage = {
      role: 'assistant',
      content: response.messageText ?? '',
      stats: getOutputParams(session.provider, session.config, response),
    };
    setMessages((messages) => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.content === '' && lastMessage.role === 'assistant') {
        const messagesWithoutPlaceholder = messages.slice(0, messages.length - 1);
        return [...messagesWithoutPlaceholder, aiMessage];
      } else {
        return [...messages, aiMessage];
      }
    });
  }, []);

  const addAiMessagePlaceholder = useCallback(() => {
    const aiMessage: DisplayMessage = {
      role: 'assistant',
      content: '',
    };

    setMessages((messages) => [...messages, aiMessage]);
  }, []);

  const getAiResponse = useCallback(async (messages: Message[], message?: string) => {
    setThinking(true);
    const messagesToSend = message ? [...messages, addUserMessage(message)] : messages;
    addAiMessagePlaceholder();
    const aiResponse = await getChatCompletion(session.provider, session.config, messagesToSend);
    addAiMessage(aiResponse);
    setThinking(false);
  }, []);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'user') {
      void getAiResponse(messages);
    }
  }, []);

  const onSubmitMessage = useCallback(
    (message: string) => {
      if (message === '/help') {
        setDisplayHelp(!displayHelp);
      } else if (message === '/verbose') {
        setVerbose(!verbose);
      } else if (message === '/usage') {
        setShowUsage(!showUsage);
      } else if (message === '/cost') {
        setShowCost(!showCost);
      } else {
        setDisplayHelp(false);
        void getAiResponse(messages, message);
      }
    },
    [messages, verbose, displayHelp, showUsage],
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
        {messages.map((message, index) => (
          <ChatMessage
            key={`${index}-${message.content}`}
            message={message}
            usage={showUsage}
            cost={showCost}
          />
        ))}
      </Box>
      <Help show={displayHelp} />
      <UserInput visible={!thinking} onSubmit={onSubmitMessage} />
      {/* <Text color={'gray'}>Total usage: {messages.length}</Text> */}
    </Box>
  );
};
