import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  DEFAULT_FILE_PROMPT,
  FILE_COST_WARNING,
  FILE_TOKEN_COUNT_WARNING,
} from '../../default-config.js';
import { calculateSessionCost, calculateUsageCost } from '../../engine/session.js';
import { tokenizer } from '../../engine/tokenizer.js';
import * as output from '../../output.js';
import type { Message, ModelResponse, SystemMessage } from '../../engine/inference.js';
import type { ProviderConfig } from '../../engine/providers/config.js';
import type { Provider } from '../../engine/providers/provider.js';
import { formatCost, formatTokenCount } from '../../format.js';
import {
  getConversationStoragePath,
  getDefaultFilename,
  getUniqueFilename,
} from '../../file-utils.js';

export function handleInputFile(inputFile: string, config: ProviderConfig, provider: Provider) {
  const filePath = path.resolve(inputFile.replace('~', os.homedir()));

  if (!fs.existsSync(filePath)) {
    throw new Error(`Couldn't find provided file: ${inputFile}`);
  }

  const fileContent = fs.readFileSync(filePath).toString();
  const fileTokens = tokenizer.getTokensCount(fileContent);

  const pricing = provider.pricing[config.model];
  const fileCost = calculateUsageCost({ inputTokens: fileTokens }, pricing);

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

  return {
    fileContextPrompt: {
      role: 'system',
      content: DEFAULT_FILE_PROMPT.replace('{fileContent}', fileContent),
    } as SystemMessage,
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

export function getOutputParams(
  provider: Provider,
  config: ProviderConfig,
  response: ModelResponse,
): output.OutputAiOptions {
  const usage = {
    total: { inputTokens: 0, outputTokens: 0, requests: 0 },
    current: response.usage,
  };

  const pricing = provider.pricing[response.responseModel] ?? provider.pricing[config.model];
  const cost = calculateSessionCost(usage, pricing);

  return {
    responseTime: response.responseTime,
    usage,
    cost,
  };
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
      return 'me';
    case 'assistant':
      return 'ai';
    case 'system':
      return 'system';
    default:
      return role;
  }
}
