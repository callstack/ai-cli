import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  CHATS_SAVE_DIRECTORY,
  getConversationStoragePath,
  getDefaultFilename,
  getUniqueFilename,
} from '../../file-utils';
import * as output from '../../output';
import { calculateUsageCost } from '../../providers/session';
import { formatCost } from '../../format';
import type { SessionContext } from './types';

export function processCommand(context: SessionContext, input: string): boolean {
  if (!input.startsWith('/')) {
    return false;
  }

  const [command, ...args] = input.split(' ');
  if (command === '/exit') {
    process.exit(0);
    // No need to return.
  }

  if (command === '/help') {
    output.outputInfo('Available commands:');
    output.outputInfo('- /exit: Exit the CLI');
    output.outputInfo('- /info: Show current provider, model, and system prompt');
    output.outputInfo('- /forget: AI will forget previous messages');
    output.outputInfo(`- /save: Save in a text file in ${CHATS_SAVE_DIRECTORY}`);

    return true;
  }

  if (command === '/info') {
    output.outputInfo(`Provider: ${context.provider.label}`);
    output.outputInfo(`Model: ${context.config?.model}`);
    output.outputInfo('System prompt:', context.config?.systemPrompt);
    output.outputInfo(
      `Total tokens: ${context.totalUsage.inputTokens} in + ${context.totalUsage.outputTokens} out`
    );

    const totalCost = calculateUsageCost(
      context.totalUsage,
      context.provider.pricing[context.config?.model]
    );
    output.outputInfo(`Total cost: ${formatCost(totalCost)}`);

    output.outputVerbose('Current context:', JSON.stringify(context.messages, null, 2));
    return true;
  }

  if (command === '/forget') {
    // Forget all messages from the context.
    context.messages.length = 0;
    output.outputInfo('AI will forget previous messages.', context.messages);
    return true;
  }

  if (command === '/save') {
    if (context.messages.length === 0) {
      output.outputInfo('There are no messages to save.');
      return true;
    }

    try {
      saveConversation(context);
    } catch (error) {
      output.outputError(error);
    }
    return true;
  }

  output.outputError(`Unknown command: ${command} ${args.join(' ')}`);
  return true;
}

function saveConversation(context: SessionContext) {
  let conversation = '';
  context.messages.forEach((message) => {
    conversation += `${message.role}: ${message.content}\n`;
  });

  const conversationStoragePath = getConversationStoragePath();
  const filePath = getUniqueFilename(
    path.join(conversationStoragePath, getDefaultFilename(context))
  );

  fs.writeFileSync(filePath, conversation);

  output.outputInfo(`Conversation saved to ${filePath.replace(os.homedir(), '~')}`);
}
