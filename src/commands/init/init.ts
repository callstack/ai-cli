import prompts from 'prompts';
import { checkIfConfigExists, createConfigFile } from '../../config-file';
import * as output from '../../output';
import { getProvider } from '../../providers';

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
      message: 'Existing "~/.airc.json" file found, do you want to re-initialize it?',
      name: 'reinitialize',
    });

    if (!response.reinitialize) {
      output.outputDefault('Nothing to do. Exiting.\n');
      return;
    }
  }

  output.outputDefault("Welcome to AI CLI. Let's set you up quickly.\n");

  const response = await prompts([
    {
      type: 'select',
      name: 'provider',
      message: 'Which inference provider would you like to use:',
      choices: [
        { title: 'OpenAI', value: 'openAi' },
        { title: 'Perplexity', value: 'perplexity' },
      ],
      initial: 0,
      hint: '',
    },
    {
      type: 'confirm',
      message: (_, { provider }) => `Do you already have ${getProvider(provider).label} API key?`,
      name: 'hasApiKey',
      initial: true,
    },
    {
      type: (prev) => (prev ? 'password' : null),
      name: 'apiKey',
      message: (_, { provider }) => `Paste ${getProvider(provider).label} API key here:`,
      mask: '',
      validate: (value) => (value === '' ? 'API key cannot be an empty string' : true),
    },
  ]);

  const provider = getProvider(response.provider);
  if (!response.hasApiKey) {
    output.outputDefault(`You can get your ${provider.label} API key here:`);
    output.outputDefault(provider.apiKeyUrl);
    return;
  }

  await createConfigFile({
    providers: {
      [provider.name]: {
        apiKey: response.apiKey,
      },
    },
    showStats: false,
  });

  output.outputDefault(
    '\nI have written your settings into "~/.airc.json" file. You can now start using AI CLI.\n'
  );
  output.outputDefault('For a single question and answer just pass a prompt as a param:');
  output.outputBold('$ ai "Tell me a useful productivity hack"\n');

  output.outputDefault('For interactive session use "-i" (or "--interactive") option: ');
  output.outputBold('$ ai -i "Tell me an interesting fact about JavaScript"\n');
}
