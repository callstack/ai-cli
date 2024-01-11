import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';
import { outputError } from './output';

const CONFIG_FILENAME = '.airc';
const DEFAULT_MODEL = 'gpt-4';

const ConfigSchema = Type.Object({
  openAiApiKey: Type.String({ default: '' }),
  model: Type.String({ default: DEFAULT_MODEL }),
});

export type Config = Static<typeof ConfigSchema>;

export async function parseConfig() {
  const configPath = path.join(os.homedir(), CONFIG_FILENAME);

  await writeEmptyConfigIfNeeded();

  const content = await fs.promises.readFile(configPath);
  const json = JSON.parse(content.toString());

  const configWithDefaults = Value.Default(ConfigSchema, json);
  const typedConfig = Value.Decode(ConfigSchema, configWithDefaults);
  if (typedConfig.openAiApiKey === '') {
    outputError("Add your OpenAI API key to '~/.airc' and try again.");
    process.exit(1);
  }

  return typedConfig;
}

export async function writeEmptyConfigIfNeeded() {
  const configPath = path.join(os.homedir(), CONFIG_FILENAME);
  if (fs.existsSync(configPath)) {
    return;
  }

  await fs.promises.writeFile(configPath, JSON.stringify({ openAiApiKey: '' }, null, 2) + '\n');
}
