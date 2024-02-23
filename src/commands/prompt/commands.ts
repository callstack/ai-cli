import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { Message } from '../../inference';
import * as output from '../../output';
import { getConversationStoragePath } from '../../config-file';
import { getDefaultFileName, getUniqueFileName } from '../../file-utils';

export interface CommandContext {
  messages: Message[];
  providerName: string;
  config: {
    model: string;
    systemPrompt: string;
  };
}

export function processCommand(input: string, context: CommandContext): boolean {
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
    output.outputInfo('- /verbose [on|off]: Enable or disable verbose output');
    output.outputInfo('- /stats [on|off]: Enable or disable displaying of response stats');
    output.outputInfo('- /forget: AI will forget previous messages');
    output.outputInfo('- /save [file]: Conversation will be saved in txt file');

    return true;
  }

  if (command === '/info') {
    output.outputInfo(`Provider: ${context.providerName}, model: ${context.config.model}`);
    output.outputInfo('System prompt:', context.config.systemPrompt);
    output.outputVerbose('Current context:', JSON.stringify(context.messages, null, 2));
    return true;
  }

  if (command === '/verbose') {
    output.setVerbose(args[0] !== 'off');
    output.outputInfo(`Verbose mode: ${output.isVerbose() ? 'on' : 'off'}`);
    return true;
  }

  if (command === '/stats') {
    output.setShowStats(args[0] !== 'off');
    output.outputInfo(`Show stats: ${output.shouldShowStats() ? 'on' : 'off'}`);
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
      saveConversation(context, args);
      return true;
    } catch (error) {
      output.outputError(error);
      return true;
    }
  }

  output.outputError(`Unknown command: ${command} ${args.join(' ')}`);
  return true;
}

function saveConversation(context: CommandContext, args: string[]) {
  const conversation = context.messages.reduce((prev, current) => {
    return prev + `${current.role}: ${current.content}\n`;
  }, '');

  const conversationStoragePath = getConversationStoragePath();
  const fileName = args[0] ? path.parse(args[0]).name : getDefaultFileName(context);
  let filePath = path.join(conversationStoragePath, fileName);

  if (fs.existsSync(`${filePath}.txt`)) {
    output.outputInfo(`${filePath.replace(os.homedir(), '~')} already exists`);
  }

  filePath = getUniqueFileName(path.join(conversationStoragePath, fileName), 'txt');

  fs.writeFileSync(path.normalize(filePath), conversation);

  output.outputInfo(`Conversation saved to ${filePath.replace(os.homedir(), '~')}`);
}
