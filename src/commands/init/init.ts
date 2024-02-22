import prompts from 'prompts';
import { checkIfConfigExists, createConfigFile } from '../../config-file';
import * as output from '../../output';
import { resolveProvider } from '../../providers';

export async function init() {
  try {
    await initInternal();
  } catch (error) {
    output.clearLine();
    output.outputError(error);
    process.exit(1);
  }
}

async function initInternal() {
  const configExists = checkIfConfigExists();

  if (configExists) {
    const response = await prompts({
      type: 'confirm',
      message: 'Config found, do you want to re-initialize it?',
      name: 'reinitialize',
    });

    if (!response.reinitialize) {
      output.outputBold('Cancelling initialization');
      return;
    }
  }

  output.outputBold("Welcome to AI CLI. Let's set you up quickly.");

  const response = await prompts([
    {
      type: 'select',
      name: 'provider',
      message: 'Which inference provider would you like to use:',
      choices: [
        { title: 'OpenAI', value: 'openai' },
        { title: 'Perplexity', value: 'perplexity' },
      ],
      initial: 0,
      hint: '',
    },
    {
      type: 'confirm',
      message: (_, { provider }) =>
        `Do you already have ${resolveProvider(provider).label} API key?`,
      name: 'hasApiKey',
    },
    {
      type: (prev) => (prev ? 'password' : null),
      name: 'apiKey',
      message: (_, { provider }) => `Paste ${resolveProvider(provider).label} API key here:`,
      mask: '',
      validate: (value) => (value === '' ? 'API key cannot be an empty string' : true),
    },
  ]);

  if (!response.hasApiKey) {
    const provider = resolveProvider(response.provider);
    output.outputDefault(`You can get your ${provider.label} API key here:`);
    output.outputDefault(provider.apiKeyUrl);
    return;
  }

  await createConfigFile({
    providers: {
      [response.provider]: {
        apiKey: response.apiKey,
      },
    },
  });

  output.outputBold(
    "\nI have written your settings into '~/.airc.json` file. You can now start using AI CLI.\n"
  );
  output.outputBold('For a single question and answer just pass the prompt as param');
  output.outputDefault('$ ai "Tell me a joke" \n');

  output.outputBold('For interactive session use "-i" (or "--interactive") option. ');
  output.outputDefault('$ ai -i "Tell me an interesting fact about JavaScript"\n');

  output.outputBold('or just start "ai" without any params.');
  output.outputDefault('$ ai \n');
}
