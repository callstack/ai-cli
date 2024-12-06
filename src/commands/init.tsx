import { intro, confirm, log, outro, select, isCancel, text, note } from '@clack/prompts';
import type { CommandModule } from 'yargs';
import { checkIfConfigExists, writeConfigFile } from '../config-file.js';
import { ProviderName, providers, providersMap } from '../engine/providers/provider.js';
import { outputError } from '../output.js';

export const command: CommandModule<{}> = {
  command: ['init'],
  describe: 'Basic configuration of AI CLI.',
  handler: () => run(),
};

export async function run() {
  try {
    intro('Welcome to AI CLI!');

    const hasConfig = checkIfConfigExists();
    if (hasConfig) {
      const overwrite = await confirm({
        message: 'Existing "~/.airc.json" file found, do you want to overwrite it?',
        initialValue: false,
      });
      if (isCancel(overwrite)) return;

      if (!overwrite) {
        outro('Nothing to do. Exiting.');
        return;
      }
    }

    log.message("Let's set you up quickly.");

    const provider = await select({
      message: 'Which AI provider would you like to use:',
      options: providers.map((p) => ({ label: p.label, value: p.name })),
    });
    if (isCancel(provider)) return;

    const apiKey = await text({
      message: `Paste ${providersMap[provider].label} API key here:`,
      placeholder: `Get your key at ${providersMap[provider].apiKeyUrl}`,
      validate: (value) => {
        if (!value) {
          return 'API key is required.';
        }
      },
    });
    if (isCancel(apiKey)) return;

    writeConfig(provider, apiKey);
    log.step('Written your settings into "~/.airc.json" file.');

    note('$ ai "Tell me a useful productivity hack"', 'You can now use AI CLI');

    outro('Done!');
  } catch (error) {
    outputError(error);
    process.exit(1);
  }
}

function writeConfig(provider: ProviderName, apiKey: string) {
  writeConfigFile({
    providers: {
      [provider]: { apiKey },
    },
  });
}
