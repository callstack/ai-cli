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
import { formatCost, formatTokenCount } from '../../format.js';
import type { ModelResponse } from '../../engine/inference.js';
import { getProvider, type Provider, type ProviderName } from '../../engine/providers/provider.js';
import type { ConfigFile } from '../../config-file.js';
import type { SessionContext } from './types.js';
import { providerOptionMapping } from './index.js';

export function handleInputFile(context: SessionContext, inputFile: string) {
  const filePath = path.resolve(inputFile.replace('~', os.homedir()));

  if (!fs.existsSync(filePath)) {
    throw new Error(`Couldn't find provided file: ${inputFile}`);
  }

  const fileContent = fs.readFileSync(filePath).toString();
  const fileTokens = tokenizer.getTokensCount(fileContent);

  const pricing = context.provider.pricing[context.config.model];
  const fileCost = calculateUsageCost({ inputTokens: fileTokens }, pricing);

  const costOrTokens = fileCost
    ? formatCost(fileCost)
    : `~${formatTokenCount(fileTokens, 100)} tokens`;
  if ((fileCost ?? 0) >= FILE_COST_WARNING || fileTokens >= FILE_TOKEN_COUNT_WARNING) {
    output.outputWarning(
      `Using the provided file will increase conversation costs by ${costOrTokens} per message.`,
    );
  } else {
    output.outputInfo(
      `Using the provided file will increase conversation costs by ${costOrTokens} per message.`,
    );
  }

  context.messages.push({
    role: 'system',
    content: DEFAULT_FILE_PROMPT.replace('{fileContent}', fileContent),
  });
}

export function filterOutApiKey(key: string, value: unknown) {
  if (key === 'apiKey' && typeof value === 'string') {
    return value ? '***' : '';
  }

  return value;
}

export function getOutputParams(
  session: SessionContext,
  response: ModelResponse,
): output.OutputAiOptions {
  const usage = {
    total: session.totalUsage,
    current: response.usage,
  };

  const pricing =
    session.provider.pricing[response.responseModel] ??
    session.provider.pricing[session.config.model];
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
