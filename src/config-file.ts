import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { z } from 'zod';

const CONFIG_FILENAME = '.airc';

const ProvidersSchema = z.object({
  openAi: z.optional(
    z.object({
      apiKey: z.string(),
      model: z.string().default('gpt-4'),
    })
  ),
  perplexity: z.optional(
    z.object({
      apiKey: z.string(),
      model: z.string().default('pplx-7b-online'),
    })
  ),
});

const ConfigFileSchema = z.object({
  providers: ProvidersSchema,
});

export type ConfigFile = z.infer<typeof ConfigFileSchema>;

export async function parseConfigFile() {
  const configPath = path.join(os.homedir(), CONFIG_FILENAME);

  await writeEmptyConfigFileIfNeeded();

  const content = await fs.promises.readFile(configPath);
  const json = JSON.parse(content.toString());

  const typedConfig = ConfigFileSchema.parse(json);
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
