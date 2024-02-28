import { checkIfConfigExists, parseConfigFile } from '../../config-file';
import { RESPONSE_STYLE_CREATIVE, RESPONSE_STYLE_PRECISE } from '../../default-config';
import { inputLine } from '../../input';
import * as output from '../../output';
import { init } from '../init/init';
import { processCommand } from './commands';
import type { PromptOptions, SessionContext } from './types';
import {
  filterOutApiKey,
  getDefaultProvider,
  handleInputFile,
  handleMessage,
  resolveProviderFromOption,
} from './utils';

export async function run(initialPrompt: string, options: PromptOptions) {
  try {
    await runInternal(initialPrompt.trim(), options);
  } catch (error) {
    output.clearLine();
    output.outputError(error);
    process.exit(1);
  }
}

async function runInternal(initialPrompt: string, options: PromptOptions) {
  output.setVerbose(options.verbose);

  const configExists = await checkIfConfigExists();
  if (!configExists) {
    await init();
    return;
  }

  const configFile = await parseConfigFile();
  output.outputVerbose(`Config: ${JSON.stringify(configFile, filterOutApiKey, 2)}`);
  output.setShowStats(options.stats ?? configFile.showStats);
  output.setShowCosts(options.costs ?? configFile.showCosts);

  const provider = options.provider
    ? resolveProviderFromOption(options.provider)
    : getDefaultProvider(configFile);
  output.outputVerbose(`Using provider: ${provider.label}`);

  const initialConfig = configFile.providers[provider.name];
  if (!initialConfig) {
    throw new Error(`Provider config not found: ${provider.name}.`);
  }

  let style = {};

  if (options.creative && options.precise) {
    output.outputWarning(
      'You set both creative and precise response styles, falling back to default'
    );
  } else {
    if (options.creative) {
      style = RESPONSE_STYLE_CREATIVE;
    }
    if (options.precise) {
      style = RESPONSE_STYLE_PRECISE;
    }
  }

  const config = {
    model: options.model ?? initialConfig.model,
    apiKey: initialConfig.apiKey,
    systemPrompt: initialConfig.systemPrompt,
    ...style,
  };

  output.outputVerbose(`Using model: ${config.model}`);

  const session: SessionContext = {
    config,
    provider,
    messages: [],
    totalUsage: { inputTokens: 0, outputTokens: 0, requests: 0 },
  };

  if (options.file) {
    handleInputFile(session, options.file);
  }

  if (initialPrompt) {
    output.outputUser(initialPrompt);
    await handleMessage(session, initialPrompt);
  } else {
    output.outputAi('Hello, how can I help you?');
  }

  if (options.interactive || !initialPrompt) {
    output.outputInfo(
      'Type "/exit" or press Ctrl+C to exit. Type "/help" to see available commands.'
    );
  } else {
    process.exit(0);
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const userPrompt = await inputLine('me: ');
    const isCommand = processCommand(session, userPrompt);
    if (isCommand) {
      continue;
    }

    await handleMessage(session, userPrompt);
  }
}
