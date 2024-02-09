import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { Type, type Static } from '@sinclair/typebox';
import { Value } from '@sinclair/typebox/value';

const CONFIG_FILENAME = '.airc';

const ProvidersSchema = Type.Object({
  openAi: Type.Optional(
    Type.Object({
      apiKey: Type.String({ default: '' }),
      model: Type.String({ default: 'gpt-4' }),
    })
  ),
  perplexity: Type.Optional(
    Type.Object({
      apiKey: Type.String({ default: '' }),
      model: Type.String({ default: 'pplx-70b-online' }),
    })
  ),
});

const ConfigFileSchema = Type.Object({
  providers: ProvidersSchema,
});

export type ConfigFile = Static<typeof ConfigFileSchema>;

export async function parseConfigFile() {
  const configPath = path.join(os.homedir(), CONFIG_FILENAME);

  await writeEmptyConfigFileIfNeeded();

  const content = await fs.promises.readFile(configPath);
  const json = JSON.parse(content.toString());

  const configWithDefaults = Value.Default(ConfigFileSchema, json);
  const typedConfig = Value.Decode(ConfigFileSchema, configWithDefaults);
  if (!typedConfig.providers.openAi?.apiKey && !typedConfig.providers.perplexity?.apiKey) {
    throw new Error("Add your OpenAI or Perplexity API key to '~/.airc' and try again.");
  }

  return typedConfig;
}

const emptyConfigContents = {
  providers: {},
};

export async function writeEmptyConfigFileIfNeeded() {
  const configPath = path.join(os.homedir(), CONFIG_FILENAME);
  if (fs.existsSync(configPath)) {
    return;
  }

  await fs.promises.writeFile(configPath, JSON.stringify(emptyConfigContents, null, 2) + '\n');
}
