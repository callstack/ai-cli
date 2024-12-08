import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { Message } from '@callstack/byorg-core';
import {
  DEFAULT_FILE_PROMPT,
  FILE_COST_WARNING,
  FILE_TOKEN_COUNT_WARNING,
} from '../../default-config.js';
import { getTokensCount } from '../../engine/tokenizer.js';
import type { ProviderConfig } from '../../engine/providers/config.js';
import type { Provider } from '../../engine/providers/provider.js';
import { formatCost, formatTokenCount } from '../../format.js';
import {
  getConversationStoragePath,
  getDefaultFilename,
  getUniqueFilename,
} from '../../file-utils.js';
import { texts } from './texts.js';
import { closeInput } from './input.js';
import { calculateUsageCost } from './usage.js';

export function exit() {
  closeInput();
  process.exit(0);
}

interface HandleInputFileResult {
  systemPrompt: string;
  costWarning: string | null;
  costInfo: string | null;
}

export function handleInputFile(
  inputFile: string,
  providerConfig: ProviderConfig,
  provider: Provider,
): HandleInputFileResult {
  const filePath = path.resolve(inputFile.replace('~', os.homedir()));

  if (!fs.existsSync(filePath)) {
    throw new Error(`Couldn't find provided file: ${inputFile}`);
  }

  const fileContent = fs.readFileSync(filePath).toString();
  const fileTokens = getTokensCount(fileContent);
  const fileCost = calculateUsageCost({ inputTokens: fileTokens }, { provider, providerConfig });

  let costWarning = null;
  let costInfo = null;

  const costOrTokens = fileCost
    ? formatCost(fileCost)
    : `~${formatTokenCount(fileTokens, 100)} tokens`;
  if ((fileCost ?? 0) >= FILE_COST_WARNING || fileTokens >= FILE_TOKEN_COUNT_WARNING) {
    costWarning = `Using the provided file will increase conversation costs by ${costOrTokens} per message.`;
  } else {
    costInfo = `Using the provided file will increase conversation costs by ${costOrTokens} per message.`;
  }

  const content = DEFAULT_FILE_PROMPT.replace('{filename}', path.basename(filePath)).replace(
    '{fileContent}',
    fileContent,
  );

  return {
    systemPrompt: content,
    costWarning,
    costInfo,
  };
}

export function filterOutApiKey(key: string, value: unknown) {
  if (key === 'apiKey' && typeof value === 'string') {
    return value ? '***' : '';
  }

  return value;
}

export function saveConversation(messages: Message[]) {
  let conversation = '';
  messages.forEach((message) => {
    conversation += `${roleToLabel(message.role)}: ${message.content}\n\n`;
  });

  const conversationStoragePath = getConversationStoragePath();
  const filePath = getUniqueFilename(
    path.join(conversationStoragePath, getDefaultFilename(messages)),
  );

  fs.writeFileSync(filePath, conversation);

  return `Conversation saved to ${filePath.replace(os.homedir(), '~')}`;
}

function roleToLabel(role: Message['role']): string {
  switch (role) {
    case 'user':
      return texts.userLabel;
    case 'assistant':
      return texts.assistantLabel;
    default:
      return role;
  }
}
