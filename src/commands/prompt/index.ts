import * as fs from 'fs';
import * as path from 'path';
import type { CommandModule } from 'yargs';
import { checkIfConfigExists, parseConfigFile } from '../../config-file';
import { type Message } from '../../inference';
import { inputLine } from '../../input';
import * as output from '../../output';
import { getDefaultProvider, providerOptions, resolveProviderFromOption } from '../../providers';
import { init } from '../init/init';
import { DEFAULT_FILE_PROMPT, FILE_TOKEN_COUNT_WARNING } from '../../default-config';
import { tokenizer } from '../../tokenizer';
import { processCommand } from './commands';

export interface PromptOptions {
  /** Interactive mode */
  interactive: boolean;
  /** AI inference provider to be used */
  provider?: string;
  /** AI model to be used */
  model?: string;
  /** Show verbose-level logs. */
  verbose: boolean;
  /** Display usage stats. */
  stats?: boolean;
  /** Display colorized output. Default == autodetect */
  color?: boolean;
  /** Add file to conversation */
  file?: string;
}

export const command: CommandModule<{}, PromptOptions> = {
  command: ['prompt', '$0'],
  describe: '[Default] Ask AI assistant a question or start an interactive conversation.',
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
      })
      .option('stats', {
        type: 'boolean',
        describe: 'Display response stats',
      })
      // Note: no need to handle that explicitly, as it's being picked up automatically by Chalk.
      .option('color', {
        type: 'boolean',
        describe:
          'Forces color output (even if stdout is not a terminal). Use --no-color to disable colors.',
      })
      .option('file', {
        alias: 'f',
        type: 'string',
        describe: 'Add given file to conversation context.',
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
  output.setVerbose(options.verbose);

  const configExists = await checkIfConfigExists();
  if (!configExists) {
    await init();
    return;
  }

  const configFile = await parseConfigFile();
  output.outputVerbose(`Config: ${JSON.stringify(configFile, filterOutApiKey, 2)}`);

  output.setShowStats(options.stats ?? configFile.showStats);

  const provider = options.provider
    ? resolveProviderFromOption(options.provider)
    : getDefaultProvider(configFile);
  output.outputVerbose(`Using provider: ${provider.label}`);

  const initialConfig = configFile.providers[provider.name];
  if (!initialConfig) {
    throw new Error(`Provider config not found: ${provider.name}.`);
  }

  const config = {
    model: options.model ?? initialConfig.model,
    apiKey: initialConfig.apiKey,
    systemPrompt: initialConfig.systemPrompt,
  };

  output.outputVerbose(`Using model: ${config.model}`);

  const messages: Message[] = [];

  if (options.file) {
    const filePath = path.isAbsolute(options.file)
      ? options.file
      : `${process.cwd()}/${options.file}`;

    if (!fs.existsSync(filePath)) {
      throw new Error(`Couln't find provided file: ${options.file}`);
    }
    const fileContent = fs.readFileSync(filePath).toString();

    const tokenCount = tokenizer.getTokensCount(fileContent);

    if (tokenCount <= FILE_TOKEN_COUNT_WARNING) {
      output.outputInfo(`File you provided adds: ~${tokenCount} tokens to conversation`);
    } else {
      output.outputWarning(
        `File you provided adds: ~${tokenCount} tokens to conversation. This might impact the cost.`
      );
    }

    messages.push({
      role: 'system',
      content: DEFAULT_FILE_PROMPT.replace('{fileContent}', fileContent),
    });
  }

  if (initialPrompt) {
    output.outputUser(initialPrompt);
    output.outputAiProgress('Thinking...');

    messages.push({ role: 'user', content: initialPrompt });

    const startTimestamp = performance.now();
    const [content, response] = await provider.getChatCompletion(config, messages);
    const responseTime = performance.now() - startTimestamp;
    const stats = { ...response?.usage, responseTime };

    output.clearLine();
    output.outputVerbose(`Response: ${JSON.stringify(response, null, 2)}`);
    output.outputAi(content ?? '(null)', stats);
    messages.push({ role: 'assistant', content: content ?? '' });
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
    const isCommand = processCommand(userPrompt, { messages, providerName: provider.name, config });
    if (isCommand) {
      continue;
    }

    output.outputAiProgress('Thinking...');

    messages.push({ role: 'user', content: userPrompt });

    const startTimestamp = performance.now();
    const [content, response] = await provider.getChatCompletion(config, messages);
    const responseTime = performance.now() - startTimestamp;
    const stats = { ...response?.usage, responseTime };

    output.clearLine();
    output.outputVerbose(`Response Object: ${JSON.stringify(response, null, 2)}`);
    output.outputAi(content ?? '(null)', stats);
    messages.push({ role: 'assistant', content: content ?? '' });
  }
}

function filterOutApiKey(key: string, value: unknown) {
  if (key === 'apiKey' && typeof value === 'string') {
    return value ? '***' : '';
  }

  return value;
}
