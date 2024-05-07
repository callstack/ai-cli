import React from 'react';
import { Text } from 'ink';
//import { any, buildRegExp, capture, negativeLookahead, zeroOrMore } from 'ts-regex-builder';
import { formatSpeed, formatTime } from '../../../../format.js';
import { Markdown } from '../../../../components/Markdown.js';
import { colors } from '../../../../theme/colors.js';
import { useChatState, type AiChatMessage } from '../../state/state.js';
import { texts } from '../../texts.js';

interface AiChatMessageItemProps {
  message: AiChatMessage;
}

export function AiChatMessageItem({ message }: AiChatMessageItemProps) {
  const verbose = useChatState((state) => state.verbose);

  return (
    <>
      <Text color={colors.assistant}>
        <Text>{texts.assistantLabel}</Text>
        <Markdown>{message.text}</Markdown>

        {verbose && message.responseTime != null ? (
          <Text color={colors.info}>
            {' '}
            ({formatTime(message.responseTime)},{' '}
            {formatSpeed(message.usage?.outputTokens, message.responseTime)})
          </Text>
        ) : null}
      </Text>
      {verbose ? <Text color={colors.debug}>{JSON.stringify(message.data, null, 2)}</Text> : null}
      <Text> {/* Add a newline */}</Text>
    </>
  );
}

// const asteriskNextToChar = /[^\s*]/;

// const boldRegex = buildRegExp(
//   [
//     '**',
//     negativeLookahead('*'),
//     capture([asteriskNextToChar, zeroOrMore(any, { greedy: false }), asteriskNextToChar]),
//     '**',
//     negativeLookahead('*'),
//   ],
//   { global: true },
// );

// const italicsRegex = buildRegExp(
//   [
//     '*',
//     negativeLookahead('*'),
//     capture([asteriskNextToChar, zeroOrMore(any, { greedy: false }), asteriskNextToChar]),
//     '*',
//     negativeLookahead('*'),
//   ],
//   { global: true },
// );

// function processMessage(message: string) {
//   const result1 = message.split(boldRegex);

//   text = text.replace(normalItalicsRegex, '_$1_');
//   text = text.replace(normalBoldRegex, '*$1*');

//   return (
//     <>
//       <AiChatMessageItem message={message} />
//     </>
//   );
// }
