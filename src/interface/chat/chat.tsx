import React, { useCallback, useEffect, useState } from 'react';
import { Box, Newline, Text } from 'ink';
import { getChatCompletion } from '../../commands/prompt/run.js';
import type { Message, ModelResponse } from '../../engine/inference.js';
import { getOutputParams } from '../../commands/prompt/utils.js';
import type { SessionContext } from '../../commands/prompt/types.js';
import { ChatMessage, type DisplayMessage } from './chat-message.js';
import { Thinking } from './thinking.js';
import { UserInput } from './user-input.js';
import { Help } from './help.js';

type ChatInterfaceProps = {
  session: SessionContext;
};

export const ChatInterface = ({ session }: ChatInterfaceProps) => {
  const [verbose, setVerbose] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showUsage, setShowUsage] = useState(false);
  const [showCost, setShowCost] = useState(false);
  const [messages, setMessages] = useState<DisplayMessage[]>(session.messages);
  const [thinking, setThinking] = useState(false);
  const [displayHelp, setDisplayHelp] = useState(false);

  const addMessage = useCallback(
    (message: string, role: 'assistant' | 'user') => {
      const userMessage: Message = {
        role: role,
        content: message,
      };
      setMessages([...messages, userMessage]);
    },
    [messages]
  );

  const addAiMessage = useCallback(
    (response: ModelResponse) => {
      const aiMessage: DisplayMessage = {
        role: 'assistant',
        content: response.messageText ?? '',
        stats: getOutputParams(session.provider, session.config, response),
      };
      setThinking(false);
      setMessages([...messages, aiMessage]);
    },
    [messages]
  );

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
        setMessages(messages);
      } else {
        setDisplayHelp(false);
        addMessage(message, 'user');
      }

      setUserInput('');
    },
    [addMessage, messages, verbose, displayHelp, showUsage]
  );

  const getAiResponse = useCallback(
    async (messages: Message[]) => {
      const aiResponse = await getChatCompletion(session.provider, session.config, messages);
      addAiMessage(aiResponse);
    },
    [addAiMessage]
  );

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === 'user') {
      setThinking(true);
      void getAiResponse(messages);
    }
  }, [messages]);

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
        {messages.map((message, index) => {
          return (
            <ChatMessage
              key={`${index}-${message.content}`}
              message={message}
              usage={showUsage}
              cost={showCost}
            />
          );
        })}
      </Box>
      <Thinking thinking={thinking} />
      <Help show={displayHelp} />
      <UserInput
        visible={!thinking}
        value={userInput}
        onChange={setUserInput}
        onSubmit={onSubmitMessage}
      />
      <Text color={'gray'}>Total usage: {messages.length}</Text>
    </Box>
  );
};
