import { CHATS_SAVE_DIRECTORY } from '../../file-utils.js';
import { formatCost, formatSpeed, formatTokenCount } from '../../format.js';
import { getVerbose, outputSystem, outputWarning, setVerbose } from '../../output.js';
import { getProvider, getProviderConfig } from './providers.js';
import { messages, totalUsage } from './state.js';
import { calculateUsageCost } from './usage.js';
import { exit, filterOutApiKey, saveConversation } from './utils.js';

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

  if (command === '/debug') {
    outputDebugInfo();
    return true;
  }

  if (command === '/forget') {
    // Clear all messages
    messages.length = 0;
    outputSystem('Forgot all past messages from the current session.\n');
    return true;
  }

  if (command === '/verbose') {
    setVerbose(!getVerbose());
    outputSystem(`Verbose mode: ${getVerbose() ? 'on' : 'off'}\n`);
    return true;
  }

  if (input === '/save') {
    const saveConversationMessage = saveConversation(messages);
    outputSystem(saveConversationMessage);
    return true;
  }

  outputWarning(`Unknown command: ${command}`);
  return true;
}

export function outputHelp() {
  const lines = [
    'Available commands:',
    '- /exit: Exit the CLI',
    '- /info: Show current provider, model, and system prompt',
    '- /forget: AI will forget previous messages',
    `- /save: Save in a text file in ${CHATS_SAVE_DIRECTORY}`,
    '- /verbose: Toggle verbose output',
    '',
  ];
  outputSystem(lines.join('\n'));
}

export function outputInfo() {
  const provider = getProvider();
  const providerConfig = getProviderConfig();

  const lines = [
    'Session info:',
    `- Provider: ${provider.label}`,
    `- Model: ${providerConfig.model}`,
    `- Cost: ${formatCost(calculateUsageCost(totalUsage, { provider, providerConfig }))}`,
    `- Usage: ${formatTokenCount(totalUsage.inputTokens)} input token(s), ${formatTokenCount(totalUsage.outputTokens)} output token(s), ${totalUsage.requests} request(s)usag`,
    `- Avg Speed: ${formatSpeed(totalUsage.outputTokens, totalUsage.responseTime)}`,
    `- System prompt: ${providerConfig.systemPrompt}`,
    '',
  ];
  outputSystem(lines.join('\n'));
}

export function outputDebugInfo() {
  outputSystem(`Provider: ${toJson(getProvider().label)}\n`);
  outputSystem(`Provider Config: ${toJson(getProviderConfig())}\n`);
  outputSystem(`Messages: ${toJson(messages)}\n`);
  outputSystem(`Usage: ${toJson(totalUsage)}\n`);
}

function toJson(value: any) {
  return JSON.stringify(value, filterOutApiKey, 2);
}
