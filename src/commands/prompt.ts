import type { CommandModule } from 'yargs';
import { parseConfig } from '../config';
import { getChatCompletion, type Message } from '../inference';
import { inputLine } from '../input';
import * as output from '../output';

export interface PromptOptions {
  interactive: boolean;

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
      .option('verbose', {
        alias: 'V',
        type: 'boolean',
        default: false,
        describe: 'Verbose output',
      }),
  handler: (args) => run(args._.join(' '), args),
};

export async function run(initialPrompt: string, options: PromptOptions) {
  if (options.verbose) {
    output.setVerbose(true);
  }

  const config = await parseConfig();
  output.outputVerbose(`Config: ${JSON.stringify(config, null, 2)}`);

  const messages: Message[] = [];

  if (initialPrompt.trim()) {
    output.outputUser(initialPrompt);
    output.outputAiProgress('Thinking...');

    messages.push({ role: 'user', content: initialPrompt });
    const [content, response] = await getChatCompletion(config, messages);

    output.clearLine();
    output.outputVerbose('Response:', response);
    output.outputAi(content);
    messages.push({ role: 'assistant', content: content ?? '' });
  } else {
    output.outputAi('Hello, how can I help you? Press Cmd+C to exit.');
  }

  if (!options.interactive) {
    return;
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const userPrompt = await inputLine('me: ');
    output.outputAiProgress('Thinking...');

    messages.push({ role: 'user', content: userPrompt });
    const [content, response] = await getChatCompletion(config, messages);
    output.clearLine();
    output.outputVerbose(`Response Object: ${JSON.stringify(response, null, 2)}`);
    output.outputAi(content);
    messages.push({ role: 'assistant', content: content ?? '' });
  }
}
