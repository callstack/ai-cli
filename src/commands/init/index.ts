import prompts from 'prompts';
import { checkIfConfigExists, createConfigFile } from '../../config-file';
import * as output from '../../output';

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
      message: 'Which inference provider would you like to set up:',
      choices: [
        { title: 'OpenAI', value: 'openAi' },
        { title: 'Perplexity', value: 'perplexity' },
      ],
      initial: 0,
      hint: '',
    },
    {
      type: 'confirm',
      message: 'Do you already have OpenAI API key?',
      name: 'hasApiKey',
    },
    {
      type: (prev) => (prev ? 'password' : null),
      name: 'apiKey',
      message: 'Paste your OpenAI key here:',
      mask: '',
      validate: (value) => (value === '' ? 'Api key cannot be an empty string' : true),
    },
  ]);

  if (!response.hasApiKey) {
    output.outputDefault('You can get it from here:');
    switch (response.provider) {
      case 'perplexity': {
        output.outputDefault('https://www.perplexity.ai/settings/api');
        return;
      }
      case 'openAi': {
        output.outputDefault('https://www.platform.openai.com/api-keys');
        return;
      }
    }
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
  output.outputBold('For one of questions ask the prompt as command params');
  output.outputDefault('$ ai "Tell me a joke" \n');

  output.outputBold('For interactive session use `-i` (or "--interactive") option. ');
  output.outputDefault('$ ai -i "Tell me an interesting fact about JavaScript"\n');

  output.outputBold("Or just start 'ai' without any parameters.");
  output.outputDefault('$ ai \n');
}
