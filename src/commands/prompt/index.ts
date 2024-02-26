import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import type { CommandModule } from 'yargs';
import { checkIfConfigExists, parseConfigFile } from '../../config-file';
import {
  DEFAULT_FILE_PROMPT,
  FILE_COST_WARNING,
  FILE_TOKEN_COUNT_WARNING,
  RESPONSE_STYLE_CREATIVE,
  RESPONSE_STYLE_PRECISE,
} from '../../default-config';
import { formatCost, formatTokenCount } from '../../format';
import { type ModelResponse } from '../../inference';
import { inputLine } from '../../input';
import * as output from '../../output';
import {
  getDefaultProvider,
  providerOptions,
  resolveProviderFromOption,
} from '../../providers/provider';
import { calculateSessionCosts, calculateUsageCost, combineUsage } from '../../providers/session';
import { tokenizer } from '../../tokenizer';
import { init } from '../init/init';
import { processCommand } from './commands';
import type { PromptOptions, SessionContext } from './types';

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
      .option('creative', {
        type: 'boolean',
        describe: 'Response style: creative',
      })
      .option('precise', {
        type: 'boolean',
        describe: 'Response style: precise',
      })
      .option('costs', {
        type: 'boolean',
        describe: 'Display usage costs',
      })
      .option('stats', {
        type: 'boolean',
        describe: 'Display usage stats',
      })
      // Note: no need to handle that explicitly, as it's being picked up automatically by Chalk.
      .option('color', {
        type: 'boolean',
        describe:
          'Forces color output (even if stdout is not a terminal). Use --no-color to disable colors.',
      })
      .option('file', {
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
    output.outputAiProgress('Thinking...');

    session.messages.push({ role: 'user', content: initialPrompt });
    const response = await provider.getChatCompletion(config, session.messages);
    session.totalUsage = combineUsage(session.totalUsage, response.usage);

    output.clearLine();
    output.outputVerbose(`Response: ${JSON.stringify(response.response, null, 2)}`);

    const outputParams = getOutputParams(session, response);
    output.outputAi(response.messageText ?? '(null)', outputParams);
    session.messages.push({ role: 'assistant', content: response.messageText ?? '' });
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

    output.outputAiProgress('Thinking...');

    session.messages.push({ role: 'user', content: userPrompt });
    const response = await provider.getChatCompletion(config, session.messages);
    session.totalUsage = combineUsage(session.totalUsage, response.usage);

    output.clearLine();
    output.outputVerbose(`Response Object: ${JSON.stringify(response.response, null, 2)}`);

    const outputParams = getOutputParams(session, response);
    output.outputAi(response.messageText ?? '(null)', outputParams);
    session.messages.push({ role: 'assistant', content: response.messageText ?? '' });
  }
}

function filterOutApiKey(key: string, value: unknown) {
  if (key === 'apiKey' && typeof value === 'string') {
    return value ? '***' : '';
  }

  return value;
}

function handleInputFile(context: SessionContext, inputFile: string) {
  const filePath = path.resolve(inputFile.replace('~', os.homedir()));

  if (!fs.existsSync(filePath)) {
    throw new Error(`Couldn't find provided file: ${inputFile}`);
  }

  const fileContent = fs.readFileSync(filePath).toString();
  const fileTokens = tokenizer.getTokensCount(fileContent);
  const fileCost = calculateUsageCost(
    { inputTokens: fileTokens, outputTokens: 0, requests: 0 },
    context.provider.pricing[context.config.model]
  );

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

function getOutputParams(session: SessionContext, response: ModelResponse): output.OutputAiOptions {
  const usage = {
    total: session.totalUsage,
    current: response.usage,
  };

  const pricing =
    session.provider.pricing[response.responseModel] ??
    session.provider.pricing[session.config.model];
  const costs = calculateSessionCosts(usage, pricing);

  return {
    responseTime: response.responseTime,
    usage,
    costs,
  };
}
