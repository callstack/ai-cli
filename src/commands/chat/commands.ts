import { CHATS_SAVE_DIRECTORY } from '../../file-utils.js';
import { getVerbose, output, outputVerbose, outputWarning, setVerbose } from './output.js';
import { getProvider, getProviderConfig } from './providers.js';
import { messages } from './state.js';
import { exit, saveConversation } from './utils.js';

export function processChatCommand(input: string) {
  if (!input.startsWith('/')) {
    return false;
  }

  const command = input.split(' ')[0];
  if (command === '/exit') {
    exit();
  }

  if (command === '/help') {
    outputHelp();
    return true;
  }

  if (command === '/info') {
    outputInfo();
    return true;
  }

  if (command === '/forget') {
    // Clear all messages
    messages.length = 0;
    return true;
  }

  if (command === '/verbose') {
    setVerbose(!getVerbose());
    output(`Verbose mode: ${getVerbose() ? 'on' : 'off'}`);
    return true;
  }

  if (input === '/save') {
    const saveConversationMessage = saveConversation(messages);
    output(saveConversationMessage);
    return true;
  }

  outputWarning(`Unknown command: ${command}`);
  return true;
}

export function outputHelp() {
  const lines = [
    '',
    'Available commands:',
    ' - /exit: Exit the CLI',
    ' - /info: Show current provider, model, and system prompt',
    ' - /forget: AI will forget previous messages',
    ` - /save: Save in a text file in ${CHATS_SAVE_DIRECTORY}`,
    ' - /verbose: Toggle verbose output',
    '',
  ];

  output(lines.join('\n'));
}

export function outputInfo() {
  const provider = getProvider();
  const providerConfig = getProviderConfig();

  const lines = [
    '',
    'Info:',
    ` - Provider: ${provider.label}`,
    ` - Model: ${providerConfig.model}`,
    ` - System prompt: ${providerConfig.systemPrompt}`,
    '',
  ];
  output(lines.join('\n'));

  const rawMessages = JSON.stringify(
    messages.map((m) => `${m.role}: ${m.content}`),
    null,
    2,
  );
  outputVerbose(`Messages: ${rawMessages}\n`);
}
