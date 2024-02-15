import type { CommandModule } from 'yargs';
import { parseConfigFile } from '../config-file';
import { type Message } from '../inference';
import { inputLine } from '../input';
import * as output from '../output';
import { providers, providerOptions, resolveProviderName } from '../providers';

export interface PromptOptions {
  /** Interactive mode */
  interactive: boolean;

  /** AI inference provider to be used */
  provider?: string;

  /** AI model to be used */
  model?: string;

  /** Show verbose-level logs. */
  verbose: boolean;
}

export const command: CommandModule<{}, PromptOptions> = {
  command: ['$0'],
  describe: 'ask the AI with prompt',
  builder: (yargs) =>
    yargs
      .option('interactive', {
        alias: 'i',
        type: 'boolean',
        default: false,
        describe: 'Start an interactive conversation',
      })
      .options('provider', {
        alias: 'p',
        type: 'string',
        describe: 'AI provider to be used',
        choices: providerOptions,
      })
      .options('model', {
        alias: 'm',
        type: 'string',
        describe: 'AI model to be used',
      })
      .option('verbose', {
        alias: 'V',
        type: 'boolean',
        default: false,
        describe: 'Verbose output',
      }),
  handler: (args) => run(args._.join(' '), args),
};

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
  if (options.verbose) {
    output.setVerbose(true);
  }

  const configFile = await parseConfigFile();
  output.outputVerbose(`Config: ${JSON.stringify(configFile, filterOutApiKey, 2)}`);

  const providerName = resolveProviderName(options.provider, configFile);
  const provider = providers[providerName];
  output.outputVerbose(`Using provider: ${providerName}`);

  const initialConfig = configFile.providers[providerName];
  if (!initialConfig) {
    throw new Error(`Provider config not found: ${providerName}.`);
  }

  const config = {
    model: options.model ?? initialConfig.model,
    apiKey: initialConfig.apiKey,
    systemPrompt: initialConfig.systemPrompt,
  };

  output.outputVerbose(`Using model: ${config.model}`);

  const messages: Message[] = [];

  if (initialPrompt) {
    output.outputUser(initialPrompt);
    output.outputAiProgress('Thinking...');

    messages.push({ role: 'user', content: initialPrompt });
    const [content, response] = await provider.getChatCompletion(config, messages);

    output.clearLine();
    output.outputVerbose(`Response: ${JSON.stringify(response, null, 2)}`);
    output.outputAi(content ?? '(null)');
    messages.push({ role: 'assistant', content: content ?? '' });
  } else {
    output.outputAi('Hello, how can I help you? ');
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
    const isCommand = processCommandIfNeeded(userPrompt, { messages, providerName, config });
    if (isCommand) {
      continue;
    }

    output.outputAiProgress('Thinking...');

    messages.push({ role: 'user', content: userPrompt });
    const [content, response] = await provider.getChatCompletion(config, messages);
    output.clearLine();
    output.outputVerbose(`Response Object: ${JSON.stringify(response, null, 2)}`);
    output.outputAi(content ?? '(null)');
    messages.push({ role: 'assistant', content: content ?? '' });
  }
}

function filterOutApiKey(key: string, value: unknown) {
  if (key === 'apiKey' && typeof value === 'string') {
    return value ? '***' : '';
  }

  return value;
}

interface CommandContext {
  messages: Message[];
  providerName: string;
  config: {
    model: string;
    systemPrompt: string;
  };
}

function processCommandIfNeeded(input: string, context: CommandContext): boolean {
  if (!input.startsWith('/')) {
    return false;
  }

  const [command, ...args] = input.split(' ');
  if (command === '/exit') {
    process.exit(0);
    // No need to return.
  }

  if (command === '/help') {
    output.outputInfo('Available commands:');
    output.outputInfo('- /exit: Exit the program');
    output.outputInfo(
      '- /reset-context: Reset conversation context: AI replies will forget previous messages'
    );
    output.outputInfo('- /verbose [on|off]: Enable or disable verbose output.');
    return true;
  }

  if (command === '/reset-context') {
    // Drop all messages from context.
    context.messages.length = 0;
    output.outputInfo('Context reset: AI replies will forget previous messages.', context.messages);
    return true;
  }

  if (command === '/verbose') {
    output.setVerbose(args[0] !== 'off');
    output.outputInfo(`Verbose mode: ${output.isVerbose() ? 'on' : 'off'}`);
    return true;
  }

  if (command === '/info') {
    output.outputInfo(`Provider: ${context.providerName}, model: ${context.config.model}`);
    output.outputInfo('System prompt:', context.config.systemPrompt);
    output.outputVerbose('Current context:', JSON.stringify(context.messages, null, 2));
    return true;
  }

  output.outputError(`Unknown command: ${command} ${args.join(' ')}`);
  return true;
}
