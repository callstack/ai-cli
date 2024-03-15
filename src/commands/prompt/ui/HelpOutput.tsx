import React from 'react';
import { Box, Newline, Text } from 'ink';
import { CHATS_SAVE_DIRECTORY } from '../../../file-utils.js';

export function HelpOutput() {
  return (
    <Box marginTop={1}>
      <Text color="grey">
        Available commands:
        <Newline /> - /exit: Exit the CLI
        <Newline /> - /info: Show current provider, model, and system prompt
        <Newline /> - /forget: AI will forget previous messages
        <Newline /> - /save: Save in a text file in {CHATS_SAVE_DIRECTORY}
        <Newline /> - /verbose: Toggle verbose-level output
      </Text>
    </Box>
  );
}
