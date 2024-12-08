import { Application, AssistantResponse, createApp, Message } from '@callstack/byorg-core';
import type { CommandModule } from 'yargs';
import { checkIfConfigExists, parseConfigFile } from '../../config-file.js';
import { getVerbose, output, outputError, outputSystem, setVerbose } from '../../output.js';
import { run as runInit } from '../init.js';
import { colorAssistant, colorVerbose } from '../../colors.js';
import { formatSpeed, formatTime } from '../../format.js';
import { initInput, readUserInput, setInterruptHandler } from './input.js';
import { processChatCommand } from './commands.js';
import { cliOptions, type CliOptions } from './cli-options.js';
import { getProvider, getProviderConfig, initProvider } from './providers.js';
import { streamingClear, streamingFinish, streamingStart, streamingUpdate } from './streaming.js';
import { messages, updateUsage } from './state.js';
import { texts } from './texts.js';
import { exit } from './utils.js';

export const command: CommandModule<{}, CliOptions> = {
  command: ['chat', '$0'],
  describe: 'Start a conversation with AI assistant.',
  builder: cliOptions,
  handler: (args) => run(args._.join(' '), args),
};

async function run(initialPrompt: string, options: CliOptions) {
  const hasConfig = checkIfConfigExists();
  if (!hasConfig) {
    await runInit();
    return;
  }

  setVerbose(options.verbose ?? false);
  initInput();

  try {
    const configFile = parseConfigFile();
    initProvider(options, configFile);

    const app = createApp({
      chatModel: getProvider().getChatModel(getProviderConfig()),
      systemPrompt: () => getProviderConfig().systemPrompt ?? '',
    });

    if (initialPrompt) {
      messages.push({ role: 'user', content: initialPrompt });
    }

    setInterruptHandler(() => {
      streamingClear();
      exit();
    });

    if (messages.length > 0) {
      messages.forEach((m) => outputMessage(m));
      await processMessages(app, messages);
    }

    outputSystem(texts.initialHelp);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const userMessage = await readUserInput();
      if (processChatCommand(userMessage)) {
        continue;
      }

      messages.push({ role: 'user', content: userMessage });
      await processMessages(app, messages);
    }
  } catch (error) {
    outputError(error);
    process.exit(1);
  }
}

async function processMessages(app: Application, messages: Message[]) {
  const providerConfig = getProviderConfig();
  const modelOptions = getProvider().modelOptions[providerConfig.model];
  const stream = modelOptions?.stream ?? providerConfig.stream;

  const onPartialUpdate = (content: string) => {
    streamingUpdate(colorAssistant(`${texts.assistantLabel} ${content}`));
  };

  streamingStart(colorAssistant(texts.assistantLabel));
  const { response } = await app.processMessages(messages, {
    onPartialResponse: stream ? onPartialUpdate : undefined,
  });

  if (response.role === 'assistant') {
    streamingFinish(`${formatResponse(response)}\n`);
    messages.push({ role: 'assistant', content: response.content });
    updateUsage(response.usage);
  } else {
    streamingFinish(response.content);
  }

  // Insert empty line after each response
  output('');
}

function outputMessage(message: Message) {
  if (message.role === 'user') {
    output(`${texts.userLabel} ${message.content}`);
  } else {
    output(colorAssistant(`${texts.assistantLabel} ${message.content}`));
  }
}

export function formatResponse(response: AssistantResponse) {
  let result = colorAssistant(`${texts.assistantLabel} ${response.content}`);

  if (getVerbose()) {
    const stats = `${formatTime(response.usage.responseTime)} ${formatSpeed(
      response.usage?.outputTokens,
      response.usage.responseTime,
    )}`;
    result += ` ${colorVerbose(stats)}`;
  }

  return result;
}
