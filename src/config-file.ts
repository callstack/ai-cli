import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { z } from 'zod';
import * as output from './output';

const CONFIG_FILENAME = '.airc';
const DEFAULT_OPENAI_MODEL = 'gpt-4';
const DEFAULT_PERPLEXITY_MODEL = 'pplx-7b-online';
const DEFAULT_SYSTEM_PROMPT =
  'You are a helpful assistant responding in a concise manner to user questions.';

const ProvidersSchema = z.object({
  openAi: z.optional(
    z.object({
      apiKey: z.string(),
      model: z.string().default(DEFAULT_OPENAI_MODEL),
      systemPrompt: z.string().default(DEFAULT_SYSTEM_PROMPT),
    })
  ),
  perplexity: z.optional(
    z.object({
      apiKey: z.string(),
      model: z.string().default(DEFAULT_PERPLEXITY_MODEL),
      systemPrompt: z.string().default(DEFAULT_SYSTEM_PROMPT),
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
  output.outputVerbose(`Config with defaults: ${JSON.stringify(typedConfig, null, 2)}`);
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
