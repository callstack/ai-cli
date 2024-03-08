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
import type { ModelResponse, SystemMessage } from '../../engine/inference.js';
import { getProvider, type Provider, type ProviderName } from '../../engine/providers/provider.js';
import type { ConfigFile } from '../../config-file.js';
import type { ProviderConfig } from '../../engine/providers/config.js';
import { formatCost, formatTokenCount } from '../../format.js';
import { providerOptionMapping } from './index.js';

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

export function resolveProviderFromOption(providerOption: string): Provider {
  const provider = providerOptionMapping[providerOption];
  if (!provider) {
    throw new Error(`Provider not found: ${providerOption}.`);
  }

  return provider;
}

export function getDefaultProvider(config: ConfigFile): Provider {
  const providerNames = Object.keys(config.providers) as ProviderName[];
  const providerName = providerNames ? providerNames[0] : undefined;

  if (!providerName) {
    throw new Error('No providers found in "~/.airc.json" file.');
  }

  return getProvider(providerName)!;
}
