import { checkIfConfigExists, parseConfigFile } from '../../config-file.js';
import { RESPONSE_STYLE_CREATIVE, RESPONSE_STYLE_PRECISE } from '../../default-config.js';
import { combineUsage } from '../../engine/session.js';
import { inputLine } from '../../input.js';
import * as output from '../../output.js';
import { init } from '../init/init.js';
import { processCommand } from './commands.js';
import type { PromptOptions, SessionContext } from './types.js';
import {
  filterOutApiKey,
  getDefaultProvider,
  getOutputParams,
  handleInputFile,
  resolveProviderFromOption,
} from './utils.js';

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

  const session = await createSession(options);

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
      'Type "/exit" or press Ctrl+C to exit. Type "/help" to see available commands.',
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

async function createSession(options: PromptOptions): Promise<SessionContext> {
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
      'You set both creative and precise response styles, falling back to default',
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

  return {
    config,
    provider,
    messages: [],
    totalUsage: { inputTokens: 0, outputTokens: 0, requests: 0 },
  };
}

async function handleMessage(session: SessionContext, message: string) {
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
