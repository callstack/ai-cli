import React from 'react';
import { Newline, Text } from 'ink';
import { CHATS_SAVE_DIRECTORY } from '../../file-utils.js';

type HelpProps = {
  show?: boolean;
};

export const Help = ({ show }: HelpProps) => {
  return show ? (
    <Text>
      Available commands:
      <Newline />
      - /exit: Exit the CLI
      <Newline />
      - /info: Show current provider, model, and system prompt
      <Newline />
      - /forget: AI will forget previous messages
      <Newline />- /save: Save in a text file in {CHATS_SAVE_DIRECTORY}
    </Text>
  ) : null;
};
