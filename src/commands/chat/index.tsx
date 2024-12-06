import { Application, createApp, Message } from '@callstack/byorg-core';
import type { CommandModule } from 'yargs';
import { parseConfigFile } from '../../config-file.js';
import { colorAssistant } from '../../output/colors.js';
import {
  clearCurrentLine,
  output,
  outputError,
  readUserInput,
  setInterruptHandler,
  setVerbose,
} from '../../output/index.js';
import { processChatCommand } from './commands.js';
import { cliOptions, type CliOptions } from './cli-options.js';
import { formatResponse } from './format.js';
import { getProvider, getProviderConfig, initProvider } from './providers.js';
import { spinnerStart, spinnerStop, spinnerUpdate } from './spinner.js';
import { messages } from './state.js';
import { texts } from './texts.js';

export const command: CommandModule<{}, CliOptions> = {
  command: ['chat', '$0'],
  describe: 'Start a conversation with AI assistant.',
  builder: cliOptions,
  handler: (args) => run(args._.join(' '), args),
};

let shouldExit = false;

async function run(initialPrompt: string, options: CliOptions) {
  setVerbose(options.verbose ?? false);

  try {
    const configFile = parseConfigFile();
    initProvider(options, configFile);
    const app = createApp({
      chatModel: getProvider().getChatModel(getProviderConfig()),
      systemPrompt: () => getProviderConfig().systemPrompt,
    });

    if (initialPrompt) {
      messages.push({ role: 'user', content: initialPrompt });
    }

    setInterruptHandler(() => {
      spinnerStop();
      clearCurrentLine();
      console.log('\nBye...');
      shouldExit = true;
    });

    if (messages.length > 0) {
      messages.forEach((m) => outputMessage(m));
      await processMessages(app, messages);
    }

    while (!shouldExit) {
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
  const stream = getProviderConfig().stream;

  const onPartialUpdate = (content: string) => {
    spinnerUpdate(colorAssistant(`${texts.assistantLabel} ${content}`));
  };

  spinnerStart(colorAssistant(texts.assistantLabel));
  const { response } = await app.processMessages(messages, {
    onPartialResponse: stream ? onPartialUpdate : undefined,
  });

  if (response.role === 'assistant') {
    messages.push({ role: 'assistant', content: response.content });
    spinnerStop(`${formatResponse(response)}\n`);
  } else {
    spinnerStop(response.content);
  }
}

function outputMessage(message: Message) {
  if (message.role === 'user') {
    output(`${texts.userLabel} ${message.content}`);
  } else {
    output(colorAssistant(`${texts.assistantLabel} ${message.content}`));
  }
}
