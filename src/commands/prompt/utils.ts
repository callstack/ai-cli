import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import {
  DEFAULT_FILE_PROMPT,
  FILE_COST_WARNING,
  FILE_TOKEN_COUNT_WARNING,
} from '../../default-config';
import { calculateSessionCost, calculateUsageCost, combineUsage } from '../../engine/session';
import { tokenizer } from '../../engine/tokenizer';
import * as output from '../../output';
import { formatCost, formatTokenCount } from '../../format';
import type { ModelResponse } from '../../engine/inference';
import { getProvider, type Provider, type ProviderName } from '../../engine/providers/provider';
import type { ConfigFile } from '../../config-file';
import type { SessionContext } from './types';
import { providerOptionMapping } from '.';

export async function handleMessage(session: SessionContext, message: string) {
  output.outputAiProgress('Thinking...');

  session.messages.push({ role: 'user', content: message });
  const response = await session.provider.getChatCompletion(session.config, session.messages);
  session.totalUsage = combineUsage(session.totalUsage, response.usage);

  output.clearLine();
  output.outputVerbose(`Response Object: ${JSON.stringify(response.response, null, 2)}`);

  const outputParams = getOutputParams(session, response);
  output.outputAi(response.messageText ?? '(null)', outputParams);
  session.messages.push({ role: 'assistant', content: response.messageText ?? '' });
}

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
      `Using the provided file will increase conversation costs by ${costOrTokens} per message.`
    );
  } else {
    output.outputInfo(
      `Using the provided file will increase conversation costs by ${costOrTokens} per message.`
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

function getOutputParams(session: SessionContext, response: ModelResponse): output.OutputAiOptions {
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
