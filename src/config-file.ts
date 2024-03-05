import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { z } from 'zod';
import {
  DEFAULT_OPEN_AI_MODEL,
  DEFAULT_PERPLEXITY_MODEL,
  DEFAULT_SYSTEM_PROMPT,
} from './default-config.js';
import * as output from './output.js';

const LEGACY_CONFIG_FILENAME = '.airc';
const CONFIG_FILENAME = '.airc.json';

const ProvidersSchema = z.object({
  openAi: z.optional(
    z.object({
      apiKey: z.string(),
      model: z.string().default(DEFAULT_OPEN_AI_MODEL),
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
  showStats: z.boolean().default(false),
  showCosts: z.boolean().default(false),
});

export type ConfigFile = z.infer<typeof ConfigFileSchema>;

export async function parseConfigFile() {
  const configPath = path.join(os.homedir(), CONFIG_FILENAME);

  const content = await fs.promises.readFile(configPath);
  const json = JSON.parse(content.toString());

  const typedConfig = ConfigFileSchema.parse(json);
  output.outputVerbose(`Config with defaults: ${JSON.stringify(typedConfig, null, 2)}`);
  if (!typedConfig.providers.openAi?.apiKey && !typedConfig.providers.perplexity?.apiKey) {
    throw new Error('Add your OpenAI or Perplexity API key to "~/.airc.json" and try again.');
  }

  return typedConfig;
}

export async function createConfigFile(configContents: ConfigFile) {
  const configPath = path.join(os.homedir(), CONFIG_FILENAME);
  await fs.promises.writeFile(configPath, JSON.stringify(configContents, null, 2) + '\n');
}

export function checkIfConfigExists() {
  const legacyConfigPath = path.join(os.homedir(), LEGACY_CONFIG_FILENAME);
  const configPath = path.join(os.homedir(), CONFIG_FILENAME);

  if (fs.existsSync(legacyConfigPath) && !fs.existsSync(configPath)) {
    fs.renameSync(legacyConfigPath, configPath);
  }

  return fs.existsSync(configPath);
}
